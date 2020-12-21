package com.sgs.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ApiResult {

    private String result;

    private String message;

    private Object data;
}
