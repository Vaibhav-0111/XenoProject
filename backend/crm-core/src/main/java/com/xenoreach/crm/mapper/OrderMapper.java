package com.xenoreach.crm.mapper;

import com.xenoreach.crm.dto.response.OrderResponse;
import com.xenoreach.crm.entity.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .customerId(order.getCustomer().getId())
                .customerName(order.getCustomer().getName())
                .amount(order.getAmount())
                .status(order.getStatus())
                .orderDate(order.getOrderDate())
                .build();
    }
}
