package com.xenoreach.crm.service.impl;

import com.xenoreach.crm.dto.response.*;
import com.xenoreach.crm.entity.Campaign;
import com.xenoreach.crm.entity.CampaignStatus;
import com.xenoreach.crm.entity.Channel;
import com.xenoreach.crm.entity.CommunicationStatus;
import com.xenoreach.crm.exception.ResourceNotFoundException;
import com.xenoreach.crm.repository.CampaignRepository;
import com.xenoreach.crm.repository.CommunicationRepository;
import com.xenoreach.crm.repository.CustomerRepository;
import com.xenoreach.crm.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final CustomerRepository customerRepository;
    private final CampaignRepository campaignRepository;
    private final CommunicationRepository communicationRepository;

    @Override
    public DashboardAnalyticsResponse getDashboard() {
        long totalCustomers = customerRepository.count();
        long totalCampaigns = campaignRepository.count();
        long runningCampaigns = campaignRepository.countByStatus(CampaignStatus.RUNNING);
        BigDecimal totalRevenue = customerRepository.sumTotalSpend();

        var aggregates = communicationRepository.aggregateByChannelAndStatus();

        long sent = sumStatuses(aggregates, EnumSet.of(
                CommunicationStatus.SENT, CommunicationStatus.DELIVERED, CommunicationStatus.OPENED,
                CommunicationStatus.READ, CommunicationStatus.CLICKED));
        long delivered = sumStatuses(aggregates, EnumSet.of(
                CommunicationStatus.DELIVERED, CommunicationStatus.OPENED, CommunicationStatus.READ, CommunicationStatus.CLICKED));
        long opened = sumStatuses(aggregates, EnumSet.of(
                CommunicationStatus.OPENED, CommunicationStatus.READ, CommunicationStatus.CLICKED));
        long clicked = sumStatuses(aggregates, EnumSet.of(CommunicationStatus.CLICKED));
        long failed = sumStatuses(aggregates, EnumSet.of(CommunicationStatus.FAILED));
        long converted = communicationRepository.countByConvertedTrue();

        List<ChannelPerformance> channelPerformance = buildChannelPerformance(aggregates);

        List<CampaignSummary> recentCampaigns = campaignRepository
                .findAll(PageRequest.of(0, 5, Sort.by("createdAt").descending()))
                .getContent()
                .stream()
                .map(this::toSummary)
                .toList();

        return DashboardAnalyticsResponse.builder()
                .totalCustomers(totalCustomers)
                .totalCampaigns(totalCampaigns)
                .runningCampaigns(runningCampaigns)
                .totalRevenue(totalRevenue)
                .totalSent(sent)
                .totalDelivered(delivered)
                .totalOpened(opened)
                .totalClicked(clicked)
                .totalFailed(failed)
                .totalConverted(converted)
                .deliveryRate(rate(delivered, sent))
                .openRate(rate(opened, delivered))
                .clickRate(rate(clicked, opened))
                .conversionRate(rate(converted, sent))
                .channelPerformance(channelPerformance)
                .recentCampaigns(recentCampaigns)
                .build();
    }

    @Override
    public CampaignAnalyticsResponse getCampaignAnalytics(Long campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> ResourceNotFoundException.of("Campaign", campaignId));

        long audienceSize = communicationRepository.countByCampaignId(campaignId);

        long delivered = countCampaignByStatuses(campaignId, EnumSet.of(
                CommunicationStatus.DELIVERED, CommunicationStatus.OPENED, CommunicationStatus.READ, CommunicationStatus.CLICKED));
        long opened = countCampaignByStatuses(campaignId, EnumSet.of(
                CommunicationStatus.OPENED, CommunicationStatus.READ, CommunicationStatus.CLICKED));
        long read = countCampaignByStatuses(campaignId, EnumSet.of(CommunicationStatus.READ, CommunicationStatus.CLICKED));
        long clicked = countCampaignByStatuses(campaignId, EnumSet.of(CommunicationStatus.CLICKED));
        long failed = countCampaignByStatuses(campaignId, EnumSet.of(CommunicationStatus.FAILED));
        long sent = audienceSize - countCampaignByStatuses(campaignId, EnumSet.of(CommunicationStatus.PENDING));
        long converted = countCampaignConverted(campaignId);

        return CampaignAnalyticsResponse.builder()
                .campaignId(campaign.getId())
                .campaignName(campaign.getName())
                .channel(campaign.getChannel().name())
                .status(campaign.getStatus().name())
                .audienceSize(audienceSize)
                .sent(sent)
                .delivered(delivered)
                .opened(opened)
                .read(read)
                .clicked(clicked)
                .failed(failed)
                .converted(converted)
                .deliveryRate(rate(delivered, sent))
                .openRate(rate(opened, delivered))
                .clickRate(rate(clicked, opened))
                .conversionRate(rate(converted, sent))
                .build();
    }

    // ---- helpers ----

    private long sumStatuses(List<CommunicationRepository.ChannelStatusCount> aggregates, Set<CommunicationStatus> statuses) {
        return aggregates.stream()
                .filter(a -> statuses.contains(a.getStatus()))
                .mapToLong(CommunicationRepository.ChannelStatusCount::getCnt)
                .sum();
    }

    private long countCampaignByStatuses(Long campaignId, Set<CommunicationStatus> statuses) {
        // Lightweight per-campaign aggregation re-using the full communications table
        // would normally be a single grouped query; for clarity we loop the enum set.
        return statuses.stream()
                .mapToLong(status -> communicationRepository.countByCampaignIdAndStatus(campaignId, status))
                .sum();
    }

    private long countCampaignConverted(Long campaignId) {
        return communicationRepository.countByCampaignIdAndConvertedTrue(campaignId);
    }

    private List<ChannelPerformance> buildChannelPerformance(List<CommunicationRepository.ChannelStatusCount> aggregates) {
        Map<Channel, Map<CommunicationStatus, Long>> grouped = aggregates.stream()
                .collect(Collectors.groupingBy(
                        CommunicationRepository.ChannelStatusCount::getChannel,
                        Collectors.toMap(CommunicationRepository.ChannelStatusCount::getStatus,
                                CommunicationRepository.ChannelStatusCount::getCnt,
                                Long::sum)));

        List<ChannelPerformance> result = new ArrayList<>();
        for (Channel channel : Channel.values()) {
            Map<CommunicationStatus, Long> counts = grouped.getOrDefault(channel, Map.of());
            long sent = sumOf(counts, CommunicationStatus.SENT, CommunicationStatus.DELIVERED, CommunicationStatus.OPENED,
                    CommunicationStatus.READ, CommunicationStatus.CLICKED);
            long delivered = sumOf(counts, CommunicationStatus.DELIVERED, CommunicationStatus.OPENED,
                    CommunicationStatus.READ, CommunicationStatus.CLICKED);
            long opened = sumOf(counts, CommunicationStatus.OPENED, CommunicationStatus.READ, CommunicationStatus.CLICKED);
            long clicked = sumOf(counts, CommunicationStatus.CLICKED);

            if (sent == 0 && delivered == 0 && opened == 0 && clicked == 0 && counts.isEmpty()) {
                continue;
            }

            result.add(ChannelPerformance.builder()
                    .channel(channel)
                    .sent(sent)
                    .delivered(delivered)
                    .opened(opened)
                    .clicked(clicked)
                    .openRate(rate(opened, delivered))
                    .build());
        }
        return result;
    }

    private long sumOf(Map<CommunicationStatus, Long> counts, CommunicationStatus... statuses) {
        long total = 0;
        for (CommunicationStatus s : statuses) {
            total += counts.getOrDefault(s, 0L);
        }
        return total;
    }

    private CampaignSummary toSummary(Campaign campaign) {
        long audience = communicationRepository.countByCampaignId(campaign.getId());
        long delivered = countCampaignByStatuses(campaign.getId(), EnumSet.of(
                CommunicationStatus.DELIVERED, CommunicationStatus.OPENED, CommunicationStatus.READ, CommunicationStatus.CLICKED));
        long opened = countCampaignByStatuses(campaign.getId(), EnumSet.of(
                CommunicationStatus.OPENED, CommunicationStatus.READ, CommunicationStatus.CLICKED));

        return CampaignSummary.builder()
                .id(campaign.getId())
                .name(campaign.getName())
                .channel(campaign.getChannel().name())
                .status(campaign.getStatus().name())
                .audienceSize(audience)
                .openRate(rate(opened, delivered))
                .build();
    }

    private double rate(long numerator, long denominator) {
        if (denominator <= 0) return 0.0;
        return Math.round((numerator * 10000.0) / denominator) / 100.0; // 2 decimal places
    }
}
