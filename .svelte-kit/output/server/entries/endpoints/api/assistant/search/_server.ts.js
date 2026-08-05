import { n as retrieve, r as MissingApiKeyError, s as hasApiKey, t as countChunks } from "../../../../../chunks/retriever.js";
import { t as requireUser } from "../../../../../chunks/guard.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/assistant/search/+server.ts
/**
* POST /api/assistant/search
* Retrieval only — no chat model is called, so the result depends solely on the
* query embedding and the indexed chunks. This is the endpoint to assert against
* when testing retrieval quality on its own.
*
* Request body:
* - query: (required)
* - k: (optional) 1-10, default 4
* - minScore: (optional) drop chunks below this cosine similarity
*/
var POST = async (event) => {
	requireUser(event);
	if (!hasApiKey()) return json({ error: new MissingApiKeyError().message }, { status: 503 });
	try {
		const body = await event.request.json();
		const query = body?.query;
		if (!query || typeof query !== "string" || query.trim() === "") return json({ error: "query is required" }, { status: 400 });
		const k = Number.isInteger(body?.k) ? Math.min(Math.max(body.k, 1), 10) : 4;
		const minScore = typeof body?.minScore === "number" ? body.minScore : 0;
		return json({
			query,
			k,
			minScore,
			indexedChunks: await countChunks(),
			results: await retrieve(query, k, minScore)
		});
	} catch (err) {
		if (err instanceof MissingApiKeyError) return json({ error: err.message }, { status: 503 });
		console.error("Search error:", err);
		return json({ error: err instanceof Error ? err.message : "Search failed" }, { status: 500 });
	}
};
//#endregion
export { POST };
