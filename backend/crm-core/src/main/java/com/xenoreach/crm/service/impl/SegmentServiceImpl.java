package com.xenoreach.crm.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xenoreach.crm.dto.request.SegmentRequest;
import com.xenoreach.crm.dto.response.PagedResponse;
import com.xenoreach.crm.dto.response.SegmentPreviewResponse;
import com.xenoreach.crm.dto.response.SegmentResponse;
import com.xenoreach.crm.entity.Segment;
import com.xenoreach.crm.exception.BadRequestException;
import com.xenoreach.crm.exception.ResourceNotFoundException;
import com.xenoreach.crm.mapper.SegmentMapper;
import com.xenoreach.crm.repository.CustomerRepository;
import com.xenoreach.crm.repository.SegmentRepository;
import com.xenoreach.crm.service.SegmentRuleEngine;
import com.xenoreach.crm.service.SegmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SegmentServiceImpl implements SegmentService {

    private final SegmentRepository segmentRepository;
    private final CustomerRepository customerRepository;
    private final SegmentMapper segmentMapper;
    private final SegmentRuleEngine ruleEngine;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public SegmentResponse create(SegmentRequest request, Long userId) {
        JsonNode rulesNode = toJsonNode(request.getRules());
        int audienceSize = computeAudienceSize(rulesNode);

        Segment segment = Segment.builder()
                .name(request.getName())
                .description(request.getDescription())
                .rulesJson(rulesNode.toString())
                .audienceSize(audienceSize)
                .createdBy(userId)
                .build();

        segment = segmentRepository.save(segment);
        return segmentMapper.toResponse(segment);
    }

    @Override
    public SegmentResponse getById(Long id) {
        return segmentMapper.toResponse(getEntityById(id));
    }

    @Override
    public Segment getEntityById(Long id) {
        return segmentRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Segment", id));
    }

    @Override
    public PagedResponse<SegmentResponse> list(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Segment> result = segmentRepository.findAll(pageable);

        return PagedResponse.<SegmentResponse>builder()
                .content(result.getContent().stream().map(segmentMapper::toResponse).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .last(result.isLast())
                .build();
    }

    @Override
    public SegmentPreviewResponse preview(Object rules) {
        JsonNode rulesNode = toJsonNode(rules);
        int size = computeAudienceSize(rulesNode);
        return SegmentPreviewResponse.builder().audienceSize(size).build();
    }

    @Override
    public int computeAudienceSize(Object rules) {
        JsonNode rulesNode = toJsonNode(rules);
        var spec = ruleEngine.toSpecification(rulesNode);
        return (int) customerRepository.count(spec);
    }

    private JsonNode toJsonNode(Object rules) {
        if (rules == null) {
            throw new BadRequestException("Segment rules are required");
        }
        if (rules instanceof JsonNode node) {
            return node;
        }
        return objectMapper.valueToTree(rules);
    }
}
