package com.xenoreach.channel.service;

import com.xenoreach.channel.config.SimulationProperties;
import com.xenoreach.channel.dto.EventCallbackPayload;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.util.retry.Retry;

import java.time.Duration;

/**
 * Posts lifecycle event callbacks back to the CRM Core service's
 * /api/events/callback endpoint, with retries to model real-world
 * network unreliability between the two services.
 */
@Slf4j
@Component
public class CallbackClient {

    private final WebClient webClient;
    private final SimulationProperties properties;

    public CallbackClient(WebClient.Builder builder,
                           @Value("${app.crm.base-url}") String crmBaseUrl,
                           SimulationProperties properties) {
        this.webClient = builder.baseUrl(crmBaseUrl).build();
        this.properties = properties;
    }

    public void sendCallback(EventCallbackPayload payload) {
        webClient.post()
                .uri("/api/events/callback")
                .bodyValue(payload)
                .retrieve()
                .toBodilessEntity()
                .retryWhen(Retry.backoff(properties.getMaxRetries(), Duration.ofMillis(500))
                        .maxBackoff(Duration.ofSeconds(5)))
                .doOnError(err -> log.error("Callback failed permanently for communication {} event {}: {}",
                        payload.getCommunicationId(), payload.getEventType(), err.getMessage()))
                .subscribe(
                        ok -> log.info("Callback sent: communication={} event={}", payload.getCommunicationId(), payload.getEventType()),
                        err -> { /* already logged above */ }
                );
    }
}
