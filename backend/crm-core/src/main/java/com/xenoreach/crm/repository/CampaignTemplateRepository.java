package com.xenoreach.crm.repository;

import com.xenoreach.crm.entity.CampaignTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampaignTemplateRepository extends JpaRepository<CampaignTemplate, Long> {
    List<CampaignTemplate> findAllByOrderByCreatedAtDesc();
}
