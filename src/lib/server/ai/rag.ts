import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { getChatModel } from './llm'
import { retrieve, type RetrievedChunk } from './retriever'

const SYSTEM_PROMPT = `You answer questions about ShipTest's shipping rules using only the passages provided.

- Answer from the passages. If they do not contain the answer, say "I don't know based on the documentation" and stop. Do not fall back on general knowledge about shipping.
- Cite the passages you used by their [n] number, inline.
- Be concise and concrete. Quote the actual limits, fees and country names.`

export interface AskResult {
  answer: string
  sources: { n: number; source: string; heading: string; score: number }[]
  model: string
  latencyMs: number
}

function buildContext(chunks: RetrievedChunk[]): string {
  return chunks
    .map((c, i) => `[${i + 1}] (${c.source} — ${c.heading})\n${c.content}`)
    .join('\n\n---\n\n')
}

/**
 * Retrieval-augmented answer over the indexed documentation.
 *
 * @param question the user's question
 * @param k        how many passages to retrieve (default 4)
 */
export async function ask(question: string, k = 4): Promise<AskResult> {
  const startedAt = Date.now()
  const chunks = await retrieve(question, k)

  if (chunks.length === 0) {
    return {
      answer:
        "There is no indexed documentation to answer from. Run `npm run ingest` to build the index.",
      sources: [],
      model: '',
      latencyMs: Date.now() - startedAt,
    }
  }

  const llm = getChatModel()
  const response = await llm.invoke([
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(
      `Passages:\n\n${buildContext(chunks)}\n\n---\n\nQuestion: ${question}`
    ),
  ])

  const answer =
    typeof response.content === 'string'
      ? response.content
      : Array.isArray(response.content)
        ? response.content.map((p: any) => p?.text ?? '').join('')
        : ''

  return {
    answer,
    sources: chunks.map((c, i) => ({
      n: i + 1,
      source: c.source,
      heading: c.heading,
      score: Number(c.score.toFixed(4)),
    })),
    model: llm.model,
    latencyMs: Date.now() - startedAt,
  }
}
