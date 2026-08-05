import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { retrieve, countChunks } from '@/lib/ai/retriever'
import { MissingApiKeyError, hasApiKey } from '@/lib/ai/llm'

export const runtime = 'nodejs'

/**
 * POST /api/assistant/search
 * Retrieval only — no chat model is called, so the result depends solely on the
 * embedding of the query and the indexed chunks. This is the endpoint to assert
 * against when you want to test retrieval quality on its own.
 *
 * Request body:
 * - query:    (required) the search query
 * - k:        (optional) how many chunks, 1-10 (default 4)
 * - minScore: (optional) drop chunks below this cosine similarity
 *
 * Response:
 * - results:      the matching chunks with source, heading, score and content
 * - indexedChunks: how many chunks exist in the index
 */
export async function POST(request: NextRequest) {
  const { response } = await requireAuth(request)
  if (response) return response

  if (!hasApiKey()) {
    return NextResponse.json({ error: new MissingApiKeyError().message }, { status: 503 })
  }

  try {
    const body = await request.json()
    const query: string = body?.query

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return NextResponse.json({ error: 'query is required' }, { status: 400 })
    }

    const k = Number.isInteger(body?.k) ? Math.min(Math.max(body.k, 1), 10) : 4
    const minScore = typeof body?.minScore === 'number' ? body.minScore : 0

    const results = await retrieve(query, k, minScore)

    return NextResponse.json({
      query,
      k,
      minScore,
      indexedChunks: await countChunks(),
      results,
    })
  } catch (error) {
    if (error instanceof MissingApiKeyError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }
    console.error('Search error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    )
  }
}
