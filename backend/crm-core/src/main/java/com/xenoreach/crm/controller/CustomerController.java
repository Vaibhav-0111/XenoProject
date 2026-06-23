package com.xenoreach.crm.controller;

import com.xenoreach.crm.dto.request.CustomerRequest;
import com.xenoreach.crm.dto.response.CustomerResponse;
import com.xenoreach.crm.dto.response.CustomerTimelineResponse;
import com.xenoreach.crm.dto.response.PagedResponse;
import com.xenoreach.crm.service.CustomerService;
import com.xenoreach.crm.service.CsvImportService;
import com.xenoreach.crm.service.GoogleSheetsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@Tag(name = "Customers", description = "Customer management")
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final CsvImportService csvImportService;
    private final GoogleSheetsService googleSheetsService;

    @PostMapping
    public ResponseEntity<CustomerResponse> create(@Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(customerService.create(request));
    }

    @Operation(summary = "Import customers from a CSV file")
    @PostMapping("/import")
    public ResponseEntity<Map<String, Integer>> importCsv(@RequestParam("file") MultipartFile file) {
        try {
            int count = csvImportService.importCustomers(file.getInputStream());
            return ResponseEntity.ok(Map.of("imported", count));
        } catch (Exception e) {
            throw new RuntimeException("Failed to import CSV: " + e.getMessage());
        }
    }

    @Operation(summary = "Import customers from a Google Sheets URL")
    @PostMapping("/import/sheets")
    public ResponseEntity<Map<String, Integer>> importGoogleSheets(@RequestBody Map<String, String> payload) {
        String url = payload.get("url");
        if (url == null || url.isBlank()) {
            throw new RuntimeException("Google Sheets URL is required");
        }
        try {
            int count = googleSheetsService.importFromUrl(url);
            return ResponseEntity.ok(Map.of("imported", count));
        } catch (Exception e) {
            throw new RuntimeException("Failed to import from Google Sheets: " + e.getMessage());
        }
    }

    @Operation(summary = "List customers with pagination & sorting")
    @GetMapping
    public ResponseEntity<PagedResponse<CustomerResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        return ResponseEntity.ok(customerService.list(page, size, sortBy, direction));
    }

    @Operation(summary = "Search customers by name, email or phone")
    @GetMapping("/search")
    public ResponseEntity<PagedResponse<CustomerResponse>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(customerService.search(query, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getById(id));
    }

    @Operation(summary = "Get customer activity timeline (campaigns, deliveries, orders)")
    @GetMapping("/{id}/timeline")
    public ResponseEntity<CustomerTimelineResponse> getTimeline(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getTimeline(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> update(@PathVariable Long id, @Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.ok(customerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        customerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
