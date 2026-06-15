package com.xenoreach.crm.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Slf4j
@Configuration
public class AiClientConfig {

    @Bean
    public AiClient aiClient(WebClient.Builder builder,
                              ObjectMapper objectMapper,
                              @Value("${app.ai.provider}") String provider,
                              @Value("${app.ai.gemini.base-url}") String geminiBaseUrl,
                              @Value("${app.ai.gemini.api-key}") String geminiKey,
                              @Value("${app.ai.gemini.model}") String geminiModel,
                              @Value("${app.ai.openai.base-url}") String openAiBaseUrl,
                              @Value("${app.ai.openai.api-key}") String openAiKey,
                              @Value("${app.ai.openai.model}") String openAiModel) {

        String resolvedProvider = provider == null ? "mock" : provider.toLowerCase();

        switch (resolvedProvider) {
            case "gemini":
                if (geminiKey != null && !geminiKey.isBlank()) {
                    log.info("AI provider: Gemini ({})", geminiModel);
                    return new GeminiAiClient(builder, geminiBaseUrl, geminiKey, geminiModel, objectMapper);
                }
                log.warn("AI provider 'gemini' selected but GEMINI_API_KEY is missing -- falling back to mock provider.");
                break;
            case "openai":
                if (openAiKey != null && !openAiKey.isBlank()) {
                    log.info("AI provider: OpenAI ({})", openAiModel);
                    return new OpenAiClient(builder, openAiBaseUrl, openAiKey, openAiModel, objectMapper);
                }
                log.warn("AI provider 'openai' selected but OPENAI_API_KEY is missing -- falling back to mock provider.");
                break;
            default:
                log.info("AI provider: mock (heuristic, no external calls)");
        }

        return new MockAiClient();
    }
}
