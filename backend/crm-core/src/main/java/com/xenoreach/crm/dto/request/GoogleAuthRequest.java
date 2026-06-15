package com.xenoreach.crm.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class GoogleAuthRequest {

    @NotBlank(message = "Firebase ID token is required")
    private String idToken;
}
