package com.xenoreach.crm.service;

import com.xenoreach.crm.dto.request.AiCampaignRequest;
import com.xenoreach.crm.dto.request.AiCommandRequest;
import com.xenoreach.crm.dto.request.AiSegmentRequest;
import com.xenoreach.crm.dto.response.AiCampaignResponse;
import com.xenoreach.crm.dto.response.AiCommandResponse;
import com.xenoreach.crm.dto.response.AiSegmentResponse;

public interface AiService {
    AiSegmentResponse generateSegment(AiSegmentRequest request);
    AiCampaignResponse generateCampaign(AiCampaignRequest request);
    AiCommandResponse executeCommand(AiCommandRequest request);
}
