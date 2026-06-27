package com.xenoreach.crm.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CustomerRiskResponse {
    private Long customerId;
    private int riskScore; // 0-100
    private String riskLevel; // LOW, MEDIUM, HIGH
    private String riskReasoning;
}
