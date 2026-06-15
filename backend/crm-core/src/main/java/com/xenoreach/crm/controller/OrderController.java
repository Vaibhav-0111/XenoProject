package com.xenoreach.crm.controller;

import com.xenoreach.crm.dto.request.OrderRequest;
import com.xenoreach.crm.dto.response.OrderResponse;
import com.xenoreach.crm.dto.response.PagedResponse;
import com.xenoreach.crm.service.OrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Orders", description = "Order ingestion & history")
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody OrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.create(request));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<OrderResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(orderService.list(page, size));
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<List<OrderResponse>> getByCustomer(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getByCustomer(id));
    }
}
