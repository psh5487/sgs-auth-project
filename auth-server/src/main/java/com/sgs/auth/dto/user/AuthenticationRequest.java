package com.sgs.auth.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class AuthenticationRequest {

    private String email;

    private String password;
}
