import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { ask } from '@/lib/ai/rag'
import { MissingApiKeyError, hasApiKey } from '@/lib/ai/llm'

export const runtime = 'nodejs'

/**
 * POST /api/assistant/ask
 * Answer a question about the shipping rules from the indexed documentation.
 *
 * Request body:
 * - question: (required) the question
 * - k:        (optional) how many passages to retrieve, 1-10 (default 4)
 *
 * Response:
 * - answer:  the cited answer
 * - sources: the passages used, with their similarity scores
 */
export async function POST(request: NextRequest) {
  const { response } = await requireAuth(request)
  if (response) return response

  if (!hasApiKey()) {
    return NextResponse.json({ error: new MissingApiKeyError().message }, { status: 503 })
  }

  try {
    const body = await request.json()
    const question: string = body?.question

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return NextResponse.json({ error: 'question is required' }, { status: 400 })
    }

    const k = Number.isInteger(body?.k) ? Math.min(Math.max(body.k, 1), 10) : 4

    return NextResponse.json(await ask(question, k))
  } catch (error) {
    if (error instanceof MissingApiKeyError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }
    console.error('Assistant error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to answer' },
      { status: 500 }
    )
  }
}
