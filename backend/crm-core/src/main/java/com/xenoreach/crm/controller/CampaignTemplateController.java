package com.xenoreach.crm.controller;

import com.xenoreach.crm.dto.request.CampaignTemplateRequest;
import com.xenoreach.crm.dto.response.CampaignTemplateResponse;
import com.xenoreach.crm.entity.CampaignTemplate;
import com.xenoreach.crm.repository.CampaignTemplateRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Campaign Templates", description = "Save and reuse message templates")
@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class CampaignTemplateController {

    private final CampaignTemplateRepository templateRepository;

    @PostMapping
    public ResponseEntity<CampaignTemplateResponse> create(@Valid @RequestBody CampaignTemplateRequest request) {
        CampaignTemplate template = CampaignTemplate.builder()
                .name(request.getName())
                .channel(request.getChannel())
                .subject(request.getSubject())
                .message(request.getMessage())
                .cta(request.getCta())
                .build();

        template = templateRepository.save(template);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(template));
    }

    @GetMapping
    public ResponseEntity<List<CampaignTemplateResponse>> list() {
        List<CampaignTemplateResponse> templates = templateRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
        return ResponseEntity.ok(templates);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        templateRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private CampaignTemplateResponse toResponse(CampaignTemplate t) {
        return CampaignTemplateResponse.builder()
                .id(t.getId())
                .name(t.getName())
                .channel(t.getChannel())
                .subject(t.getSubject())
                .message(t.getMessage())
                .cta(t.getCta())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
