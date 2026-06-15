package com.xenoreach.crm.mapper;

import com.xenoreach.crm.dto.response.CommunicationResponse;
import com.xenoreach.crm.entity.Communication;
import org.springframework.stereotype.Component;

@Component
public class CommunicationMapper {

    public CommunicationResponse toResponse(Communication c) {
        return CommunicationResponse.builder()
                .id(c.getId())
                .campaignId(c.getCampaign().getId())
                .customerId(c.getCustomer().getId())
                .customerName(c.getCustomer().getName())
                .channel(c.getChannel())
                .status(c.getStatus().name())
                .converted(c.getConverted())
                .sentAt(c.getSentAt())
                .deliveredAt(c.getDeliveredAt())
                .openedAt(c.getOpenedAt())
                .clickedAt(c.getClickedAt())
                .build();
    }
}
