package com.xenoreach.crm.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SegmentPreviewRequest {

    @NotNull
    private Object rules;
}
