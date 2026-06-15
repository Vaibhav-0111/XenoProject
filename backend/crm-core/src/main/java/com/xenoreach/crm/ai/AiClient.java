package com.xenoreach.crm.ai;

/**
 * Abstraction over an LLM text-completion provider (Gemini / OpenAI / Mock).
 * Implementations must return raw text -- callers are responsible for
 * parsing structured (JSON) output.
 */
public interface AiClient {

    /**
     * @param systemPrompt instructions describing the desired behaviour & output format
     * @param userPrompt   the user's natural-language input
     * @return raw text completion (expected to be JSON for AI-native endpoints)
     */
    String complete(String systemPrompt, String userPrompt);

    String providerName();
}
