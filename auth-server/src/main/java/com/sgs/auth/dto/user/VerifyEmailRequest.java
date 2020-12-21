package com.sgs.auth.dto.user;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VerifyEmailRequest {
    String email;
}
