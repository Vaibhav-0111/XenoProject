package com.xenoreach.crm.service;

import com.xenoreach.crm.dto.request.OrderRequest;
import com.xenoreach.crm.dto.response.OrderResponse;
import com.xenoreach.crm.dto.response.PagedResponse;

import java.util.List;

public interface OrderService {
    OrderResponse create(OrderRequest request);
    PagedResponse<OrderResponse> list(int page, int size);
    List<OrderResponse> getByCustomer(Long customerId);
}
