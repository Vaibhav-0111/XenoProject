package com.xenoreach.crm.controller;

import com.xenoreach.crm.dto.request.SegmentPreviewRequest;
import com.xenoreach.crm.dto.request.SegmentRequest;
import com.xenoreach.crm.dto.response.PagedResponse;
import com.xenoreach.crm.dto.response.SegmentPreviewResponse;
import com.xenoreach.crm.dto.response.SegmentResponse;
import com.xenoreach.crm.security.UserPrincipal;
import com.xenoreach.crm.service.SegmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Segments", description = "Audience segmentation -- create, list and preview rule-based audiences")
@RestController
@RequestMapping("/api/segments")
@RequiredArgsConstructor
public class SegmentController {

    private final SegmentService segmentService;

    @PostMapping
    public ResponseEntity<SegmentResponse> create(@Valid @RequestBody SegmentRequest request,
                                                   @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal != null ? principal.getId() : null;
        return ResponseEntity.status(HttpStatus.CREATED).body(segmentService.create(request, userId));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<SegmentResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(segmentService.list(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SegmentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(segmentService.getById(id));
    }

    @Operation(summary = "Preview the live audience size for a given rule tree (without saving)")
    @PostMapping("/preview")
    public ResponseEntity<SegmentPreviewResponse> preview(@Valid @RequestBody SegmentPreviewRequest request) {
        return ResponseEntity.ok(segmentService.preview(request.getRules()));
    }
}
