import { NextResponse } from 'next/server'
import { countChunks } from '@/lib/ai/retriever'
import { hasApiKey, getModelName, getEmbeddingModelName } from '@/lib/ai/llm'

export const runtime = 'nodejs'

/**
 * GET /api/agent/health
 * Smoke check for the AI features. Does not call OpenRouter, so it is free and fast.
 * Public on purpose: it reports configuration state, never data.
 */
export async function GET() {
  const indexedChunks = await countChunks().catch(() => 0)
  const apiKeyConfigured = hasApiKey()

  return NextResponse.json(
    {
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
    },
    { status: 200 }
  )
}
