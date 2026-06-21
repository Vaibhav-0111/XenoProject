package com.xenoreach.crm.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xenoreach.crm.dto.request.CampaignRequest;
import com.xenoreach.crm.dto.response.CampaignDeliveryStats;
import com.xenoreach.crm.dto.response.CampaignResponse;
import com.xenoreach.crm.dto.response.PagedResponse;
import com.xenoreach.crm.entity.*;
import com.xenoreach.crm.exception.BadRequestException;
import com.xenoreach.crm.exception.ResourceNotFoundException;
import com.xenoreach.crm.mapper.CampaignMapper;
import com.xenoreach.crm.repository.CampaignRepository;
import com.xenoreach.crm.repository.CommunicationRepository;
import com.xenoreach.crm.repository.CustomerRepository;
import com.xenoreach.crm.service.CampaignService;
import com.xenoreach.crm.service.ChannelSimulatorClient;
import com.xenoreach.crm.service.SegmentRuleEngine;
import com.xenoreach.crm.service.SegmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CampaignServiceImpl implements CampaignService {

    private final CampaignRepository campaignRepository;
    private final CommunicationRepository communicationRepository;
    private final CustomerRepository customerRepository;
    private final SegmentService segmentService;
    private final SegmentRuleEngine ruleEngine;
    private final CampaignMapper campaignMapper;
    private final ChannelSimulatorClient channelSimulatorClient;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public CampaignResponse create(CampaignRequest request, Long userId) {
        Segment segment = segmentService.getEntityById(request.getSegmentId());

        LocalDateTime scheduledFor = null;
        CampaignStatus initialStatus = CampaignStatus.DRAFT;
        if (request.getScheduledFor() != null && !request.getScheduledFor().isBlank()) {
            scheduledFor = LocalDateTime.parse(request.getScheduledFor());
            initialStatus = CampaignStatus.SCHEDULED;
        }

        Campaign campaign = Campaign.builder()
                .name(request.getName())
                .segment(segment)
                .channel(request.getChannel())
                .subject(request.getSubject())
                .message(request.getMessage())
                .cta(request.getCta())
                .status(initialStatus)
                .scheduledFor(scheduledFor)
                .createdBy(userId)
                .build();

        campaign = campaignRepository.save(campaign);
        return campaignMapper.toResponse(campaign);
    }

    @Override
    public CampaignResponse getById(Long id) {
        return campaignMapper.toResponse(findEntity(id));
    }

    @Override
    public PagedResponse<CampaignResponse> list(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Campaign> result = campaignRepository.findAll(pageable);

        return toPagedResponse(result);
    }

    @Override
    public PagedResponse<CampaignResponse> search(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Campaign> result = campaignRepository.findByNameContainingIgnoreCase(query, pageable);
        return toPagedResponse(result);
    }

    private PagedResponse<CampaignResponse> toPagedResponse(Page<Campaign> result) {
        return PagedResponse.<CampaignResponse>builder()
                .content(result.getContent().stream().map(campaignMapper::toResponse).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .last(result.isLast())
                .build();
    }

    /**
     * Launching a campaign:
     *  1. Resolves the segment's audience (live re-evaluation of rules).
     *  2. Creates a PENDING Communication row per matching customer.
     *  3. Asynchronously dispatches each communication to the Channel
     *     Simulator service, which will call back into /api/events/callback
     *     with delivery / engagement outcomes.
     */
    @Override
    @Transactional
    public CampaignResponse launch(Long id) {
        Campaign campaign = findEntity(id);

        if (campaign.getStatus() == CampaignStatus.RUNNING || campaign.getStatus() == CampaignStatus.COMPLETED) {
            throw new BadRequestException("Campaign has already been launched");
        }

        Segment segment = campaign.getSegment();
        JsonNode rulesNode;
        try {
            rulesNode = objectMapper.readTree(segment.getRulesJson());
        } catch (Exception e) {
            throw new BadRequestException("Segment rules are invalid: " + e.getMessage());
        }

        var spec = ruleEngine.toSpecification(rulesNode);
        List<Customer> audience = customerRepository.findAll(spec);

        if (audience.isEmpty()) {
            throw new BadRequestException("Cannot launch campaign: target segment has no matching customers");
        }

        for (Customer customer : audience) {
            Communication communication = Communication.builder()
                    .campaign(campaign)
                    .customer(customer)
                    .channel(campaign.getChannel())
                    .message(personalize(campaign.getMessage(), customer))
                    .status(CommunicationStatus.PENDING)
                    .build();

            communication = communicationRepository.save(communication);

            String recipient = resolveRecipient(campaign.getChannel(), customer);
            channelSimulatorClient.sendAsync(
                    communication.getId(),
                    campaign.getId(),
                    customer.getId(),
                    campaign.getChannel(),
                    communication.getMessage(),
                    recipient
            );

            communication.setStatus(CommunicationStatus.SENT);
            communication.setSentAt(LocalDateTime.now());
            communicationRepository.save(communication);
        }

        // Refresh audience size snapshot on the segment
        segment.setAudienceSize(audience.size());

        campaign.setStatus(CampaignStatus.RUNNING);
        campaign.setLaunchedAt(LocalDateTime.now());
        campaign = campaignRepository.save(campaign);

        log.info("Launched campaign {} ('{}') to {} customers via {}", campaign.getId(), campaign.getName(), audience.size(), campaign.getChannel());

        return campaignMapper.toResponse(campaign);
    }

    private String personalize(String template, Customer customer) {
        if (template == null) return "";
        return template
                .replace("{{name}}", customer.getName())
                .replace("{{first_name}}", customer.getName().split(" ")[0]);
    }

    private String resolveRecipient(Channel channel, Customer customer) {
        return switch (channel) {
            case EMAIL -> customer.getEmail();
            case WHATSAPP, SMS, RCS -> customer.getPhone();
        };
    }

    private Campaign findEntity(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Campaign", id));
    }

    @Override
    public CampaignDeliveryStats getDeliveryStats(Long id) {
        Campaign campaign = findEntity(id);

        long total = communicationRepository.countByCampaignId(id);
        long sent = communicationRepository.countByCampaignIdAndStatus(id, CommunicationStatus.SENT);
        long delivered = communicationRepository.countByCampaignIdAndStatus(id, CommunicationStatus.DELIVERED);
        long opened = communicationRepository.countByCampaignIdAndStatus(id, CommunicationStatus.OPENED)
                + communicationRepository.countByCampaignIdAndStatus(id, CommunicationStatus.READ);
        long clicked = communicationRepository.countByCampaignIdAndStatus(id, CommunicationStatus.CLICKED);
        long failed = communicationRepository.countByCampaignIdAndStatus(id, CommunicationStatus.FAILED);

        double deliveryRate = total > 0 ? (double) (delivered + opened + clicked) / total * 100 : 0;
        double openRate = total > 0 ? (double) (opened + clicked) / total * 100 : 0;

        return CampaignDeliveryStats.builder()
                .campaignId(id)
                .campaignName(campaign.getName())
                .status(campaign.getStatus().name())
                .total(total)
                .sent(sent)
                .delivered(delivered)
                .opened(opened)
                .clicked(clicked)
                .failed(failed)
                .deliveryRate(Math.round(deliveryRate * 100.0) / 100.0)
                .openRate(Math.round(openRate * 100.0) / 100.0)
                .build();
    }
}
