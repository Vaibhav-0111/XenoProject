package com.xenoreach.crm.dto.response;

import com.xenoreach.crm.entity.Channel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AiCampaignResponse {
    private String campaignName;
    private String subject;
    private String message;
    private String cta;
    private Channel recommendedChannel;
    private String channelReasoning;
}
