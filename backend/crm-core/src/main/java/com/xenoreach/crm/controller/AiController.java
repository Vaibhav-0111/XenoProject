package com.xenoreach.crm.controller;

import com.xenoreach.crm.dto.request.AiCampaignRequest;
import com.xenoreach.crm.dto.request.AiCommandRequest;
import com.xenoreach.crm.dto.request.AiSegmentRequest;
import com.xenoreach.crm.dto.response.AiCampaignResponse;
import com.xenoreach.crm.dto.response.AiCommandResponse;
import com.xenoreach.crm.dto.response.AiSegmentResponse;
import com.xenoreach.crm.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "AI", description = "AI-native segmentation, campaign generation and the AI command center")
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @Operation(summary = "Convert a natural-language audience description into segment rules")
    @PostMapping("/segment")
    public ResponseEntity<AiSegmentResponse> generateSegment(@Valid @RequestBody AiSegmentRequest request) {
        return ResponseEntity.ok(aiService.generateSegment(request));
    }

    @Operation(summary = "Generate campaign content (subject, message, CTA, channel) from a marketing goal")
    @PostMapping("/campaign")
    public ResponseEntity<AiCampaignResponse> generateCampaign(@Valid @RequestBody AiCampaignRequest request) {
        return ResponseEntity.ok(aiService.generateCampaign(request));
    }

    @Operation(summary = "AI Command Center: turn a goal into a segment + audience size + campaign + channel recommendation")
    @PostMapping("/command")
    public ResponseEntity<AiCommandResponse> command(@Valid @RequestBody AiCommandRequest request) {
        return ResponseEntity.ok(aiService.executeCommand(request));
    }
}
