import { t as prisma } from "./db.js";
import { ChatOpenAICompletions, OpenAIEmbeddings } from "@langchain/openai";
//#region src/lib/server/ai/llm.ts
/**
* OpenRouter is OpenAI-compatible, so we point the OpenAI adapters at its base URL.
*
* Every student supplies their own key — get one at https://openrouter.ai/keys and
* put it in .env as OPENROUTER_API_KEY.
*/
var OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
var MissingApiKeyError = class extends Error {
	constructor() {
		super("OPENROUTER_API_KEY is not set. Add your own key to .env — get one at https://openrouter.ai/keys");
		this.name = "MissingApiKeyError";
	}
};
function getApiKey() {
	const key = process.env.OPENROUTER_API_KEY;
	if (!key || key.trim() === "") throw new MissingApiKeyError();
	return key;
}
function hasApiKey() {
	return !!process.env.OPENROUTER_API_KEY?.trim();
}
function getModelName() {
	return process.env.OPENROUTER_MODEL || "google/gemini-3.5-flash-lite";
}
function getEmbeddingModelName() {
	return process.env.OPENROUTER_EMBEDDING_MODEL || "openai/text-embedding-3-small";
}
/**
* Chat model used by both the agent and the assistant.
*
* We use ChatOpenAICompletions rather than ChatOpenAI because OpenRouter only
* implements the /chat/completions endpoint, not OpenAI's newer Responses API.
*
* temperature is 0 so that the same question produces the same answer as often
* as the model allows — this app exists to be tested.
*/
function getChatModel(overrides) {
	return new ChatOpenAICompletions({
		model: overrides?.model || getModelName(),
		apiKey: getApiKey(),
		temperature: overrides?.temperature ?? 0,
		configuration: {
			baseURL: OPENROUTER_BASE_URL,
			defaultHeaders: {
				"HTTP-Referer": "https://qacart.com",
				"X-Title": "ShipTest"
			}
		}
	});
}
/**
* Embedding model used to index the docs for retrieval.
*/
function getEmbeddings() {
	return new OpenAIEmbeddings({
		model: getEmbeddingModelName(),
		apiKey: getApiKey(),
		configuration: { baseURL: OPENROUTER_BASE_URL }
	});
}
//#endregion
//#region src/lib/server/ai/retriever.ts
/**
* Chunks are held in memory after the first request so we only pay the database
* read once per server process. `npm run ingest` writes new chunks, so restart
* the dev server (or call resetCache) after re-indexing.
*/
var cache = null;
async function loadChunks() {
	if (cache) return cache;
	cache = (await prisma.docChunk.findMany()).map((r) => ({
		id: r.id,
		source: r.source,
		heading: r.heading,
		content: r.content,
		vector: JSON.parse(r.embedding)
	}));
	return cache;
}
/**
* Cosine similarity between two equal-length vectors.
* OpenAI embeddings are already L2-normalised, but we divide by the norms anyway
* so this stays correct if the embedding model is swapped for one that isn't.
*/
function cosineSimilarity(a, b) {
	let dot = 0;
	let normA = 0;
	let normB = 0;
	for (let i = 0; i < a.length; i++) {
		dot += a[i] * b[i];
		normA += a[i] * a[i];
		normB += b[i] * b[i];
	}
	const denom = Math.sqrt(normA) * Math.sqrt(normB);
	return denom === 0 ? 0 : dot / denom;
}
/**
* Retrieve the k most similar documentation chunks for a query.
*
* @param query    natural-language question
* @param k        how many chunks to return (default 4)
* @param minScore drop anything below this similarity (default 0 = keep all)
*/
async function retrieve(query, k = 4, minScore = 0) {
	const chunks = await loadChunks();
	if (chunks.length === 0) return [];
	const [queryVector] = await getEmbeddings().embedDocuments([query]);
	return chunks.map((c) => ({
		id: c.id,
		source: c.source,
		heading: c.heading,
		content: c.content,
		score: cosineSimilarity(queryVector, c.vector)
	})).filter((c) => c.score >= minScore).sort((a, b) => b.score - a.score).slice(0, k);
}
/** How many chunks are indexed. Used by the health check and to warn if ingest never ran. */
async function countChunks() {
	return prisma.docChunk.count();
}
//#endregion
export { getEmbeddingModelName as a, getChatModel as i, retrieve as n, getModelName as o, MissingApiKeyError as r, hasApiKey as s, countChunks as t };
