package com.xenoreach.channel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SendRequest {

    @NotNull
    private Long communicationId;

    @NotNull
    private Long campaignId;

    @NotNull
    private Long customerId;

    @NotBlank
    private String channel; // WHATSAPP | SMS | EMAIL | RCS

    @NotBlank
    private String message;

    private String recipient;
}
