import { i as getChatModel, n as retrieve, r as MissingApiKeyError, s as hasApiKey } from "../../../../../chunks/retriever.js";
import { t as requireUser } from "../../../../../chunks/guard.js";
import { json } from "@sveltejs/kit";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
//#region src/lib/server/ai/rag.ts
var SYSTEM_PROMPT = `You answer questions about ShipTest's shipping rules using only the passages provided.

- Answer from the passages. If they do not contain the answer, say "I don't know based on the documentation" and stop. Do not fall back on general knowledge about shipping.
- Cite the passages you used by their [n] number, inline.
- Be concise and concrete. Quote the actual limits, fees and country names.`;
function buildContext(chunks) {
	return chunks.map((c, i) => `[${i + 1}] (${c.source} — ${c.heading})\n${c.content}`).join("\n\n---\n\n");
}
/**
* Retrieval-augmented answer over the indexed documentation.
*
* @param question the user's question
* @param k        how many passages to retrieve (default 4)
*/
async function ask(question, k = 4) {
	const startedAt = Date.now();
	const chunks = await retrieve(question, k);
	if (chunks.length === 0) return {
		answer: "There is no indexed documentation to answer from. Run `npm run ingest` to build the index.",
		sources: [],
		model: "",
		latencyMs: Date.now() - startedAt
	};
	const llm = getChatModel();
	const response = await llm.invoke([new SystemMessage(SYSTEM_PROMPT), new HumanMessage(`Passages:\n\n${buildContext(chunks)}\n\n---\n\nQuestion: ${question}`)]);
	return {
		answer: typeof response.content === "string" ? response.content : Array.isArray(response.content) ? response.content.map((p) => p?.text ?? "").join("") : "",
		sources: chunks.map((c, i) => ({
			n: i + 1,
			source: c.source,
			heading: c.heading,
			score: Number(c.score.toFixed(4))
		})),
		model: llm.model,
		latencyMs: Date.now() - startedAt
	};
}
//#endregion
//#region src/routes/api/assistant/ask/+server.ts
/**
* POST /api/assistant/ask
* Answer a question about the shipping rules from the indexed documentation.
*
* Request body:
* - question: (required)
* - k: (optional) how many passages to retrieve, 1-10 (default 4)
*/
var POST = async (event) => {
	requireUser(event);
	if (!hasApiKey()) return json({ error: new MissingApiKeyError().message }, { status: 503 });
	try {
		const body = await event.request.json();
		const question = body?.question;
		if (!question || typeof question !== "string" || question.trim() === "") return json({ error: "question is required" }, { status: 400 });
		const k = Number.isInteger(body?.k) ? Math.min(Math.max(body.k, 1), 10) : 4;
		return json(await ask(question, k));
	} catch (err) {
		if (err instanceof MissingApiKeyError) return json({ error: err.message }, { status: 503 });
		console.error("Assistant error:", err);
		return json({ error: err instanceof Error ? err.message : "Failed to answer" }, { status: 500 });
	}
};
//#endregion
export { POST };
