package com.xenoreach.crm.service;

import com.xenoreach.crm.entity.Channel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

/**
 * Talks to the standalone Channel Simulator service. Sends are fired
 * asynchronously (non-blocking) -- the CRM does not wait for delivery
 * outcomes, those arrive later via the /api/events/callback endpoint.
 */
@Slf4j
@Component
public class ChannelSimulatorClient {

    private final WebClient webClient;

    public ChannelSimulatorClient(WebClient.Builder builder,
                                   @Value("${app.channel-simulator.base-url}") String baseUrl) {
        this.webClient = builder.baseUrl(baseUrl).build();
    }

    public void sendAsync(Long communicationId, Long campaignId, Long customerId, Channel channel, String message, String recipient) {
        Map<String, Object> payload = Map.of(
                "communicationId", communicationId,
                "campaignId", campaignId,
                "customerId", customerId,
                "channel", channel.name(),
                "message", message,
                "recipient", recipient == null ? "" : recipient
        );

        webClient.post()
                .uri("/api/channel/send")
                .bodyValue(payload)
                .retrieve()
                .toBodilessEntity()
                .doOnError(err -> log.warn("Channel simulator dispatch failed for communication {}: {}", communicationId, err.getMessage()))
                .subscribe(
                        success -> log.debug("Dispatched communication {} to channel simulator", communicationId),
                        error -> log.warn("Error dispatching communication {}", communicationId, error)
                );
    }
}
