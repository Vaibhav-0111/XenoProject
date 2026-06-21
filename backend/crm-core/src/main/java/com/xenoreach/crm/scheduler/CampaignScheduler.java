package com.xenoreach.crm.scheduler;

import com.xenoreach.crm.entity.Campaign;
import com.xenoreach.crm.entity.CampaignStatus;
import com.xenoreach.crm.repository.CampaignRepository;
import com.xenoreach.crm.service.CampaignService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Polls for SCHEDULED campaigns whose scheduledFor time has passed
 * and automatically launches them.
 * Runs every 30 seconds.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CampaignScheduler {

    private final CampaignRepository campaignRepository;
    private final CampaignService campaignService;

    @Scheduled(fixedRate = 30_000)
    public void launchScheduledCampaigns() {
        List<Campaign> ready = campaignRepository.findByStatusAndScheduledForBefore(
                CampaignStatus.SCHEDULED, LocalDateTime.now()
        );

        for (Campaign campaign : ready) {
            try {
                log.info("Auto-launching scheduled campaign {} ('{}')", campaign.getId(), campaign.getName());
                campaignService.launch(campaign.getId());
            } catch (Exception e) {
                log.error("Failed to auto-launch scheduled campaign {}: {}", campaign.getId(), e.getMessage(), e);
            }
        }
    }
}
