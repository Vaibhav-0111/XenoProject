package com.xenoreach.crm.dto.response;

import com.xenoreach.crm.entity.Channel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class CampaignTemplateResponse {
    private Long id;
    private String name;
    private Channel channel;
    private String subject;
    private String message;
    private String cta;
    private LocalDateTime createdAt;
}
