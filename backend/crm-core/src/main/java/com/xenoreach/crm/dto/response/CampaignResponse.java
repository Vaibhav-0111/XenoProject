package com.xenoreach.crm.dto.response;

import com.xenoreach.crm.entity.Channel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class CampaignResponse {
    private Long id;
    private String name;
    private Long segmentId;
    private String segmentName;
    private Channel channel;
    private String subject;
    private String message;
    private String cta;
    private boolean abTestingEnabled;
    private String variantBSubject;
    private String variantBMessage;
    private String variantBCta;
    private String status;
    private Integer audienceSize;
    private LocalDateTime scheduledFor;
    private LocalDateTime launchedAt;
    private LocalDateTime createdAt;
}
