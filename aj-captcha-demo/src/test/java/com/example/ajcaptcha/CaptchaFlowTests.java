package com.example.ajcaptcha;

import com.anji.captcha.model.vo.PointVO;
import com.anji.captcha.service.impl.CaptchaServiceFactory;
import com.anji.captcha.util.AESUtil;
import com.anji.captcha.util.JsonUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * 端到端自测：走一遍 前端 get → check → 业务接口二次校验 的完整流程。
 *
 * <p>验证码坐标只存在服务端缓存里，测试与被测应用在同一个 JVM，因此可以直接读缓存拿到正确答案，
 * 再按前端的加密方式（AES/ECB/PKCS5Padding + Base64）构造 pointJson。</p>
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CaptchaFlowTests {

    /** 与 AbstractCaptchaService.REDIS_CAPTCHA_KEY 一致：缓存坐标的 key 前缀。 */
    private static final String CAPTCHA_KEY = "RUNNING:CAPTCHA:%s";

    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private TestRestTemplate rest;

    @Test
    @DisplayName("滑动拼图：get → check → 登录二次校验，且校验参数只能使用一次")
    void blockPuzzleFlow() throws Exception {
        CaptchaVOData data = getCaptcha("blockPuzzle");
        assertTrue(data.originalImageBase64.length() > 100, "底图应返回 base64");
        assertTrue(data.jigsawImageBase64.length() > 100, "拼图块应返回 base64");

        // 服务端缓存里的正确答案：{"secretKey":"xxx","x":205,"y":5}
        PointVO answer = JsonUtil.parseObject(cacheGet(data.token), PointVO.class);
        assertEquals(data.secretKey, answer.getSecretKey(), "前端拿到的 secretKey 应与缓存一致");

        // 前端行为：拖动距离换算成 x（y 固定 5），再用 secretKey 加密
        String pointJson = "{\"x\":" + answer.getX() + ",\"y\":5}";
        String encryptedPoint = AESUtil.aesEncrypt(pointJson, data.secretKey);

        JsonNode check = post("/captcha/check", body()
                .put("captchaType", "blockPuzzle")
                .put("token", data.token)
                .put("pointJson", encryptedPoint));
        assertEquals("0000", check.path("repCode").asText(), "坐标校验应通过：" + check);

        // check 通过后前端拿到的二次校验参数
        String captchaVerification = AESUtil.aesEncrypt(data.token + "---" + pointJson, data.secretKey);

        JsonNode login = post("/auth/login", body()
                .put("username", "admin")
                .put("password", "123456")
                .put("captchaVerification", captchaVerification));
        assertTrue(login.path("success").asBoolean(), "登录应成功：" + login);
        assertEquals("0000", login.path("code").asText());

        // captchaVerification 只能用一次
        JsonNode again = post("/auth/login", body()
                .put("username", "admin")
                .put("password", "123456")
                .put("captchaVerification", captchaVerification));
        assertFalse(again.path("success").asBoolean(), "同一个校验参数不能复用：" + again);
        assertEquals("6110", again.path("code").asText());
    }

    @Test
    @DisplayName("文字点选：get → check 通过；坐标错误时校验失败")
    void clickWordFlow() throws Exception {
        CaptchaVOData data = getCaptcha("clickWord");
        assertTrue(data.originalImageBase64.length() > 100, "底图应返回 base64");

        List<PointVO> answers = JsonUtil.parseArray(cacheGet(data.token), PointVO.class);
        assertFalse(answers.isEmpty(), "缓存里应有点选坐标");

        String pointJson = toJson(answers);
        JsonNode check = post("/captcha/check", body()
                .put("captchaType", "clickWord")
                .put("token", data.token)
                .put("pointJson", AESUtil.aesEncrypt(pointJson, data.secretKey)));
        assertEquals("0000", check.path("repCode").asText(), "按答案点选应通过：" + check);

        // 换一张验证码，故意点错位置
        CaptchaVOData wrong = getCaptcha("clickWord");
        List<PointVO> wrongAnswers = JsonUtil.parseArray(cacheGet(wrong.token), PointVO.class);
        for (PointVO point : wrongAnswers) {
            point.setX(point.getX() + 100);
        }
        JsonNode failed = post("/captcha/check", body()
                .put("captchaType", "clickWord")
                .put("token", wrong.token)
                .put("pointJson", AESUtil.aesEncrypt(toJson(wrongAnswers), wrong.secretKey)));
        assertEquals("6111", failed.path("repCode").asText(), "坐标错误应校验失败：" + failed);
    }

    private CaptchaVOData getCaptcha(String captchaType) throws Exception {
        JsonNode get = post("/captcha/get", body().put("captchaType", captchaType));
        assertEquals("0000", get.path("repCode").asText(), "获取验证码失败：" + get);
        JsonNode repData = get.path("repData");
        CaptchaVOData data = new CaptchaVOData();
        data.token = repData.path("token").asText();
        data.secretKey = repData.path("secretKey").asText();
        data.originalImageBase64 = repData.path("originalImageBase64").asText();
        data.jigsawImageBase64 = repData.path("jigsawImageBase64").asText();
        assertFalse(data.token.isEmpty(), "token 不能为空");
        assertFalse(data.secretKey.isEmpty(), "secretKey 不能为空（aes-status=true 时会返回）");
        return data;
    }

    private String cacheGet(String token) {
        String value = CaptchaServiceFactory.getCache("local").get(String.format(CAPTCHA_KEY, token));
        assertTrue(value != null && !value.isEmpty(), "缓存里应有坐标，token=" + token);
        return value;
    }

    private static String toJson(List<PointVO> points) {
        StringBuilder sb = new StringBuilder("[");
        for (PointVO point : points) {
            sb.append("{\"x\":").append(point.getX()).append(",\"y\":").append(point.getY()).append("},");
        }
        return sb.deleteCharAt(sb.length() - 1).append("]").toString();
    }

    private JsonNode post(String path, ObjectNode body) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        ResponseEntity<String> response =
                rest.postForEntity(path, new HttpEntity<>(body.toString(), headers), String.class);
        return mapper.readTree(response.getBody());
    }

    private ObjectNode body() {
        return mapper.createObjectNode();
    }

    /** /captcha/get 返回的关键字段。 */
    private static class CaptchaVOData {
        String token;
        String secretKey;
        String originalImageBase64;
        String jigsawImageBase64;
    }
}
