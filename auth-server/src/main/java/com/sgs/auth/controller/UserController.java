package com.sgs.auth.controller;

import com.sgs.auth.dto.user.AuthenticationRequest;
import com.sgs.auth.dto.user.JoinRequest;
import com.sgs.auth.dto.user.UserDto;
import com.sgs.auth.model.User;
import com.sgs.auth.model.UserRole;
import com.sgs.auth.security.JwtTokenProvider;
import com.sgs.auth.service.AuthService;
import com.sgs.auth.util.RedisUtil;
import javassist.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final AuthService authService;

    private final JwtTokenProvider jwtTokenProvider;

    private final RedisUtil redisUtil;

    @PostMapping("/join")
    public ResponseEntity join(@RequestBody JoinRequest joinRequest) {

        try {
            User user = authService.join(
                    joinRequest.getNickname(),
                    joinRequest.getPassword(),
                    joinRequest.getName(),
                    joinRequest.getEmail()
            );

            authService.sendVerificationEmail(user);

            return new ResponseEntity("Sending Verification Email Success", HttpStatus.OK);

        } catch (RuntimeException e) { // 요청 시 잘못된 인자값 예외 or 중복 사용자 or 메일 인증 전 join 조차 안된 사용자
            return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            return new ResponseEntity("Failed sending Verification email.", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody AuthenticationRequest request, HttpServletResponse response) {

        try {
            User user = authService.login(request.getEmail(), request.getPassword());

            UserDto userDto = UserDto.builder()
                    .email(user.getEmail())
                    .nickname(user.getNickname())
                    .name(user.getName())
                    .role(user.getRole())
                    .build();

            // Access Token 과 Refresh Token 발행
            String accessToken = jwtTokenProvider.createAccessToken(user);
            String refreshToken = jwtTokenProvider.createRefreshToken(user);

            // Redis 에 Refresh Token 저장
            redisUtil.setDataExpire(user.getEmail(), refreshToken, redisUtil.REFRESH_TOKEN_REDIS_DURATION);

            // 헤더에 토큰 넣어주기
            response.setHeader(JwtTokenProvider.ACCESS_TOKEN_NAME, accessToken);
            response.setHeader(JwtTokenProvider.REFRESH_TOKEN_NAME, refreshToken);

            return new ResponseEntity(userDto, HttpStatus.OK);

        } catch (RuntimeException e) { // 가입되지 않은 사용자 or 비밀번호 틀림 or 소셜 로그인 가입자 예외 or 요청 시 잘못된 인자 값
            return new ResponseEntity(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity logout(@RequestBody Map<String, String> request) {

        String email = request.get("email");

        // Refresh Token 삭제
        redisUtil.deleteData(email);

        return new ResponseEntity(email, HttpStatus.OK);
    }

    @GetMapping("/verify/{key}")
    public ResponseEntity getVerify(@PathVariable String key) {

        try {
            authService.verifyEmail(key);
            return new ResponseEntity("Verification Success", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity(HttpStatus.UNAUTHORIZED);
        }
    }
}
