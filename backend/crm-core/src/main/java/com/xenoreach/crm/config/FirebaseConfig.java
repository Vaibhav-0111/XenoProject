package com.xenoreach.crm.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.util.Base64;

/**
 * Initialises the Firebase Admin SDK so that ID tokens issued by
 * "Sign in with Google" on the frontend can be verified server-side.
 *
 * If app.firebase.enabled=false (or no credentials are supplied), Firebase
 * verification is skipped and a lightweight dev-mode token decoder is used
 * instead (see AuthService). This keeps local development friction-free.
 */
@Slf4j
@Component
public class FirebaseConfig {

    @Value("${app.firebase.enabled:true}")
    private boolean enabled;

    @Value("${app.firebase.credentials-base64:}")
    private String credentialsBase64;

    @PostConstruct
    public void init() {
        if (!enabled || credentialsBase64 == null || credentialsBase64.isBlank()) {
            log.warn("Firebase Admin SDK not initialised (app.firebase.enabled={}, credentials present={}). " +
                    "Falling back to dev-mode token verification.", enabled, credentialsBase64 != null && !credentialsBase64.isBlank());
            return;
        }

        try {
            if (FirebaseApp.getApps().isEmpty()) {
                byte[] decoded = Base64.getDecoder().decode(credentialsBase64);
                GoogleCredentials credentials = GoogleCredentials.fromStream(new ByteArrayInputStream(decoded));

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(credentials)
                        .build();

                FirebaseApp.initializeApp(options);
                log.info("Firebase Admin SDK initialised successfully.");
            }
        } catch (Exception e) {
            log.error("Failed to initialise Firebase Admin SDK. Falling back to dev-mode verification.", e);
        }
    }
}
