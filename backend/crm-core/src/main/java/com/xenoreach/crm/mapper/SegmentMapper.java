package com.xenoreach.crm.mapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xenoreach.crm.dto.response.SegmentResponse;
import com.xenoreach.crm.entity.Segment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SegmentMapper {

    private final ObjectMapper objectMapper;

    public SegmentResponse toResponse(Segment segment) {
        JsonNode rules = null;
        try {
            rules = objectMapper.readTree(segment.getRulesJson());
        } catch (Exception e) {
            log.warn("Failed to parse rulesJson for segment {}", segment.getId(), e);
        }

        return SegmentResponse.builder()
                .id(segment.getId())
                .name(segment.getName())
                .description(segment.getDescription())
                .rules(rules)
                .audienceSize(segment.getAudienceSize())
                .createdAt(segment.getCreatedAt())
                .build();
    }
}
