package com.xenoreach.crm.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AiSegmentRequest {

    @NotBlank
    private String prompt;
}
