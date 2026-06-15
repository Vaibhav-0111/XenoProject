package com.xenoreach.crm.service.impl;

import com.xenoreach.crm.dto.request.CustomerRequest;
import com.xenoreach.crm.dto.response.CustomerResponse;
import com.xenoreach.crm.dto.response.PagedResponse;
import com.xenoreach.crm.entity.Customer;
import com.xenoreach.crm.exception.BadRequestException;
import com.xenoreach.crm.exception.ResourceNotFoundException;
import com.xenoreach.crm.mapper.CustomerMapper;
import com.xenoreach.crm.repository.CustomerRepository;
import com.xenoreach.crm.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

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
