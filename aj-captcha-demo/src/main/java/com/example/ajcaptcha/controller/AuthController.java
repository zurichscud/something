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

/**
 * 业务接口示例：登录时先做验证码二次校验。
 *
 * <p>前端在验证码 success 回调里拿到 captchaVerification，把它和用户名密码一起提交，
 * 后端调用 {@link CaptchaService#verification} 校验（校验一次即失效）。</p>
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final CaptchaService captchaService;

    public AuthController(CaptchaService captchaService) {
        this.captchaService = captchaService;
    }

    @PostMapping("/login")
    public LoginResult login(@RequestBody LoginRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()
                || request.getPassword() == null || request.getPassword().isEmpty()) {
            return LoginResult.fail("0011", "用户名或密码不能为空", null);
        }

        // 1. 验证码二次校验
        CaptchaVO captchaVO = new CaptchaVO();
        captchaVO.setCaptchaVerification(request.getCaptchaVerification());
        ResponseModel captchaResponse = captchaService.verification(captchaVO);
        log.info("login user={} captchaRepCode={} repMsg={}",
                request.getUsername(), captchaResponse.getRepCode(), captchaResponse.getRepMsg());
        if (!captchaResponse.isSuccess()) {
            return LoginResult.fail(captchaResponse.getRepCode(),
                    "验证码校验失败：" + captchaResponse.getRepMsg(), null);
        }

        // 2. 验证码通过后，再做真正的账号密码校验（这里用假数据演示）
        if (!"admin".equals(request.getUsername()) || !"123456".equals(request.getPassword())) {
            return LoginResult.fail("0002", "用户名或密码错误（演示账号 admin / 123456）", null);
        }

        return LoginResult.success("登录成功", "admin");
    }

    /** 登录请求体。 */
    public static class LoginRequest {
        private String username;
        private String password;
        /** 验证码二次校验参数，取自前端 success 回调的 params.captchaVerification。 */
        private String captchaVerification;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getCaptchaVerification() {
            return captchaVerification;
        }

        public void setCaptchaVerification(String captchaVerification) {
            this.captchaVerification = captchaVerification;
        }
    }

    /** 登录响应体。 */
    public static class LoginResult {
        private boolean success;
        private String code;
        private String message;
        private String username;

        public static LoginResult success(String message, String username) {
            LoginResult result = new LoginResult();
            result.success = true;
            result.code = "0000";
            result.message = message;
            result.username = username;
            return result;
        }

        public static LoginResult fail(String code, String message, String username) {
            LoginResult result = new LoginResult();
            result.success = false;
            result.code = code;
            result.message = message;
            result.username = username;
            return result;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getCode() {
            return code;
        }

        public String getMessage() {
            return message;
        }

        public String getUsername() {
            return username;
        }
    }
}
