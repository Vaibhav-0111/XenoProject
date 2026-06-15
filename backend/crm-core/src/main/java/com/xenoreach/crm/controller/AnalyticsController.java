package com.xenoreach.crm.controller;

import com.xenoreach.crm.dto.response.CampaignAnalyticsResponse;
import com.xenoreach.crm.dto.response.DashboardAnalyticsResponse;
import com.xenoreach.crm.service.AnalyticsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Analytics", description = "Executive dashboard and per-campaign analytics")
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardAnalyticsResponse> dashboard() {
        return ResponseEntity.ok(analyticsService.getDashboard());
    }

    @GetMapping("/campaign/{id}")
    public ResponseEntity<CampaignAnalyticsResponse> campaign(@PathVariable Long id) {
        return ResponseEntity.ok(analyticsService.getCampaignAnalytics(id));
    }
}
