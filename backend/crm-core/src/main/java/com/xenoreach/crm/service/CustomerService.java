package com.xenoreach.crm.service;

import com.xenoreach.crm.dto.request.CustomerRequest;
import com.xenoreach.crm.dto.response.CustomerResponse;
import com.xenoreach.crm.dto.response.PagedResponse;

public interface CustomerService {
    CustomerResponse create(CustomerRequest request);
    CustomerResponse getById(Long id);
    PagedResponse<CustomerResponse> list(int page, int size, String sortBy, String direction);
    PagedResponse<CustomerResponse> search(String query, int page, int size);
    CustomerResponse update(Long id, CustomerRequest request);
    void delete(Long id);
}
