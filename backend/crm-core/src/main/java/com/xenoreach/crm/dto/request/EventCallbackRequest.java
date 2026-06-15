package com.xenoreach.crm.dto.request;

import com.xenoreach.crm.entity.EventType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * Payload sent by the Channel Simulator service when a communication's
 * lifecycle changes (delivered, opened, clicked, failed, etc.)
 *
 * The simulator can identify the communication either directly via
 * communicationId, or via the (campaignId, customerId) pair --
 * matching the contract described in the assignment brief.
 */
@Getter @Setter
public class EventCallbackRequest {

    private Long communicationId;

    private Long campaignId;

    private Long customerId;

    @NotNull
    private EventType eventType;

    private Object metadata;
}
