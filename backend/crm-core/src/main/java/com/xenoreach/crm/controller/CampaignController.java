package com.xenoreach.crm.controller;

import com.xenoreach.crm.dto.request.CampaignRequest;
import com.xenoreach.crm.dto.response.CampaignResponse;
import com.xenoreach.crm.dto.response.PagedResponse;
import com.xenoreach.crm.security.UserPrincipal;
import com.xenoreach.crm.service.CampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Campaigns", description = "Campaign creation, listing and launching")
@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @PostMapping
    public ResponseEntity<CampaignResponse> create(@Valid @RequestBody CampaignRequest request,
                                                    @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal != null ? principal.getId() : null;
        return ResponseEntity.status(HttpStatus.CREATED).body(campaignService.create(request, userId));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<CampaignResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(campaignService.list(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampaignResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<CampaignResponse>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(campaignService.search(query, page, size));
    }

    @Operation(summary = "Launch a campaign -- resolves the audience and dispatches communications via the Channel Simulator")
    @PostMapping("/{id}/launch")
    public ResponseEntity<CampaignResponse> launch(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.launch(id));
    }
}
