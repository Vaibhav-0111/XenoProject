package com.xenoreach.crm.service;

import com.xenoreach.crm.dto.request.CampaignRequest;
import com.xenoreach.crm.dto.response.CampaignResponse;
import com.xenoreach.crm.dto.response.PagedResponse;

public interface CampaignService {
    CampaignResponse create(CampaignRequest request, Long userId);
    CampaignResponse getById(Long id);
    PagedResponse<CampaignResponse> list(int page, int size);
    PagedResponse<CampaignResponse> search(String query, int page, int size);
    CampaignResponse launch(Long id);
}
