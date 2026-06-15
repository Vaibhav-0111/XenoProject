package com.xenoreach.crm.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Lightweight authenticated-principal representation derived from the JWT.
 */
@Getter
@AllArgsConstructor
public class UserPrincipal {
    private Long id;
    private String email;
    private String role;
}
