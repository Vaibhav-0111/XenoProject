package com.xenoreach.crm.dto.request;

import com.xenoreach.crm.entity.Channel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CampaignRequest {

    @NotBlank
    private String name;

    @NotNull
    private Long segmentId;

    @NotNull
    private Channel channel;

    private String subject;

    @NotBlank
    private String message;

    private String cta;

    private boolean abTestingEnabled;

    private String variantBSubject;

    private String variantBMessage;

    private String variantBCta;

    private String scheduledFor;  // ISO-8601 datetime string, e.g. "2026-07-01T10:00:00"
}
