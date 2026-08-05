import { ChatOpenAICompletions, OpenAIEmbeddings } from '@langchain/openai'

/**
 * OpenRouter is OpenAI-compatible, so we point the OpenAI adapters at its base URL.
 *
 * Every student supplies their own key — get one at https://openrouter.ai/keys and
 * put it in .env as OPENROUTER_API_KEY.
 */
export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

export const DEFAULT_MODEL = 'google/gemini-3.5-flash-lite'
export const DEFAULT_EMBEDDING_MODEL = 'openai/text-embedding-3-small'

export class MissingApiKeyError extends Error {
  constructor() {
    super(
      'OPENROUTER_API_KEY is not set. Add your own key to .env — get one at https://openrouter.ai/keys'
    )
    this.name = 'MissingApiKeyError'
  }
}

export function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY
  if (!key || key.trim() === '') {
    throw new MissingApiKeyError()
  }
  return key
}

export function hasApiKey(): boolean {
  return !!process.env.OPENROUTER_API_KEY?.trim()
}

export function getModelName(): string {
  return process.env.OPENROUTER_MODEL || DEFAULT_MODEL
}

export function getEmbeddingModelName(): string {
  return process.env.OPENROUTER_EMBEDDING_MODEL || DEFAULT_EMBEDDING_MODEL
}

/**
 * Chat model used by both the agent and the assistant.
 *
 * We use ChatOpenAICompletions rather than ChatOpenAI because OpenRouter only
 * implements the /chat/completions endpoint, not OpenAI's newer Responses API.
 *
 * temperature is 0 so that the same question produces the same answer as often
 * as the model allows — this app exists to be tested.
 */
export function getChatModel(overrides?: { model?: string; temperature?: number }) {
  return new ChatOpenAICompletions({
    model: overrides?.model || getModelName(),
    apiKey: getApiKey(),
    temperature: overrides?.temperature ?? 0,
    configuration: {
      baseURL: OPENROUTER_BASE_URL,
      defaultHeaders: {
        'HTTP-Referer': 'https://qacart.com',
        'X-Title': 'ShipTest',
      },
    },
  })
}

/**
 * Embedding model used to index the docs for retrieval.
 */
export function getEmbeddings() {
  return new OpenAIEmbeddings({
    model: getEmbeddingModelName(),
    apiKey: getApiKey(),
    configuration: {
      baseURL: OPENROUTER_BASE_URL,
    },
  })
}
