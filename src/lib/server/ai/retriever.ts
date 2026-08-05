import { prisma } from '$lib/server/db'
import { getEmbeddings } from './llm'

export interface RetrievedChunk {
  id: number
  source: string
  heading: string
  content: string
  score: number
}

/**
 * Chunks are held in memory after the first request so we only pay the database
 * read once per server process. `npm run ingest` writes new chunks, so restart
 * the dev server (or call resetCache) after re-indexing.
 */
let cache: { id: number; source: string; heading: string; content: string; vector: number[] }[] | null =
  null

export function resetRetrieverCache() {
  cache = null
}

async function loadChunks() {
  if (cache) return cache

  const rows = await prisma.docChunk.findMany()
  cache = rows.map((r) => ({
    id: r.id,
    source: r.source,
    heading: r.heading,
    content: r.content,
    vector: JSON.parse(r.embedding) as number[],
  }))
  return cache
}

/**
 * Cosine similarity between two equal-length vectors.
 * OpenAI embeddings are already L2-normalised, but we divide by the norms anyway
 * so this stays correct if the embedding model is swapped for one that isn't.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

/**
 * Retrieve the k most similar documentation chunks for a query.
 *
 * @param query    natural-language question
 * @param k        how many chunks to return (default 4)
 * @param minScore drop anything below this similarity (default 0 = keep all)
 */
export async function retrieve(
  query: string,
  k = 4,
  minScore = 0
): Promise<RetrievedChunk[]> {
  const chunks = await loadChunks()
  if (chunks.length === 0) return []

  const [queryVector] = await getEmbeddings().embedDocuments([query])

  return chunks
    .map((c) => ({
      id: c.id,
      source: c.source,
      heading: c.heading,
      content: c.content,
      score: cosineSimilarity(queryVector, c.vector),
    }))
    .filter((c) => c.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
}

/** How many chunks are indexed. Used by the health check and to warn if ingest never ran. */
export async function countChunks(): Promise<number> {
  return prisma.docChunk.count()
}
