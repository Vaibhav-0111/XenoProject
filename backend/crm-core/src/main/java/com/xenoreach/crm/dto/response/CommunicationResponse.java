package com.xenoreach.crm.dto.response;

import com.xenoreach.crm.entity.Channel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class CommunicationResponse {
    private Long id;
    private Long campaignId;
    private Long customerId;
    private String customerName;
    private Channel channel;
    private String status;
    private Boolean converted;
    private LocalDateTime sentAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime openedAt;
    private LocalDateTime clickedAt;
}
