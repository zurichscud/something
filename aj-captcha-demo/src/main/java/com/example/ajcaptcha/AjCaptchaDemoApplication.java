package com.example.ajcaptcha;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * AJ-Captcha 行为验证码 Demo。
 *
 * <p>启动后访问 <a href="http://localhost:8080">http://localhost:8080</a> 即可体验：
 * 滑动拼图（blockPuzzle）与文字点选（clickWord），以及登录接口里的二次校验。</p>
 */
@SpringBootApplication
public class AjCaptchaDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(AjCaptchaDemoApplication.class, args);
    }
}
