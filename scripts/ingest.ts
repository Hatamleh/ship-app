/**
 * Indexes the project documentation so the assistant can answer questions about
 * shipping rules with citations.
 *
 * Run with: npm run ingest
 *
 * Sources:
 *   - logic.md                the complete business-rules document
 *   - stories/*.md            the user stories (README excluded, it is just an index)
 *   - src/lib/rules/*.json    the machine-readable rules, rendered to text
 *
 * README.md is deliberately NOT indexed: it still documents endpoints and prices
 * that no longer exist, and would produce confidently wrong answers.
 */
import { PrismaClient } from '@prisma/client'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import fs from 'fs'
import path from 'path'
import { getEmbeddings, hasApiKey } from '../src/lib/server/ai/llm'

const prisma = new PrismaClient()

const ROOT = path.resolve(__dirname, '..')
const CHUNK_SIZE = 900
const CHUNK_OVERLAP = 120
const EMBED_BATCH = 64

interface RawChunk {
  source: string
  heading: string
  content: string
}

/** Track the most recent markdown heading so each chunk can cite a section. */
function headingFor(text: string, fallback: string): string {
  const matches = text.match(/^#{1,4}\s+(.+)$/m)
  return matches ? matches[1].trim() : fallback
}

async function chunkMarkdown(filePath: string, source: string): Promise<RawChunk[]> {
  const raw = fs.readFileSync(filePath, 'utf8')

  // Split on markdown section boundaries first so a chunk rarely spans two rules.
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
    separators: ['\n## ', '\n### ', '\n#### ', '\n\n', '\n', ' '],
  })

  const parts = await splitter.splitText(raw)

  // Carry the last seen heading forward: a chunk that starts mid-section has no
  // heading of its own but still belongs to the previous one.
  let lastHeading = source
  return parts
    .map((content) => {
      lastHeading = headingFor(content, lastHeading)
      return { source, heading: lastHeading, content: content.trim() }
    })
    .filter((c) => c.content.length > 40)
}

/** Render the rules JSON as prose so it embeds meaningfully instead of as syntax. */
function chunkRulesJson(filePath: string, source: string): RawChunk[] {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const chunks: RawChunk[] = []

  const describe = (obj: any, trail: string[] = []): string[] => {
    const lines: string[] = []
    for (const [key, value] of Object.entries(obj)) {
      const label = [...trail, key].join(' → ')
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        lines.push(...describe(value, [...trail, key]))
      } else {
        lines.push(`${label}: ${JSON.stringify(value)}`)
      }
    }
    return lines
  }

  const lines = describe(data)
  for (let i = 0; i < lines.length; i += 25) {
    chunks.push({
      source,
      heading: path.basename(source),
      content: `Configuration from ${source}\n\n${lines.slice(i, i + 25).join('\n')}`,
    })
  }
  return chunks
}

async function main() {
  if (!hasApiKey()) {
    console.error(
      '\nOPENROUTER_API_KEY is not set.\n' +
        'Add your own key to .env — get one at https://openrouter.ai/keys\n'
    )
    process.exit(1)
  }

  console.log('Collecting documents...')
  const chunks: RawChunk[] = []

  // logic.md — the authoritative business-rules document
  chunks.push(...(await chunkMarkdown(path.join(ROOT, 'logic.md'), 'logic.md')))

  // stories/*.md — the user stories
  const storiesDir = path.join(ROOT, 'stories')
  const storyFiles = fs
    .readdirSync(storiesDir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .sort()

  for (const file of storyFiles) {
    chunks.push(...(await chunkMarkdown(path.join(storiesDir, file), `stories/${file}`)))
  }

  // lib/rules/*.json — the machine-readable rules
  const rulesDir = path.join(ROOT, 'src', 'lib', 'rules')
  for (const file of fs.readdirSync(rulesDir).filter((f) => f.endsWith('.json')).sort()) {
    chunks.push(...chunkRulesJson(path.join(rulesDir, file), `src/lib/rules/${file}`))
  }

  console.log(`Collected ${chunks.length} chunks from ${storyFiles.length + 1} documents.`)

  console.log('Embedding (this calls OpenRouter and costs a fraction of a cent)...')
  const embeddings = getEmbeddings()
  const vectors: number[][] = []

  for (let i = 0; i < chunks.length; i += EMBED_BATCH) {
    const batch = chunks.slice(i, i + EMBED_BATCH)
    const embedded = await embeddings.embedDocuments(batch.map((c) => c.content))
    vectors.push(...embedded)
    console.log(`  embedded ${Math.min(i + EMBED_BATCH, chunks.length)}/${chunks.length}`)
  }

  console.log('Writing to database...')
  await prisma.docChunk.deleteMany()
  await prisma.docChunk.createMany({
    data: chunks.map((c, i) => ({
      source: c.source,
      heading: c.heading,
      content: c.content,
      embedding: JSON.stringify(vectors[i]),
    })),
  })

  const total = await prisma.docChunk.count()
  console.log(`\nIndexed ${total} chunks (${vectors[0]?.length ?? 0} dimensions).`)
  console.log('Restart the dev server so the retriever picks up the new index.')
}

main()
  .catch((e) => {
    console.error('Ingest failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
