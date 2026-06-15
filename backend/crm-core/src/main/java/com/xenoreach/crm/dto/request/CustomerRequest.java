package com.xenoreach.crm.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CustomerRequest {

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    private String phone;

    private String city;

    private String gender;

    @Min(0)
    @Max(150)
    private Integer age;
}
