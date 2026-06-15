package com.xenoreach.crm.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AiCampaignRequest {

    @NotBlank
    private String goal;

    /**
     * Optional: target a specific existing segment for context (audience size, etc.)
     */
    private Long segmentId;
}
