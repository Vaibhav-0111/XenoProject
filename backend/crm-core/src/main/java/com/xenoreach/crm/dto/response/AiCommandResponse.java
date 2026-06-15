package com.xenoreach.crm.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AiCommandResponse {
    private AiSegmentResponse segment;
    private Integer audienceSize;
    private AiCampaignResponse campaign;
    private String recommendedChannel;
    private String summary;
}
