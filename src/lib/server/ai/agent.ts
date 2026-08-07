import { createAgent } from 'langchain'
import { HumanMessage, AIMessage } from '@langchain/core/messages'
import { getChatModel } from './llm'
import { buildTools, type FormContext } from './tools'

const SYSTEM_PROMPT = `You are the shipping assistant for ShipTest, a shipping management app.

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
- Two or three bullets beat a table for comparing options.`

export interface AgentToolCall {
  name: string
  args: Record<string, unknown>
  result?: string
}

export interface AgentResult {
  reply: string
  toolCalls: AgentToolCall[]
  /** Values the agent offered to fill in, awaiting the user's Apply. */
  proposal: { values: Record<string, any>; violations: Record<string, string> } | null
  model: string
  latencyMs: number
}

export interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Run one turn of the agent for a specific user.
 *
 * `history` is the prior conversation. The tools are rebuilt per call because
 * they close over the userId — see lib/ai/tools.ts.
 */
export async function runAgent(
  userId: number,
  message: string,
  history: ChatTurn[] = [],
  options?: { maxSteps?: number; formContext?: FormContext | null }
): Promise<AgentResult> {
  const startedAt = Date.now()
  const llm = getChatModel()

  const agent = createAgent({
    model: llm,
    tools: buildTools(userId, options?.formContext),
    systemPrompt: SYSTEM_PROMPT,
  })

  const messages = [
    ...history.map((turn) =>
      turn.role === 'user' ? new HumanMessage(turn.content) : new AIMessage(turn.content)
    ),
    new HumanMessage(message),
  ]

  const result = await agent.invoke(
    { messages },
    // Bound the ReAct loop so a confused model cannot spin forever.
    { recursionLimit: options?.maxSteps ?? 12 }
  )

  const produced = (result.messages ?? []) as any[]

  // Collect the tool calls the agent made, and pair each with its result, so
  // tests can assert on which tools ran rather than only on the prose.
  const toolResultsById = new Map<string, string>()
  for (const m of produced) {
    if (m?.tool_call_id) {
      toolResultsById.set(
        m.tool_call_id,
        typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
      )
    }
  }

  const toolCalls: AgentToolCall[] = []
  for (const m of produced) {
    for (const call of m?.tool_calls ?? []) {
      toolCalls.push({
        name: call.name,
        args: call.args ?? {},
        result: call.id ? toolResultsById.get(call.id) : undefined,
      })
    }
  }

  // Pull out the most recent form proposal, if the agent made one.
  let proposal: AgentResult['proposal'] = null
  for (const call of toolCalls) {
    if (call.name !== 'propose_form_values' || !call.result) continue
    try {
      const parsed = JSON.parse(call.result)
      if (parsed.proposed) {
        proposal = { values: parsed.values, violations: parsed.violations ?? {} }
      }
    } catch {
      // A malformed tool result simply means no proposal to offer.
    }
  }

  const last = produced[produced.length - 1]
  const reply =
    typeof last?.content === 'string'
      ? last.content
      : Array.isArray(last?.content)
        ? last.content.map((p: any) => p?.text ?? '').join('')
        : ''

  // Some models occasionally end their turn with no text at all after running a
  // tool. The tool results are still valid, so say so rather than rendering an
  // empty bubble. If this fires often, the model is the problem — see
  // OPENROUTER_MODEL in .env.
  const safeReply =
    reply.trim() ||
    (toolCalls.length > 0
      ? `I looked that up (${toolCalls.map((c) => c.name).join(', ')}) but could not phrase an answer. Please ask again.`
      : 'I could not produce an answer. Please try rephrasing.')

  return {
    reply: safeReply,
    toolCalls,
    proposal,
    model: llm.model,
    latencyMs: Date.now() - startedAt,
  }
}
