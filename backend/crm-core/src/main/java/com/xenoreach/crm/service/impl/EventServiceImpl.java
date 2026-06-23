package com.xenoreach.crm.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xenoreach.crm.dto.request.EventCallbackRequest;
import com.xenoreach.crm.entity.Communication;
import com.xenoreach.crm.entity.CommunicationStatus;
import com.xenoreach.crm.entity.Event;
import com.xenoreach.crm.exception.BadRequestException;
import com.xenoreach.crm.exception.ResourceNotFoundException;
import com.xenoreach.crm.repository.CommunicationRepository;
import com.xenoreach.crm.repository.EventRepository;
import com.xenoreach.crm.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final CommunicationRepository communicationRepository;
    private final EventRepository eventRepository;
    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public void processCallback(EventCallbackRequest request) {
        Communication communication = resolveCommunication(request);
        LocalDateTime now = LocalDateTime.now();

        String metadataJson = null;
        if (request.getMetadata() != null) {
            try {
                metadataJson = objectMapper.writeValueAsString(request.getMetadata());
            } catch (Exception e) {
                log.warn("Failed to serialise event metadata", e);
            }
        }

        Event event = Event.builder()
                .communication(communication)
                .type(request.getEventType())
                .metadataJson(metadataJson)
                .occurredAt(now)
                .build();
        eventRepository.save(event);

        switch (request.getEventType()) {
            case SENT:
                if (communication.getSentAt() == null) communication.setSentAt(now);
                if (communication.getStatus() == CommunicationStatus.PENDING) {
                    communication.setStatus(CommunicationStatus.SENT);
                }
                break;
            case DELIVERED:
                communication.setStatus(CommunicationStatus.DELIVERED);
                communication.setDeliveredAt(now);
                break;
            case OPENED:
                communication.setStatus(CommunicationStatus.OPENED);
                communication.setOpenedAt(now);
                break;
            case READ:
                communication.setStatus(CommunicationStatus.READ);
                if (communication.getOpenedAt() == null) communication.setOpenedAt(now);
                break;
            case CLICKED:
                communication.setStatus(CommunicationStatus.CLICKED);
                communication.setClickedAt(now);
                if (communication.getOpenedAt() == null) communication.setOpenedAt(now);
                break;
            case CONVERTED:
                communication.setConverted(true);
                break;
            case FAILED:
                communication.setStatus(CommunicationStatus.FAILED);
                communication.setFailedAt(now);
                if (request.getMetadata() != null) {
                    communication.setFailureReason(String.valueOf(request.getMetadata()));
                }
                break;
            default:
                log.warn("Unhandled event type: {}", request.getEventType());
        }

        communicationRepository.save(communication);

        // Broadcast real-time event to the dashboard
        try {
            messagingTemplate.convertAndSend("/topic/dashboard", Map.of(
                    "type", "NEW_EVENT",
                    "eventType", event.getType().name(),
                    "customerName", communication.getCustomer().getName(),
                    "campaignName", communication.getCampaign().getName(),
                    "channel", communication.getChannel().name()
            ));
        } catch (Exception e) {
            log.warn("Failed to broadcast real-time event", e);
        }
    }

    private Communication resolveCommunication(EventCallbackRequest request) {
        if (request.getCommunicationId() != null) {
            return communicationRepository.findById(request.getCommunicationId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Communication", request.getCommunicationId()));
        }

        if (request.getCampaignId() != null && request.getCustomerId() != null) {
            return communicationRepository
                    .findTopByCampaignAndCustomer(request.getCampaignId(), request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No communication found for campaign " + request.getCampaignId() + " and customer " + request.getCustomerId()));
        }

        throw new BadRequestException("Either communicationId or (campaignId and customerId) must be provided");
    }
}
