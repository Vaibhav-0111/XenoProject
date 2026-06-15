package com.xenoreach.crm.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class CustomerResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String city;
    private String gender;
    private Integer age;
    private BigDecimal totalSpend;
    private LocalDateTime lastOrderDate;
    private LocalDateTime createdAt;
}
