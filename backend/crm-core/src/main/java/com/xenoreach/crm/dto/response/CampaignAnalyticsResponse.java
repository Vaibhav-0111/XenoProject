package com.xenoreach.crm.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CampaignAnalyticsResponse {
    private Long campaignId;
    private String campaignName;
    private String channel;
    private String status;

    private long audienceSize;
    private long sent;
    private long delivered;
    private long opened;
    private long read;
    private long clicked;
    private long failed;
    private long converted;

    private double deliveryRate;
    private double openRate;
    private double clickRate;
    private double conversionRate;
}
