package com.xenoreach.channel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SendResponse {
    private Long communicationId;
    private String status;
    private String message;
}
