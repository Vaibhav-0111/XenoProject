package com.xenoreach.crm.service;

import com.xenoreach.crm.entity.Customer;
import com.xenoreach.crm.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CsvImportService {

    private final CustomerRepository customerRepository;

    @Transactional
    public int importCustomers(InputStream inputStream) {
        int count = 0;
        try (Reader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.builder()
                     .setHeader()
                     .setSkipHeaderRecord(true)
                     .setIgnoreHeaderCase(true)
                     .setTrim(true)
                     .build())) {

            List<Customer> batch = new ArrayList<>();
            for (CSVRecord record : csvParser) {
                try {
                    String email = record.get("email");
                    if (email == null || email.isBlank() || customerRepository.existsByEmail(email)) {
                        continue;
                    }

                    Customer customer = new Customer();
                    customer.setEmail(email);
                    customer.setName(record.isMapped("name") ? record.get("name") : "Unknown");
                    
                    if (record.isMapped("phone")) customer.setPhone(record.get("phone"));
                    if (record.isMapped("city")) customer.setCity(record.get("city"));
                    if (record.isMapped("gender")) customer.setGender(record.get("gender"));
                    
                    if (record.isMapped("age")) {
                        try {
                            customer.setAge(Integer.parseInt(record.get("age")));
                        } catch (NumberFormatException ignored) {}
                    }
                    
                    if (record.isMapped("totalSpend")) {
                        try {
                            customer.setTotalSpend(Double.parseDouble(record.get("totalSpend")));
                        } catch (NumberFormatException ignored) {}
                    }

                    batch.add(customer);
                    
                    // Batch save every 500 records to prevent memory issues
                    if (batch.size() >= 500) {
                        customerRepository.saveAll(batch);
                        count += batch.size();
                        batch.clear();
                    }

                } catch (Exception e) {
                    log.warn("Skipping invalid CSV record: {}", e.getMessage());
                }
            }
            
            // Save remaining
            if (!batch.isEmpty()) {
                customerRepository.saveAll(batch);
                count += batch.size();
            }

        } catch (Exception e) {
            log.error("Failed to parse CSV file", e);
            throw new RuntimeException("Failed to parse CSV file: " + e.getMessage());
        }
        
        log.info("Successfully imported {} customers", count);
        return count;
    }
}
