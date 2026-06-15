package com.xenoreach.crm.dto.response;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AiSegmentResponse {
    private String segmentName;
    private String description;
    private JsonNode rules;
    private Integer estimatedAudienceSize;
}
