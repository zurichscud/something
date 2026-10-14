package com.example.ajcaptcha.controller;

import com.anji.captcha.model.common.ResponseModel;
import com.anji.captcha.model.vo.CaptchaVO;
import com.anji.captcha.service.CaptchaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * 验证码前后端交互的三个接口。
 *
 * <p>jar 包只提供 {@link CaptchaService}，HTTP 接口需要业务工程自己暴露，接口地址与官方前端组件约定一致：</p>
 * <ul>
 *   <li>POST /captcha/get    获取验证码图片，返回 token、secretKey、底图与拼图/文字图</li>
 *   <li>POST /captcha/check  前端拖动/点选后校验坐标，成功后返回二次校验参数（前端组件内部使用）</li>
 *   <li>POST /captcha/verify 后端二次校验，业务接口（如登录）里调用</li>
 * </ul>
 */
@RestController
@RequestMapping("/captcha")
public class CaptchaController {

    private static final Logger log = LoggerFactory.getLogger(CaptchaController.class);

    private final CaptchaService captchaService;

    public CaptchaController(CaptchaService captchaService) {
        this.captchaService = captchaService;
    }

    /**
     * 获取验证码。
     */
    @PostMapping("/get")
    public ResponseModel get(@RequestBody CaptchaVO data, HttpServletRequest request) {
        data.setBrowserInfo(getRemoteId(request));
        ResponseModel response = captchaService.get(data);
        log.info("get  captchaType={} clientUid={} repCode={}",
                data.getCaptchaType(), data.getClientUid(), response.getRepCode());
        return response;
    }

    /**
     * 校验验证码坐标，一次有效（校验后即失效）。
     */
    @PostMapping("/check")
    public ResponseModel check(@RequestBody CaptchaVO data, HttpServletRequest request) {
        data.setBrowserInfo(getRemoteId(request));
        ResponseModel response = captchaService.check(data);
        log.info("check captchaType={} clientUid={} repCode={} repMsg={}",
                data.getCaptchaType(), data.getClientUid(), response.getRepCode(), response.getRepMsg());
        return response;
    }

    /**
     * 二次校验：前端 success 回调拿到的 captchaVerification，回传给后端做最终确认。
     *
     * <p>一般直接写在业务接口（见 {@code AuthController#login}）里，
     * 这里单独暴露一个接口，方便调试和联调。</p>
     */
    @PostMapping("/verify")
    public ResponseModel verify(@RequestBody CaptchaVO data) {
        ResponseModel response = captchaService.verification(data);
        log.info("verify repCode={} repMsg={}", response.getRepCode(), response.getRepMsg());
        return response;
    }

    /**
     * 客户端标识：IP + User-Agent，开启接口频率限制时用于锁定/计数。
     */
    public static String getRemoteId(HttpServletRequest request) {
        String xfwd = request.getHeader("X-Forwarded-For");
        String ip = getRemoteIpFromXfwd(xfwd);
        String ua = request.getHeader("user-agent");
        if (ip != null && !ip.isEmpty()) {
            return ip + ua;
        }
        return request.getRemoteAddr() + ua;
    }

    private static String getRemoteIpFromXfwd(String xfwd) {
        if (xfwd != null && !xfwd.isEmpty()) {
            String[] ipList = xfwd.split(",");
            return ipList[0].trim();
        }
        return null;
    }
}
