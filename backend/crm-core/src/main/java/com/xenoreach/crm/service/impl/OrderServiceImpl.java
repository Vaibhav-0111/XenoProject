package com.xenoreach.crm.service.impl;

import com.xenoreach.crm.dto.request.OrderRequest;
import com.xenoreach.crm.dto.response.OrderResponse;
import com.xenoreach.crm.dto.response.PagedResponse;
import com.xenoreach.crm.entity.Customer;
import com.xenoreach.crm.entity.Order;
import com.xenoreach.crm.exception.ResourceNotFoundException;
import com.xenoreach.crm.mapper.OrderMapper;
import com.xenoreach.crm.repository.CustomerRepository;
import com.xenoreach.crm.repository.OrderRepository;
import com.xenoreach.crm.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderResponse create(OrderRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> ResourceNotFoundException.of("Customer", request.getCustomerId()));

        LocalDateTime orderDate = request.getOrderDate() != null ? request.getOrderDate() : LocalDateTime.now();

        Order order = Order.builder()
                .customer(customer)
                .amount(request.getAmount())
                .status(request.getStatus() != null ? request.getStatus() : "COMPLETED")
                .orderDate(orderDate)
                .build();

        order = orderRepository.save(order);

        // Update denormalised customer aggregates (totalSpend, lastOrderDate)
        customer.setTotalSpend(customer.getTotalSpend().add(request.getAmount()));
        if (customer.getLastOrderDate() == null || orderDate.isAfter(customer.getLastOrderDate())) {
            customer.setLastOrderDate(orderDate);
        }
        customerRepository.save(customer);

        return orderMapper.toResponse(order);
    }

    @Override
    public PagedResponse<OrderResponse> list(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate").descending());
        Page<Order> result = orderRepository.findAll(pageable);

        return PagedResponse.<OrderResponse>builder()
                .content(result.getContent().stream().map(orderMapper::toResponse).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .last(result.isLast())
                .build();
    }

    @Override
    public List<OrderResponse> getByCustomer(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw ResourceNotFoundException.of("Customer", customerId);
        }
        return orderRepository.findByCustomerIdOrderByOrderDateDesc(customerId)
                .stream().map(orderMapper::toResponse).toList();
    }
}
