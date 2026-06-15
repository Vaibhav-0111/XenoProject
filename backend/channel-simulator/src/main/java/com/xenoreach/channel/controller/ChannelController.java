package com.xenoreach.channel.controller;

import com.xenoreach.channel.dto.SendRequest;
import com.xenoreach.channel.dto.SendResponse;
import com.xenoreach.channel.service.ChannelSimulationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Channel", description = "Stubbed channel delivery simulation")
@RestController
@RequestMapping("/api/channel")
@RequiredArgsConstructor
public class ChannelController {

    private final ChannelSimulationService simulationService;

    @Operation(summary = "Accept a communication for simulated delivery. " +
            "Asynchronously calls back into the CRM's /api/events/callback with the outcome.")
    @PostMapping("/send")
    public ResponseEntity<SendResponse> send(@Valid @RequestBody SendRequest request) {
        return ResponseEntity.accepted().body(simulationService.send(request));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Channel Simulator is running");
    }
}
