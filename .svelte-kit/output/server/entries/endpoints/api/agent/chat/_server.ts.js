import { i as getChatModel, n as retrieve, r as MissingApiKeyError, s as hasApiKey } from "../../../../../chunks/retriever.js";
import { t as shipmentRepository } from "../../../../../chunks/repositories.js";
import { t as calculateRate } from "../../../../../chunks/rate-calculator.js";
import { t as service_card_default } from "../../../../../chunks/service-card.js";
import { t as countries_default } from "../../../../../chunks/countries.js";
import { c as validateSenderData, o as validatePackageData, r as validateAdditionalOptions, s as validateReceiverData, t as determineShipmentType } from "../../../../../chunks/shipment-validator.js";
import { t as AGENT_WRITABLE_FIELDS } from "../../../../../chunks/form-bridge.svelte.js";
import { t as requireUser } from "../../../../../chunks/guard.js";
import { json } from "@sveltejs/kit";
import { createAgent } from "langchain";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
//#region src/lib/server/ai/tools.ts
var WRITABLE_FIELDS = new Set(AGENT_WRITABLE_FIELDS);
function buildTools(userId, formContext) {
	const searchShipments = tool(async ({ status, shipmentType, limit }) => {
		const { shipments, total } = await shipmentRepository.findByUserId(userId, {
			status,
			shipmentType,
			limit: limit ?? 10,
			sortBy: "createdAt",
			sortOrder: "desc"
		});
		return JSON.stringify({
			total,
			returned: shipments.length,
			shipments: shipments.map((s) => ({
				id: s.id,
				trackingNumber: s.trackingNumber,
				status: s.status,
				from: `${s.from.city}, ${s.from.country}`,
				to: `${s.to.city}, ${s.to.country}`,
				shipmentType: s.service.shipmentType,
				serviceType: s.service.type,
				weightKg: s.package.weight,
				totalPrice: s.rate.total,
				createdAt: s.createdAt
			}))
		});
	}, {
		name: "search_shipments",
		description: "List the signed-in user's own shipments. Use this for questions like 'how many shipments do I have', 'show my drafts', or 'what did I send to Egypt'. Returns at most `limit` shipments, newest first.",
		schema: z.object({
			status: z.enum([
				"all",
				"draft",
				"finalized"
			]).optional().describe("Filter by status. Omit or use \"all\" for every status."),
			shipmentType: z.enum([
				"all",
				"Domestic",
				"IntraGulf",
				"International"
			]).optional().describe("Filter by shipment type. Omit or use \"all\" for every type."),
			limit: z.number().int().min(1).max(50).optional().describe("Max results (default 10).")
		})
	});
	const getShipment = tool(async ({ trackingNumber, id }) => {
		if (!trackingNumber && id === void 0) return JSON.stringify({ error: "Provide either trackingNumber or id." });
		let shipment = null;
		if (id !== void 0) shipment = await shipmentRepository.findById(id, userId);
		else {
			const { shipments } = await shipmentRepository.findByUserId(userId, { limit: 200 });
			shipment = shipments.find((s) => s.trackingNumber === trackingNumber) ?? null;
		}
		if (!shipment) return JSON.stringify({ error: "No such shipment belongs to you." });
		return JSON.stringify(shipment);
	}, {
		name: "get_shipment",
		description: "Get the full details of one of the signed-in user's shipments by tracking number or id. Returns an error if the shipment does not belong to them.",
		schema: z.object({
			trackingNumber: z.string().optional().describe("Tracking number, e.g. TR123456789"),
			id: z.number().int().optional().describe("Numeric shipment id")
		})
	});
	const quotePrice = tool(async (input) => {
		try {
			const result = calculateRate({
				serviceId: input.serviceId,
				weight: input.weight,
				senderCountry: input.senderCountry,
				receiverCountry: input.receiverCountry,
				pickupMethod: input.pickupMethod,
				signatureRequired: input.signatureRequired ?? false,
				containsLiquid: input.containsLiquid ?? false,
				insurance: input.insurance ?? false,
				packaging: input.packaging ?? false
			});
			return JSON.stringify({
				shipmentType: determineShipmentType(input.senderCountry, input.receiverCountry),
				...result
			});
		} catch (e) {
			return JSON.stringify({ error: e instanceof Error ? e.message : "Rate calculation failed" });
		}
	}, {
		name: "quote_price",
		description: "Calculate the exact price of a shipment using the real pricing engine. Always use this instead of doing the arithmetic yourself — the numbers must match what the app charges. Call list_services first if you do not know the serviceId.",
		schema: z.object({
			serviceId: z.string().describe("Service id, e.g. domestic_standard, domestic_express, gulf_standard, gulf_express, international_economy, international_standard"),
			weight: z.number().positive().describe("Package weight in kg"),
			senderCountry: z.string().describe("Sender country, English name e.g. \"Saudi Arabia\""),
			receiverCountry: z.string().describe("Receiver country, English name e.g. \"Egypt\""),
			pickupMethod: z.enum(["home", "postal_office"]).describe("How the package is collected"),
			signatureRequired: z.boolean().optional(),
			containsLiquid: z.boolean().optional(),
			insurance: z.boolean().optional(),
			packaging: z.boolean().optional()
		})
	});
	const checkRules = tool(async (input) => {
		const shipmentType = determineShipmentType(input.senderCountry, input.receiverCountry);
		const data = {
			senderName: input.senderName ?? "Placeholder Name",
			senderPhone: input.senderPhone ?? "0000000000",
			senderCountry: input.senderCountry,
			senderCity: input.senderCity ?? "Placeholder City",
			senderStreet: input.senderStreet ?? "",
			senderPostalCode: input.senderPostalCode ?? "00000",
			receiverName: input.receiverName ?? "Placeholder Name",
			receiverPhone: input.receiverPhone ?? "0000000000",
			receiverCountry: input.receiverCountry,
			receiverCity: input.receiverCity ?? "Placeholder City",
			receiverStreet: input.receiverStreet ?? "",
			receiverPostalCode: input.receiverPostalCode ?? "00000",
			weight: input.weight,
			length: input.length ?? 10,
			width: input.width ?? 10,
			height: input.height ?? 10,
			itemDescription: input.itemDescription ?? "",
			pickupMethod: input.pickupMethod ?? "home",
			signatureRequired: input.signatureRequired ?? false
		};
		const errors = {
			...validateSenderData(data).errors,
			...validateReceiverData(data, input.senderCountry).errors,
			...validatePackageData(data, shipmentType).errors,
			...validateAdditionalOptions(data).errors
		};
		return JSON.stringify({
			shipmentType,
			allowed: Object.keys(errors).length === 0,
			violations: errors,
			note: "Fields not supplied were filled with valid placeholders, so only the rules relevant to the supplied fields are meaningful."
		});
	}, {
		name: "check_rules",
		description: "Check a proposed shipment against the real business rules (Gulf street requirement, Gulf-to-Iraq block, weight limits per shipment type, mandatory signature for Jordan/Egypt, home-pickup weight limit and the Iraq exception, item description for non-Gulf to Gulf). Use this to answer \"can I ship X to Y\" questions.",
		schema: z.object({
			senderCountry: z.string().describe("Sender country, English name"),
			receiverCountry: z.string().describe("Receiver country, English name"),
			weight: z.number().positive().describe("Package weight in kg"),
			pickupMethod: z.enum(["home", "postal_office"]).optional(),
			signatureRequired: z.boolean().optional(),
			itemDescription: z.string().optional(),
			senderStreet: z.string().optional(),
			receiverStreet: z.string().optional(),
			senderName: z.string().optional(),
			senderPhone: z.string().optional(),
			senderCity: z.string().optional(),
			senderPostalCode: z.string().optional(),
			receiverName: z.string().optional(),
			receiverPhone: z.string().optional(),
			receiverCity: z.string().optional(),
			receiverPostalCode: z.string().optional(),
			length: z.number().optional(),
			width: z.number().optional(),
			height: z.number().optional()
		})
	});
	const listServices = tool(async ({ senderCountry, receiverCountry, weight }) => {
		const shipmentType = determineShipmentType(senderCountry, receiverCountry);
		const all = service_card_default.servicesByShipmentType[shipmentType] ?? [];
		const available = weight ? all.filter((s) => weight <= s.maxWeight) : all;
		return JSON.stringify({
			shipmentType,
			services: available,
			excludedForWeight: weight ? all.filter((s) => weight > s.maxWeight).map((s) => s.id) : []
		});
	}, {
		name: "list_services",
		description: "List the shipping services available for a route, optionally filtered by weight. Use this to find the correct serviceId before calling quote_price.",
		schema: z.object({
			senderCountry: z.string().describe("Sender country, English name"),
			receiverCountry: z.string().describe("Receiver country, English name"),
			weight: z.number().positive().optional().describe("Package weight in kg")
		})
	});
	const searchPolicyDocs = tool(async ({ query, k }) => {
		const chunks = await retrieve(query, k ?? 4);
		if (chunks.length === 0) return JSON.stringify({
			results: [],
			note: "No indexed documentation. Run `npm run ingest`."
		});
		return JSON.stringify({ results: chunks.map((c) => ({
			source: c.source,
			heading: c.heading,
			score: Number(c.score.toFixed(4)),
			content: c.content
		})) });
	}, {
		name: "search_policy_docs",
		description: "Search the shipping policy documentation (business rules, user stories, rate configuration) for background, definitions and explanations. Use this for \"why\" and \"what is the policy\" questions. For a specific yes/no on a concrete shipment, prefer check_rules.",
		schema: z.object({
			query: z.string().describe("What to look up"),
			k: z.number().int().min(1).max(10).optional().describe("How many passages (default 4)")
		})
	});
	const listCountries = tool(async () => JSON.stringify({ countries: countries_default.countries.map((c) => ({
		name: c.name,
		isGulf: c.isGulf
	})) }), {
		name: "list_countries",
		description: "List the countries this app ships to and whether each is a Gulf country. Use this when the user names a country you need to classify.",
		schema: z.object({})
	});
	const createDraft = tool(async (input) => {
		if (!input.confirm) return JSON.stringify({
			created: false,
			error: "Not created. Show the user the full details and the quoted price, then call again with confirm: true once they agree."
		});
		const shipmentType = determineShipmentType(input.senderCountry, input.receiverCountry);
		const formData = {
			senderName: input.senderName,
			senderPhone: input.senderPhone,
			senderCountry: input.senderCountry,
			senderCity: input.senderCity,
			senderStreet: input.senderStreet ?? "",
			senderPostalCode: input.senderPostalCode,
			receiverName: input.receiverName,
			receiverPhone: input.receiverPhone,
			receiverCountry: input.receiverCountry,
			receiverCity: input.receiverCity,
			receiverStreet: input.receiverStreet ?? "",
			receiverPostalCode: input.receiverPostalCode,
			weight: input.weight,
			length: input.length,
			width: input.width,
			height: input.height,
			itemDescription: input.itemDescription ?? "",
			shipmentType,
			serviceType: input.serviceId,
			pickupMethod: input.pickupMethod,
			signatureRequired: input.signatureRequired ?? false,
			containsLiquid: input.containsLiquid ?? false,
			insurance: input.insurance ?? false,
			packaging: input.packaging ?? false
		};
		const errors = {
			...validateSenderData(formData).errors,
			...validateReceiverData(formData, formData.senderCountry).errors,
			...validatePackageData(formData, shipmentType).errors,
			...validateAdditionalOptions(formData).errors
		};
		if (Object.keys(errors).length > 0) return JSON.stringify({
			created: false,
			violations: errors
		});
		let rate;
		try {
			rate = calculateRate({
				serviceId: input.serviceId,
				weight: input.weight,
				senderCountry: input.senderCountry,
				receiverCountry: input.receiverCountry,
				pickupMethod: input.pickupMethod,
				signatureRequired: formData.signatureRequired,
				containsLiquid: formData.containsLiquid,
				insurance: formData.insurance,
				packaging: formData.packaging
			});
		} catch (e) {
			return JSON.stringify({
				created: false,
				error: e instanceof Error ? e.message : "Rate calculation failed"
			});
		}
		const shipment = await shipmentRepository.create(userId, formData, {
			base: rate.breakdown.baseCost,
			total: rate.totalPrice,
			signature: rate.breakdown.signatureCost,
			insurance: rate.breakdown.insuranceCost,
			packaging: rate.breakdown.packagingCost
		});
		return JSON.stringify({
			created: true,
			id: shipment.id,
			trackingNumber: shipment.trackingNumber,
			status: shipment.status,
			totalPrice: shipment.rate.total
		});
	}, {
		name: "create_draft_shipment",
		description: "Create a DRAFT shipment on the signed-in user's account. Two-step: call once with confirm false (or omitted) to validate and price it, show the user what will be created, then call again with confirm true. Never pass confirm true before the user has agreed to the details.",
		schema: z.object({
			confirm: z.boolean().optional().describe("Must be true to actually write. Omit on the first call."),
			senderName: z.string(),
			senderPhone: z.string(),
			senderCountry: z.string(),
			senderCity: z.string(),
			senderStreet: z.string().optional(),
			senderPostalCode: z.string(),
			receiverName: z.string(),
			receiverPhone: z.string(),
			receiverCountry: z.string(),
			receiverCity: z.string(),
			receiverStreet: z.string().optional(),
			receiverPostalCode: z.string(),
			weight: z.number().positive(),
			length: z.number().positive(),
			width: z.number().positive(),
			height: z.number().positive(),
			itemDescription: z.string().optional(),
			serviceId: z.string().describe("Service id from list_services"),
			pickupMethod: z.enum(["home", "postal_office"]),
			signatureRequired: z.boolean().optional(),
			containsLiquid: z.boolean().optional(),
			insurance: z.boolean().optional(),
			packaging: z.boolean().optional()
		})
	});
	return [
		...!formContext ? [] : [tool(async () => JSON.stringify({
			values: formContext.values,
			completedCards: formContext.completed,
			validationErrors: formContext.errors,
			shipmentType: formContext.shipmentType,
			emptyFields: Object.entries(formContext.values).filter(([, v]) => v === "" || v === null || v === void 0).map(([k]) => k)
		}), {
			name: "read_form",
			description: "Read what the customer has currently typed into the shipment form on screen, including which cards are complete, which fields are still empty, and any validation errors. Use this before answering questions about 'my shipment', 'this form', or what is missing.",
			schema: z.object({})
		}), tool(async (input) => {
			const proposed = {};
			for (const [key, value] of Object.entries(input)) if (value !== void 0 && WRITABLE_FIELDS.has(key)) proposed[key] = value;
			if (Object.keys(proposed).length === 0) return JSON.stringify({
				proposed: false,
				error: `No writable fields supplied. Allowed: ${[...WRITABLE_FIELDS].join(", ")}.`
			});
			const merged = {
				...formContext.values,
				...proposed
			};
			const shipmentType = determineShipmentType(merged.senderCountry, merged.receiverCountry);
			const violations = {
				...validateReceiverData(merged, merged.senderCountry).errors,
				...validateAdditionalOptions({
					...merged,
					weight: parseFloat(merged.weight) || 0
				}).errors
			};
			return JSON.stringify({
				proposed: true,
				values: proposed,
				shipmentType,
				violations,
				note: "Nothing has been written yet. The customer sees an \"Apply to form\" button and decides."
			});
		}, {
			name: "propose_form_values",
			description: "Offer to fill part of the shipment form for the customer. This does NOT write anything — it shows them the values with an Apply button, and they choose. Supply only the fields you are confident about. Sender fields cannot be proposed; they come from the account. After calling this, tell the customer what you are proposing and that they can apply it.",
			schema: z.object({
				receiverName: z.string().optional(),
				receiverPhone: z.string().optional(),
				receiverCountry: z.string().optional(),
				receiverCity: z.string().optional(),
				receiverStreet: z.string().optional(),
				receiverPostalCode: z.string().optional(),
				weight: z.string().optional().describe("Weight in kg, as a string"),
				length: z.string().optional().describe("Length in cm, as a string"),
				width: z.string().optional().describe("Width in cm, as a string"),
				height: z.string().optional().describe("Height in cm, as a string"),
				itemDescription: z.string().optional(),
				pickupMethod: z.enum(["home", "postal_office"]).optional(),
				signatureRequired: z.boolean().optional(),
				containsLiquid: z.boolean().optional(),
				insurance: z.boolean().optional(),
				packaging: z.boolean().optional()
			})
		})],
		searchShipments,
		getShipment,
		quotePrice,
		checkRules,
		listServices,
		searchPolicyDocs,
		listCountries,
		createDraft
	];
}
//#endregion
//#region src/lib/server/ai/agent.ts
var SYSTEM_PROMPT = `You are the shipping assistant for ShipTest, a shipping management app.

You help the signed-in user with their own shipments and with the company's shipping rules.

Rules you must follow:
- Never do pricing arithmetic yourself. Call quote_price — its numbers are what the app actually charges.
- Never guess whether a shipment is allowed. Call check_rules.
- For policy background and explanations, call search_policy_docs and mention which document you used.
- You can only see the signed-in user's own shipments. If a shipment is not theirs, say so plainly; do not speculate about it.
- If a tool returns an error or empty result, say what happened. Do not invent shipments, prices or tracking numbers.
- Money is in USD. Weight is in kilograms, dimensions in centimetres.
- Be concise. Prefer a direct answer plus the key numbers over a long explanation.

When the customer is on the shipment form you also have read_form and
propose_form_values:
- Call read_form before answering anything about "my shipment", "this form" or
  what is still missing. Do not guess what they have typed.
- If they ask you to fill something in, or you can obviously complete it for
  them, offer: call propose_form_values and tell them they can apply it. You
  never write to the form yourself — they press Apply.
- You cannot propose sender fields; those come from their account.

Formatting: your answer is displayed in a narrow chat panel about 400px wide.
- Do not use Markdown tables. Use short bullet points instead, one item per line.
- Keep each line short. Put a label in bold and the value after it, e.g. "**Total:** $82.00".
- Two or three bullets beat a table for comparing options.`;
/**
* Run one turn of the agent for a specific user.
*
* `history` is the prior conversation. The tools are rebuilt per call because
* they close over the userId — see lib/ai/tools.ts.
*/
async function runAgent(userId, message, history = [], options) {
	const startedAt = Date.now();
	const llm = getChatModel();
	const agent = createAgent({
		model: llm,
		tools: buildTools(userId, options?.formContext),
		systemPrompt: SYSTEM_PROMPT
	});
	const messages = [...history.map((turn) => turn.role === "user" ? new HumanMessage(turn.content) : new AIMessage(turn.content)), new HumanMessage(message)];
	const produced = (await agent.invoke({ messages }, { recursionLimit: options?.maxSteps ?? 12 })).messages ?? [];
	const toolResultsById = /* @__PURE__ */ new Map();
	for (const m of produced) if (m?.tool_call_id) toolResultsById.set(m.tool_call_id, typeof m.content === "string" ? m.content : JSON.stringify(m.content));
	const toolCalls = [];
	for (const m of produced) for (const call of m?.tool_calls ?? []) toolCalls.push({
		name: call.name,
		args: call.args ?? {},
		result: call.id ? toolResultsById.get(call.id) : void 0
	});
	let proposal = null;
	for (const call of toolCalls) {
		if (call.name !== "propose_form_values" || !call.result) continue;
		try {
			const parsed = JSON.parse(call.result);
			if (parsed.proposed) proposal = {
				values: parsed.values,
				violations: parsed.violations ?? {}
			};
		} catch {}
	}
	const last = produced[produced.length - 1];
	return {
		reply: typeof last?.content === "string" ? last.content : Array.isArray(last?.content) ? last.content.map((p) => p?.text ?? "").join("") : "",
		toolCalls,
		proposal,
		model: llm.model,
		latencyMs: Date.now() - startedAt
	};
}
//#endregion
//#region src/routes/api/agent/chat/+server.ts
/**
* POST /api/agent/chat
* Ask the shipment agent something. Requires authentication.
*
* Request body:
* - message: (required) the user's message
* - history: (optional) prior turns [{ role: 'user' | 'assistant', content }]
*
* Response:
* - reply, toolCalls, model, latencyMs
*/
var POST = async (event) => {
	const user = requireUser(event);
	if (!hasApiKey()) return json({ error: new MissingApiKeyError().message }, { status: 503 });
	try {
		const body = await event.request.json();
		const message = body?.message;
		if (!message || typeof message !== "string" || message.trim() === "") return json({ error: "message is required" }, { status: 400 });
		if (message.length > 4e3) return json({ error: "message is too long (max 4000 characters)" }, { status: 400 });
		const history = Array.isArray(body?.history) ? body.history.filter((t) => t && (t.role === "user" || t.role === "assistant") && typeof t.content === "string").slice(-10) : [];
		const formContext = body?.formContext ?? null;
		return json(await runAgent(user.id, message, history, { formContext }));
	} catch (err) {
		if (err instanceof MissingApiKeyError) return json({ error: err.message }, { status: 503 });
		console.error("Agent error:", err);
		return json({ error: err instanceof Error ? err.message : "The agent failed to answer" }, { status: 500 });
	}
};
//#endregion
export { POST };
