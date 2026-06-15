package com.xenoreach.crm.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class DashboardAnalyticsResponse {
    private long totalCustomers;
    private long totalCampaigns;
    private long runningCampaigns;
    private BigDecimal totalRevenue;

    private long totalSent;
    private long totalDelivered;
    private long totalOpened;
    private long totalClicked;
    private long totalFailed;
    private long totalConverted;

    private double deliveryRate;
    private double openRate;
    private double clickRate;
    private double conversionRate;

    private List<ChannelPerformance> channelPerformance;
    private List<CampaignSummary> recentCampaigns;
}
