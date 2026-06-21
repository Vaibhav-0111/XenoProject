package com.xenoreach.crm.dto.request;

import com.xenoreach.crm.entity.Channel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CampaignTemplateRequest {

    @NotBlank
    private String name;

    @NotNull
    private Channel channel;

    private String subject;

    @NotBlank
    private String message;

    private String cta;
}
