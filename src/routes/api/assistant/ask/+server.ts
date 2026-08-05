import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ask } from '$lib/server/ai/rag'
import { MissingApiKeyError, hasApiKey } from '$lib/server/ai/llm'
import { requireUser } from '$lib/server/guard'

/**
 * POST /api/assistant/ask
 * Answer a question about the shipping rules from the indexed documentation.
 *
 * Request body:
 * - question: (required)
 * - k: (optional) how many passages to retrieve, 1-10 (default 4)
 */
export const POST: RequestHandler = async (event) => {
  requireUser(event)

  if (!hasApiKey()) {
    return json({ error: new MissingApiKeyError().message }, { status: 503 })
  }

  try {
    const body = await event.request.json()
    const question: string = body?.question

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return json({ error: 'question is required' }, { status: 400 })
    }

    const k = Number.isInteger(body?.k) ? Math.min(Math.max(body.k, 1), 10) : 4

    return json(await ask(question, k))
  } catch (err) {
    if (err instanceof MissingApiKeyError) {
      return json({ error: err.message }, { status: 503 })
    }
    console.error('Assistant error:', err)
    return json({ error: err instanceof Error ? err.message : 'Failed to answer' }, { status: 500 })
  }
}
