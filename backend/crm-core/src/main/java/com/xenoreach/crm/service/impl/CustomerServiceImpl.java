package com.xenoreach.crm.service.impl;

import com.xenoreach.crm.dto.request.CustomerRequest;
import com.xenoreach.crm.dto.response.CustomerResponse;
import com.xenoreach.crm.dto.response.CustomerTimelineResponse;
import com.xenoreach.crm.dto.response.CustomerTimelineResponse.TimelineEntry;
import com.xenoreach.crm.dto.response.PagedResponse;
import com.xenoreach.crm.entity.Communication;
import com.xenoreach.crm.entity.Customer;
import com.xenoreach.crm.entity.Order;
import com.xenoreach.crm.exception.BadRequestException;
import com.xenoreach.crm.exception.ResourceNotFoundException;
import com.xenoreach.crm.mapper.CustomerMapper;
import com.xenoreach.crm.repository.CommunicationRepository;
import com.xenoreach.crm.repository.CustomerRepository;
import com.xenoreach.crm.repository.OrderRepository;
import com.xenoreach.crm.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final CommunicationRepository communicationRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public CustomerResponse create(CustomerRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("A customer with this email already exists: " + request.getEmail());
        }
        Customer customer = customerMapper.toEntity(request);
        customer = customerRepository.save(customer);
        return customerMapper.toResponse(customer);
    }

    @Override
    public CustomerResponse getById(Long id) {
        return customerMapper.toResponse(findEntity(id));
    }

    @Override
    public PagedResponse<CustomerResponse> list(int page, int size, String sortBy, String direction) {
        Sort sort = Sort.by(sortBy == null || sortBy.isBlank() ? "createdAt" : sortBy);
        sort = "asc".equalsIgnoreCase(direction) ? sort.ascending() : sort.descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Customer> result = customerRepository.findAll(pageable);
        return toPagedResponse(result);
    }

    @Override
    public PagedResponse<CustomerResponse> search(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Customer> result = customerRepository
                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
                        query, query, query, pageable);
        return toPagedResponse(result);
    }

    @Override
    @Transactional
    public CustomerResponse update(Long id, CustomerRequest request) {
        Customer customer = findEntity(id);

        if (!customer.getEmail().equalsIgnoreCase(request.getEmail())
                && customerRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("A customer with this email already exists: " + request.getEmail());
        }

        customerMapper.updateEntity(customer, request);
        customer = customerRepository.save(customer);
        return customerMapper.toResponse(customer);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Customer customer = findEntity(id);
        customerRepository.delete(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerTimelineResponse getTimeline(Long customerId) {
        Customer customer = findEntity(customerId);

        List<TimelineEntry> entries = new ArrayList<>();

        // 1. Communications (campaign sends + delivery stages)
        List<Communication> comms = communicationRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
        for (Communication comm : comms) {
            String campaignName = comm.getCampaign().getName();
            Long campaignId = comm.getCampaign().getId();
            String channel = comm.getChannel().name();

            // Initial send
            if (comm.getSentAt() != null) {
                entries.add(TimelineEntry.builder()
                        .type("CAMPAIGN_SENT")
                        .title("Campaign sent")
                        .description("\"" + campaignName + "\" via " + channel)
                        .channel(channel)
                        .occurredAt(comm.getSentAt())
                        .campaignId(campaignId)
                        .campaignName(campaignName)
                        .build());
            }

            // Delivered
            if (comm.getDeliveredAt() != null) {
                entries.add(TimelineEntry.builder()
                        .type("DELIVERED")
                        .title("Message delivered")
                        .description("\"" + campaignName + "\" was delivered")
                        .channel(channel)
                        .occurredAt(comm.getDeliveredAt())
                        .campaignId(campaignId)
                        .campaignName(campaignName)
                        .build());
            }

            // Opened
            if (comm.getOpenedAt() != null) {
                entries.add(TimelineEntry.builder()
                        .type("OPENED")
                        .title("Message opened")
                        .description("Opened \"" + campaignName + "\"")
                        .channel(channel)
                        .occurredAt(comm.getOpenedAt())
                        .campaignId(campaignId)
                        .campaignName(campaignName)
                        .build());
            }

            // Clicked
            if (comm.getClickedAt() != null) {
                entries.add(TimelineEntry.builder()
                        .type("CLICKED")
                        .title("Link clicked")
                        .description("Clicked CTA in \"" + campaignName + "\"")
                        .channel(channel)
                        .occurredAt(comm.getClickedAt())
                        .campaignId(campaignId)
                        .campaignName(campaignName)
                        .build());
            }

            // Failed
            if (comm.getFailedAt() != null) {
                entries.add(TimelineEntry.builder()
                        .type("FAILED")
                        .title("Delivery failed")
                        .description("\"" + campaignName + "\" failed" +
                                (comm.getFailureReason() != null ? ": " + comm.getFailureReason() : ""))
                        .channel(channel)
                        .occurredAt(comm.getFailedAt())
                        .campaignId(campaignId)
                        .campaignName(campaignName)
                        .build());
            }

            // Converted
            if (Boolean.TRUE.equals(comm.getConverted())) {
                entries.add(TimelineEntry.builder()
                        .type("CONVERTED")
                        .title("Conversion!")
                        .description("Converted from \"" + campaignName + "\"")
                        .channel(channel)
                        .occurredAt(comm.getClickedAt() != null ? comm.getClickedAt().plusSeconds(5) : comm.getUpdatedAt())
                        .campaignId(campaignId)
                        .campaignName(campaignName)
                        .build());
            }
        }

        // 2. Orders
        List<Order> orders = orderRepository.findByCustomerIdOrderByOrderDateDesc(customerId);
        for (Order order : orders) {
            entries.add(TimelineEntry.builder()
                    .type("ORDER")
                    .title("Order placed")
                    .description("₹" + order.getAmount().toPlainString() + " · " + order.getStatus())
                    .amount(order.getAmount())
                    .occurredAt(order.getOrderDate())
                    .build());
        }

        // Sort all entries by date descending (newest first)
        entries.sort(Comparator.comparing(TimelineEntry::getOccurredAt,
                Comparator.nullsLast(Comparator.reverseOrder())));

        return CustomerTimelineResponse.builder()
                .customerId(customer.getId())
                .customerName(customer.getName())
                .email(customer.getEmail())
                .timeline(entries)
                .build();
    }

    private Customer findEntity(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Customer", id));
    }

    private PagedResponse<CustomerResponse> toPagedResponse(Page<Customer> page) {
        return PagedResponse.<CustomerResponse>builder()
                .content(page.getContent().stream().map(customerMapper::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
