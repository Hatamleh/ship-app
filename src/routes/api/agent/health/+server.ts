import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { countChunks } from '$lib/server/ai/retriever'
import { hasApiKey, getModelName, getEmbeddingModelName } from '$lib/server/ai/llm'

/**
 * GET /api/agent/health
 * Smoke check for the AI features. Never calls OpenRouter, so it is free.
 * Public on purpose: it reports configuration state, never data.
 */
export const GET: RequestHandler = async () => {
  const indexedChunks = await countChunks().catch(() => 0)
  const apiKeyConfigured = hasApiKey()

  return json({
    ok: apiKeyConfigured && indexedChunks > 0,
    apiKeyConfigured,
    model: getModelName(),
    embeddingModel: getEmbeddingModelName(),
    indexedChunks,
    hints: [
      ...(apiKeyConfigured
        ? []
        : ['Set OPENROUTER_API_KEY in .env — get a key at https://openrouter.ai/keys']),
      ...(indexedChunks > 0 ? [] : ['Run `npm run ingest` to build the documentation index']),
    ],
  })
}
