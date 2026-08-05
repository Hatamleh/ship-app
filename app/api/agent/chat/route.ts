import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { runAgent, type ChatTurn } from '@/lib/ai/agent'
import { MissingApiKeyError, hasApiKey } from '@/lib/ai/llm'

// Prisma, bcrypt and the LangChain adapters all need the Node runtime.
export const runtime = 'nodejs'

/**
 * POST /api/agent/chat
 * Ask the shipment agent something. Requires authentication.
 *
 * Request body:
 * - message: (required) the user's message
 * - history: (optional) prior turns [{ role: 'user' | 'assistant', content: string }]
 *
 * Response:
 * - reply:     the agent's answer
 * - toolCalls: which tools ran, with their arguments and raw results
 * - model:     the model that produced the answer
 * - latencyMs: wall-clock time for the turn
 */
export async function POST(request: NextRequest) {
  const { user, response } = await requireAuth(request)
  if (response) return response

  if (!hasApiKey()) {
    return NextResponse.json({ error: new MissingApiKeyError().message }, { status: 503 })
  }

  try {
    const body = await request.json()
    const message: string = body?.message

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'message is required' }, { status: 400 })
    }

    if (message.length > 4000) {
      return NextResponse.json({ error: 'message is too long (max 4000 characters)' }, { status: 400 })
    }

    const history: ChatTurn[] = Array.isArray(body?.history)
      ? body.history
          .filter(
            (t: any) =>
              t && (t.role === 'user' || t.role === 'assistant') && typeof t.content === 'string'
          )
          .slice(-10)
      : []

    const result = await runAgent(user!.id, message, history)

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof MissingApiKeyError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }
    console.error('Agent error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'The agent failed to answer' },
      { status: 500 }
    )
  }
}
