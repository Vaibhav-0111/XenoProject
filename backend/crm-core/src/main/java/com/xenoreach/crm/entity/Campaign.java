package com.xenoreach.crm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "campaigns")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "segment_id", nullable = false)
    private Segment segment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Channel channel;

    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    private String cta;

    @Column(name = "ab_testing_enabled")
    @Builder.Default
    private boolean abTestingEnabled = false;

    @Column(name = "variant_b_subject")
    private String variantBSubject;

    @Column(name = "variant_b_message", columnDefinition = "TEXT")
    private String variantBMessage;

    @Column(name = "variant_b_cta")
    private String variantBCta;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private CampaignStatus status = CampaignStatus.DRAFT;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "scheduled_for")
    private LocalDateTime scheduledFor;

    @Column(name = "launched_at")
    private LocalDateTime launchedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
