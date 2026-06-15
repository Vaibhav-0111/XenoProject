package com.xenoreach.crm.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SegmentRequest {

    @NotBlank
    private String name;

    private String description;

    /**
     * Rule tree object, e.g.
     * {
     *   "operator": "AND",
     *   "conditions": [
     *     {"field": "totalSpend", "operator": ">", "value": 5000},
     *     {"field": "inactiveDays", "operator": ">", "value": 60}
     *   ]
     * }
     */
    @NotNull
    private Object rules;
}
