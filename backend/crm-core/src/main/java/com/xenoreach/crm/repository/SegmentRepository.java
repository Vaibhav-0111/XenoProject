package com.xenoreach.crm.repository;

import com.xenoreach.crm.entity.Segment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SegmentRepository extends JpaRepository<Segment, Long> {
    Page<Segment> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Segment> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
