package com.xenoreach.crm.mapper;

import com.xenoreach.crm.dto.request.CustomerRequest;
import com.xenoreach.crm.dto.response.CustomerResponse;
import com.xenoreach.crm.entity.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public Customer toEntity(CustomerRequest request) {
        return Customer.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .city(request.getCity())
                .gender(request.getGender())
                .age(request.getAge())
                .build();
    }

    public void updateEntity(Customer customer, CustomerRequest request) {
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setCity(request.getCity());
        customer.setGender(request.getGender());
        customer.setAge(request.getAge());
    }

    public CustomerResponse toResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .city(customer.getCity())
                .gender(customer.getGender())
                .age(customer.getAge())
                .totalSpend(customer.getTotalSpend())
                .lastOrderDate(customer.getLastOrderDate())
                .createdAt(customer.getCreatedAt())
                .build();
    }
}
