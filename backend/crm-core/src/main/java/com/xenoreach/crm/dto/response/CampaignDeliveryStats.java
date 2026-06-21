package com.xenoreach.crm.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CampaignDeliveryStats {
    private Long campaignId;
    private String campaignName;
    private String status;
    private long total;
    private long sent;
    private long delivered;
    private long opened;
    private long clicked;
    private long failed;
    private double deliveryRate;
    private double openRate;
}
