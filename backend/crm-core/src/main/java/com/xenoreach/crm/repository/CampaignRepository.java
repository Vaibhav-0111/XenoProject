package com.xenoreach.crm.repository;

import com.xenoreach.crm.entity.Campaign;
import com.xenoreach.crm.entity.CampaignStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    Page<Campaign> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Campaign> findByNameContainingIgnoreCase(String name, Pageable pageable);
    long countByStatus(CampaignStatus status);
    List<Campaign> findByStatusAndScheduledForBefore(CampaignStatus status, LocalDateTime time);
}
