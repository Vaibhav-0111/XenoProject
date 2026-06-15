package com.xenoreach.crm.service;

import com.xenoreach.crm.dto.request.SegmentRequest;
import com.xenoreach.crm.dto.response.PagedResponse;
import com.xenoreach.crm.dto.response.SegmentPreviewResponse;
import com.xenoreach.crm.dto.response.SegmentResponse;
import com.xenoreach.crm.entity.Segment;

public interface SegmentService {
    SegmentResponse create(SegmentRequest request, Long userId);
    SegmentResponse getById(Long id);
    Segment getEntityById(Long id);
    PagedResponse<SegmentResponse> list(int page, int size);
    SegmentPreviewResponse preview(Object rules);
    int computeAudienceSize(Object rules);
}
