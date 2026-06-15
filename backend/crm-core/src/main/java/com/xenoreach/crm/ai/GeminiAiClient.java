package com.xenoreach.crm.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Slf4j
public class GeminiAiClient implements AiClient {

    private final WebClient webClient;
    private final String apiKey;
    private final String model;
    private final ObjectMapper objectMapper;

    public GeminiAiClient(WebClient.Builder builder,
                           @Value("${app.ai.gemini.base-url}") String baseUrl,
                           @Value("${app.ai.gemini.api-key}") String apiKey,
                           @Value("${app.ai.gemini.model}") String model,
                           ObjectMapper objectMapper) {
        this.webClient = builder.baseUrl(baseUrl).build();
        this.apiKey = apiKey;
        this.model = model;
        this.objectMapper = objectMapper;
    }

    @Override
    public String complete(String systemPrompt, String userPrompt) {
        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("role", "user", "parts", List.of(Map.of("text", userPrompt)))
                ),
                "systemInstruction", Map.of("parts", List.of(Map.of("text", systemPrompt))),
                "generationConfig", Map.of(
                        "temperature", 0.4,
                        "responseMimeType", "application/json"
                )
        );

        try {
            String response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/models/{model}:generateContent")
                            .queryParam("key", apiKey)
                            .build(model))
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(response);
            return root.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText();
        } catch (Exception e) {
            log.error("Gemini API call failed", e);
            throw new RuntimeException("AI provider request failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String providerName() {
        return "gemini";
    }
}
