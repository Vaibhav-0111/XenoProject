package com.xenoreach.crm.service;

import com.xenoreach.crm.dto.response.AuthResponse;
import com.xenoreach.crm.dto.response.UserResponse;

public interface AuthService {
    AuthResponse authenticateWithGoogle(String firebaseIdToken);
    UserResponse getCurrentUser(Long userId);
}
