package com.xenoreach.crm.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerTimelineResponse {

    private Long customerId;
    private String customerName;
    private String email;
    private List<TimelineEntry> timeline;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimelineEntry {
        /** "CAMPAIGN_SENT", "DELIVERED", "OPENED", "CLICKED", "FAILED", "CONVERTED", "ORDER" */
        private String type;
        private String title;
        private String description;
        private String channel;
        private BigDecimal amount;
        private LocalDateTime occurredAt;
        private Long campaignId;
        private String campaignName;
    }
}
