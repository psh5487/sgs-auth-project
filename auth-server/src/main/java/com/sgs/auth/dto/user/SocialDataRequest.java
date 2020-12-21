package com.sgs.auth.dto.user;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SocialDataRequest {

    private String id;

    private String name;

    private String email;

    private String type;
}
