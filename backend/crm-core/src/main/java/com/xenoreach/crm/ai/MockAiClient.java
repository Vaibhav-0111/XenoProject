package com.xenoreach.crm.ai;

import lombok.extern.slf4j.Slf4j;

/**
 * Deterministic, dependency-free AI provider used when no API key is
 * configured (app.ai.provider=mock, or as an automatic fallback).
 *
 * It never throws -- AiService falls back to its own heuristic generators
 * whenever this client is in play, ensuring the AI-native endpoints remain
 * fully functional in offline / demo environments.
 */
@Slf4j
public class MockAiClient implements AiClient {

    @Override
    public String complete(String systemPrompt, String userPrompt) {
        // Signal to AiService that it should use its local heuristic generators.
        throw new UnsupportedOperationException("Mock AI provider active -- using heuristic generation");
    }

    @Override
    public String providerName() {
        return "mock";
    }
}
