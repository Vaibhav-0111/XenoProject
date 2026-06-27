package com.xenoreach.crm.mapper;

import com.xenoreach.crm.dto.response.CampaignResponse;
import com.xenoreach.crm.entity.Campaign;
import org.springframework.stereotype.Component;

@Component
public class CampaignMapper {

    public CampaignResponse toResponse(Campaign campaign) {
        return CampaignResponse.builder()
                .id(campaign.getId())
                .name(campaign.getName())
                .segmentId(campaign.getSegment().getId())
                .segmentName(campaign.getSegment().getName())
                .channel(campaign.getChannel())
                .subject(campaign.getSubject())
                .message(campaign.getMessage())
                .cta(campaign.getCta())
                .abTestingEnabled(campaign.isAbTestingEnabled())
                .variantBSubject(campaign.getVariantBSubject())
                .variantBMessage(campaign.getVariantBMessage())
                .variantBCta(campaign.getVariantBCta())
                .status(campaign.getStatus().name())
                .audienceSize(campaign.getSegment().getAudienceSize())
                .scheduledFor(campaign.getScheduledFor())
                .launchedAt(campaign.getLaunchedAt())
                .createdAt(campaign.getCreatedAt())
                .build();
    }
}
