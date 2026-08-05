import { a as getEmbeddingModelName, o as getModelName, s as hasApiKey, t as countChunks } from "../../../../../chunks/retriever.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/agent/health/+server.ts
/**
* GET /api/agent/health
* Smoke check for the AI features. Never calls OpenRouter, so it is free.
* Public on purpose: it reports configuration state, never data.
*/
var GET = async () => {
	const indexedChunks = await countChunks().catch(() => 0);
	const apiKeyConfigured = hasApiKey();
	return json({
		ok: apiKeyConfigured && indexedChunks > 0,
		apiKeyConfigured,
		model: getModelName(),
		embeddingModel: getEmbeddingModelName(),
		indexedChunks,
		hints: [...apiKeyConfigured ? [] : ["Set OPENROUTER_API_KEY in .env — get a key at https://openrouter.ai/keys"], ...indexedChunks > 0 ? [] : ["Run `npm run ingest` to build the documentation index"]]
	});
};
//#endregion
export { GET };
