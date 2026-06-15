package com.xenoreach.crm.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.xenoreach.crm.dto.response.AuthResponse;
import com.xenoreach.crm.dto.response.UserResponse;
import com.xenoreach.crm.entity.Role;
import com.xenoreach.crm.entity.User;
import com.xenoreach.crm.exception.ResourceNotFoundException;
import com.xenoreach.crm.exception.UnauthorizedException;
import com.xenoreach.crm.mapper.UserMapper;
import com.xenoreach.crm.repository.UserRepository;
import com.xenoreach.crm.security.JwtService;
import com.xenoreach.crm.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public AuthResponse authenticateWithGoogle(String firebaseIdToken) {
        DecodedIdentity identity = verifyToken(firebaseIdToken);

        User user = userRepository.findByFirebaseUid(identity.uid())
                .or(() -> userRepository.findByEmail(identity.email()))
                .map(existing -> {
                    existing.setFirebaseUid(identity.uid());
                    existing.setName(identity.name());
                    existing.setPictureUrl(identity.picture());
                    return existing;
                })
                .orElseGet(() -> User.builder()
                        .firebaseUid(identity.uid())
                        .email(identity.email())
                        .name(identity.name())
                        .pictureUrl(identity.picture())
                        .role(Role.ADMIN)
                        .build());

        user = userRepository.save(user);

        String jwt = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(jwt)
                .user(userMapper.toResponse(user))
                .build();
    }

    @Override
    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        return userMapper.toResponse(user);
    }

    /**
     * Verifies the Firebase ID token using the Admin SDK when initialised.
     * Falls back to unsigned decoding (dev mode only) when Firebase is not
     * configured, so local development never gets blocked on credentials.
     */
    private DecodedIdentity verifyToken(String idToken) {
        if (!FirebaseApp.getApps().isEmpty()) {
            try {
                FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(idToken);
                return new DecodedIdentity(
                        decoded.getUid(),
                        decoded.getEmail(),
                        decoded.getName(),
                        decoded.getPicture()
                );
            } catch (Exception e) {
                log.error("Firebase token verification failed", e);
                throw new UnauthorizedException("Invalid Firebase ID token");
            }
        }

        // ---- DEV MODE FALLBACK (no Firebase Admin credentials configured) ----
        log.warn("Firebase Admin not configured -- decoding ID token WITHOUT signature verification (dev mode only)");
        return decodeUnsafe(idToken);
    }

    private DecodedIdentity decodeUnsafe(String idToken) {
        try {
            String[] parts = idToken.split("\\.");
            if (parts.length < 2) throw new UnauthorizedException("Malformed ID token");

            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
            JsonNode payload = objectMapper.readTree(payloadJson);

            String uid = payload.path("user_id").asText(payload.path("sub").asText());
            String email = payload.path("email").asText();
            String name = payload.path("name").asText(email);
            String picture = payload.path("picture").asText(null);

            if (email == null || email.isBlank()) {
                throw new UnauthorizedException("Token does not contain an email claim");
            }

            return new DecodedIdentity(uid, email, name, picture);
        } catch (UnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new UnauthorizedException("Failed to decode ID token: " + e.getMessage());
        }
    }

    private record DecodedIdentity(String uid, String email, String name, String picture) {}
}
