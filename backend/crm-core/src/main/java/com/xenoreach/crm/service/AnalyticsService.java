package com.xenoreach.crm.service;

import com.xenoreach.crm.dto.response.CampaignAnalyticsResponse;
import com.xenoreach.crm.dto.response.DashboardAnalyticsResponse;

public interface AnalyticsService {
    DashboardAnalyticsResponse getDashboard();
    CampaignAnalyticsResponse getCampaignAnalytics(Long campaignId);
}
