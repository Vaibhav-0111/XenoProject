package com.xenoreach.crm.controller;

import com.xenoreach.crm.dto.request.EventCallbackRequest;
import com.xenoreach.crm.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Events", description = "Inbound callback API used by the Channel Simulator service")
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @Operation(summary = "Receive a delivery/engagement callback from the Channel Simulator")
    @PostMapping("/callback")
    public ResponseEntity<Void> callback(@Valid @RequestBody EventCallbackRequest request) {
        eventService.processCallback(request);
        return ResponseEntity.ok().build();
    }
}
