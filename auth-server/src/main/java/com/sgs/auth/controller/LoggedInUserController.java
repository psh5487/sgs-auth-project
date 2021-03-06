package com.sgs.auth.controller;

import com.sgs.auth.dto.user.UserDto;

import com.sgs.auth.model.User;
import com.sgs.auth.service.AuthService;
import com.sgs.auth.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/loggedInUser")
@RequiredArgsConstructor
@Slf4j
public class LoggedInUserController {

    private final AuthService authService;

    private final UserServiceImpl userService;

    @GetMapping("/myInfo")
    public ResponseEntity myInfo(@AuthenticationPrincipal org.springframework.security.core.userdetails.User loggedInUser) {
        if(loggedInUser == null) {
            return new ResponseEntity("Login needed", HttpStatus.UNAUTHORIZED);
        }

        User user = authService.findMemberByEmail(loggedInUser.getUsername()).get();

        UserDto userDto = UserDto.builder()
                .email(user.getEmail())
                .nickname(user.getNickname())
                .name(user.getName())
                .role(user.getRole())
                .build();

        return new ResponseEntity(userDto, HttpStatus.OK);
    }

    @GetMapping("/allUserInfo")
    public ResponseEntity allUser(@AuthenticationPrincipal org.springframework.security.core.userdetails.User loggedInUser) {
        if(loggedInUser == null) {
            return new ResponseEntity("Login needed", HttpStatus.UNAUTHORIZED);
        }

        List<User> userList = userService.allUserInfo();
        List<UserDto> userDtoList = userList.stream()
                .map(user -> {
                    UserDto userDto = UserDto.builder()
                            .email(user.getEmail())
                            .nickname(user.getNickname())
                            .name(user.getName())
                            .role(user.getRole())
                            .build();
                    return userDto;
                })
                .collect(Collectors.toList());

        return new ResponseEntity(userDtoList, HttpStatus.OK);
    }
}
