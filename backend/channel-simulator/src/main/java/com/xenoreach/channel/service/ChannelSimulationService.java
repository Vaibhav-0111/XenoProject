package com.xenoreach.channel.service;

import com.xenoreach.channel.config.SimulationProperties;
import com.xenoreach.channel.dto.EventCallbackPayload;
import com.xenoreach.channel.dto.SendRequest;
import com.xenoreach.channel.dto.SendResponse;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

/**
 * Simulates the full lifecycle of an outbound communication:
 *
 *   SENT -> (DELIVERED | FAILED)
 *           DELIVERED -> (OPENED?) -> (CLICKED?) -> (CONVERTED?)
 *
 * Each stage is scheduled on a random delay (1-10s by default, configurable)
 * using a {@link ScheduledExecutorService}, mimicking asynchronous,
 * callback-driven delivery from a real messaging provider.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChannelSimulationService {

    private final SimulationProperties properties;
    private final CallbackClient callbackClient;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(4);

    public SendResponse send(SendRequest request) {
        log.info("Received send request: communication={} campaign={} customer={} channel={}",
                request.getCommunicationId(), request.getCampaignId(), request.getCustomerId(), request.getChannel());

        // Stage 0: acknowledge immediately
        scheduleStage(() -> handleSentAck(request), randomDelay());

        return SendResponse.builder()
                .communicationId(request.getCommunicationId())
                .status("QUEUED")
                .message("Communication queued for simulated delivery")
                .build();
    }

    private void handleSentAck(SendRequest request) {
        callback(request, "SENT", null);

        boolean failed = ThreadLocalRandom.current().nextDouble() < properties.getFailureRate();

        if (failed) {
            String[] reasons = {"Invalid recipient", "Network timeout", "Provider rejected message", "Recipient unreachable"};
            String reason = reasons[ThreadLocalRandom.current().nextInt(reasons.length)];
            scheduleStage(() -> callback(request, "FAILED", Map.of("reason", reason)), randomDelay());
            return;
        }

        scheduleStage(() -> handleDelivered(request), randomDelay());
    }

    private void handleDelivered(SendRequest request) {
        callback(request, "DELIVERED", null);

        boolean opened = ThreadLocalRandom.current().nextDouble() < properties.getOpenRate();
        if (opened) {
            scheduleStage(() -> handleOpened(request), randomDelay());
        }
    }

    private void handleOpened(SendRequest request) {
        callback(request, "OPENED", null);

        boolean clicked = ThreadLocalRandom.current().nextDouble() < properties.getClickRate();
        if (clicked) {
            scheduleStage(() -> handleClicked(request), randomDelay());
        }
    }

    private void handleClicked(SendRequest request) {
        callback(request, "CLICKED", null);

        boolean converted = ThreadLocalRandom.current().nextDouble() < properties.getConversionRate();
        if (converted) {
            scheduleStage(() -> callback(request, "CONVERTED", null), randomDelay());
        }
    }

    private void callback(SendRequest request, String eventType, Object metadata) {
        EventCallbackPayload payload = EventCallbackPayload.builder()
                .communicationId(request.getCommunicationId())
                .campaignId(request.getCampaignId())
                .customerId(request.getCustomerId())
                .eventType(eventType)
                .metadata(metadata)
                .build();
        callbackClient.sendCallback(payload);
    }

    private void scheduleStage(Runnable task, int delaySeconds) {
        scheduler.schedule(() -> {
            try {
                task.run();
            } catch (Exception e) {
                log.error("Simulation stage failed", e);
            }
        }, delaySeconds, TimeUnit.SECONDS);
    }

    private int randomDelay() {
        int min = Math.max(1, properties.getMinDelaySeconds());
        int max = Math.max(min, properties.getMaxDelaySeconds());
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }

    @PreDestroy
    public void shutdown() {
        scheduler.shutdown();
    }
}
