package com.xenoreach.channel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class EventCallbackPayload {
    private Long communicationId;
    private Long campaignId;
    private Long customerId;
    private String eventType;   // DELIVERED | OPENED | READ | CLICKED | CONVERTED | FAILED
    private Object metadata;
}
