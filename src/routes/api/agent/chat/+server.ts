import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { runAgent, type ChatTurn } from '$lib/server/ai/agent'
import { MissingApiKeyError, hasApiKey } from '$lib/server/ai/llm'
import { requireUser } from '$lib/server/guard'

/**
 * POST /api/agent/chat
 * Ask the shipment agent something. Requires authentication.
 *
 * Request body:
 * - message: (required) the user's message
 * - history: (optional) prior turns [{ role: 'user' | 'assistant', content }]
 *
 * Response:
 * - reply, toolCalls, model, latencyMs
 */
export const POST: RequestHandler = async (event) => {
  const user = requireUser(event)

  if (!hasApiKey()) {
    return json({ error: new MissingApiKeyError().message }, { status: 503 })
  }

  try {
    const body = await event.request.json()
    const message: string = body?.message

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return json({ error: 'message is required' }, { status: 400 })
    }

    if (message.length > 4000) {
      return json({ error: 'message is too long (max 4000 characters)' }, { status: 400 })
    }

    const history: ChatTurn[] = Array.isArray(body?.history)
      ? body.history
          .filter(
            (t: any) =>
              t && (t.role === 'user' || t.role === 'assistant') && typeof t.content === 'string'
          )
          .slice(-10)
      : []

    // The form context is supplied by the client and is display-only data the
    // user typed themselves; it never carries identity or pricing authority.
    const formContext = body?.formContext ?? null

    return json(await runAgent(user.id, message, history, { formContext }))
  } catch (err) {
    if (err instanceof MissingApiKeyError) {
      return json({ error: err.message }, { status: 503 })
    }
    console.error('Agent error:', err)
    return json(
      { error: err instanceof Error ? err.message : 'The agent failed to answer' },
      { status: 500 }
    )
  }
}
