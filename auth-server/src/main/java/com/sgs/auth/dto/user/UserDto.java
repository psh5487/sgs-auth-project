package com.sgs.auth.dto.user;

import com.sgs.auth.model.UserRole;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {

    private String email;

    private String nickname;

    private String name;

    private UserRole role;
}
