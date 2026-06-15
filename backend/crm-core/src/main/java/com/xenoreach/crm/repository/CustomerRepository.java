package com.xenoreach.crm.repository;

import com.xenoreach.crm.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {
    Optional<Customer> findByEmail(String email);
    boolean existsByEmail(String email);

    Page<Customer> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
            String name, String email, String phone, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("select coalesce(sum(c.totalSpend), 0) from Customer c")
    java.math.BigDecimal sumTotalSpend();
}
