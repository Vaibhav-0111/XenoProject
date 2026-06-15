package com.xenoreach.crm.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CampaignSummary {
    private Long id;
    private String name;
    private String channel;
    private String status;
    private long audienceSize;
    private double openRate;
}
