package com.xenoreach.crm.dto.response;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class SegmentResponse {
    private Long id;
    private String name;
    private String description;
    private JsonNode rules;
    private Integer audienceSize;
    private LocalDateTime createdAt;
}
