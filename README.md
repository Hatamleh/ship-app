# ShipTest — Shipping Management App for Testing Education

A Next.js application built to teach software testing: manual testing, UI automation,
API testing, and now AI/agent testing. It simulates a shipping company operating across
the Gulf, the Middle East and international destinations, with genuinely complex business
rules that are worth writing test cases against.

## Features

- 📦 **Progressive shipment form** — cards unlock in sequence (sender → receiver → package → service → options → rate)
- ⚖️ **Rules served as data** — validation rules come from `/api/rules/*`, driven by `lib/rules/*.json`
- 📋 **Shipment dashboard** — filter by status and type, edit, repeat, finalize, delete
- 🤖 **AI agent** — LangChain agent with tools over your own shipments and the pricing engine
- 📚 **RAG assistant** — answers questions about shipping rules from the project docs, with citations
- 🧪 **Built for automation** — `data-testid` on every interactive element
- 💾 **SQLite + Prisma** — file-based, no database server

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite via Prisma
- **Auth**: bcrypt + JWT in an httpOnly cookie
- **AI**: LangChain v1 + OpenRouter (chat and embeddings)

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create your `.env`**:
   ```bash
   cp .env.example .env
   ```

3. **Set up the database**:
   ```bash
   npm run setup
   ```
   Generates the Prisma client, creates `prisma/dev.db`, and seeds 5 users and 6 shipments.

4. **Start the dev server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Enabling the AI features (optional)

The agent and the RAG assistant run through [OpenRouter](https://openrouter.ai), and
**each student uses their own key** — nothing is shared.

1. Get a key at [openrouter.ai/keys](https://openrouter.ai/keys)
2. Set `OPENROUTER_API_KEY` in `.env`
3. Build the documentation index (one-off, costs a fraction of a cent):
   ```bash
   npm run ingest
   ```
4. Restart the dev server

Check it worked:
```bash
curl http://localhost:3000/api/agent/health
# { "ok": true, "apiKeyConfigured": true, "indexedChunks": 235, ... }
```

`OPENROUTER_MODEL` in `.env` selects the model — any tool-capable model on OpenRouter
works. The default is a cheap one so a whole class can hammer it.

Without a key the rest of the app works normally; the AI endpoints return `503` with a
message telling you what to set.

## Available Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Seed the database, then start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run setup` | Generate Prisma client, push schema, seed |
| `npm run seed` | Reseed only |
| `npm run ingest` | Index the docs for the AI assistant (needs an OpenRouter key) |
| `npm run reset` | Delete the database and re-run setup |

## Test Users

All five share the password **`Test@1234`**. The signed-in user's details pre-fill the
sender card, so which one you log in as changes which business rules fire.

| Email | Name | Country | Gulf? |
|---|---|---|---|
| `ksa@qacart.com` | Khalid Al-Otaibi | Saudi Arabia | yes |
| `uae@qacart.com` | Mohammed Al-Mansouri | United Arab Emirates | yes |
| `kwt@qacart.com` | Fahad Al-Ajmi | Kuwait | yes |
| `jor@qacart.com` | Ahmad Khalil | Jordan | no |
| `egy@qacart.com` | Omar Hassan | Egypt | no |

The seed creates 6 shipments: 5 `finalized` and 1 `draft`, spread across Domestic,
IntraGulf and International.

## Application Structure

```
ship-app/
├── app/
│   ├── page.tsx              # Create shipment (also ?edit=<id> and ?repeat=<id>)
│   ├── login/, register/
│   ├── shipments/            # Dashboard
│   │   └── [id]/             # Shipment details
│   ├── assistant/            # RAG documentation Q&A
│   └── api/
│       ├── auth/             # login, logout, me, register
│       ├── rules/            # per-card rules (sender, receiver, package, service, options)
│       ├── rates/            # price calculation
│       ├── shipments/        # list, draft, finalize, [id]
│       ├── agent/            # chat, health
│       └── assistant/        # ask (RAG), search (retrieval only)
├── components/
│   ├── ShipmentForm.tsx      # Orchestrates the cards
│   ├── DynamicCard.tsx       # Renders fields from a rules payload
│   ├── cards/                # Sender, Receiver, Package, Service, Options, Rate
│   ├── shipments/            # Table, filters, modals, kebab menu
│   └── agent/ChatDrawer.tsx  # Floating AI assistant
├── lib/
│   ├── rules/*.json          # Business rules as data
│   ├── validators/           # Server-side rule enforcement
│   ├── services/             # rate-calculator.ts
│   ├── ai/                   # llm, embeddings, retriever, tools, agent, rag
│   └── translations.ts       # UI strings
├── repositories/             # Prisma data access
├── scripts/ingest.ts         # Builds the RAG index
├── prisma/                   # schema.prisma, seed.ts
├── logic.md                  # Full business-rules reference
└── stories/                  # 120+ user stories
```

## Business Rules Reference

`logic.md` and `stories/` are the authoritative source. Summary:

### Shipment types (detected from the two countries)

| Type | Condition | Max weight |
|---|---|---|
| Domestic | Same country | 50 kg |
| IntraGulf | Both countries are Gulf | 30 kg |
| International | Anything else | 25 kg |

**Gulf countries**: Saudi Arabia, United Arab Emirates, Kuwait, Bahrain, Qatar, Oman.
**Non-Gulf**: Egypt, Jordan, Lebanon, Iraq.

### Services and pricing

| Shipment type | Service id | Base | Per kg | Max weight | Days |
|---|---|---|---|---|---|
| Domestic | `domestic_standard` | $15 | $0.50 | 50 kg | 3 |
| Domestic | `domestic_express` | $30 | $1.00 | 30 kg | 1 |
| IntraGulf | `gulf_standard` | $25 | $1.50 | 30 kg | 5 |
| IntraGulf | `gulf_express` | $45 | $2.50 | 20 kg | 2 |
| International | `international_economy` | $35 | $2.00 | 25 kg | 10 |
| International | `international_standard` | $50 | $3.00 | 25 kg | 7 |

Services are filtered by weight — a 25 kg package hides `gulf_express`.

### Additional fees

| Option | Fee |
|---|---|
| Signature | $5.00 |
| Contains liquid | $10.00 |
| Insurance | $15.00 |
| Professional packaging | $8.00 |
| Home pickup | $6–$20, by sender country |
| Postal office drop-off | $2–$8, by sender country |

**Total** = base + (weight × per kg) + pickup fee + selected options.

Worked example — 12 kg, Saudi Arabia → Egypt, `international_economy`, home pickup, insurance:
`$35 + ($2 × 12) + $8 + $15 = $82.00`

### Conditional rules (the interesting ones to test)

| Rule | Trigger | Effect |
|---|---|---|
| Gulf street | Sender or receiver in a Gulf country | Street address becomes required |
| Gulf → Iraq | Gulf sender + Iraq receiver | **Blocked** |
| Item description | Non-Gulf → Gulf | Description required, min 5 chars |
| Mandatory signature | Receiver in Jordan or Egypt | Signature forced on, cannot be unchecked |
| Home pickup limit | Weight > 17 kg | Home pickup disabled, forced to postal office |
| Iraq exception | Sender in Iraq | Home pickup stays available above 17 kg |

### Field validation

- **Phone**: 10–15 digits (non-digits stripped before counting)
- **Name**: minimum 2 characters
- **City**: minimum 2 characters
- **Postal code**: 3–10 characters
- **Weight**: > 0, and ≤ the limit for the shipment type and service
- **Dimensions**: each between 1 and 200 cm

### Status model

Shipments are `draft` or `finalized`. Only drafts can be edited or finalized.
There is no multi-step delivery workflow.

## API Reference

Base URL: `http://localhost:3000/api`

All endpoints except `/api/auth/*` and `/api/agent/health` require the `auth_session`
cookie, and every shipment query is scoped to the signed-in user.

### Auth

```http
POST /api/auth/register    # { email, password, fullName, phone, country, city, street, postalCode }
POST /api/auth/login       # { email, password }  → sets auth_session cookie
POST /api/auth/logout
GET  /api/auth/me
```

### Shipments

```http
GET    /api/shipments?status=draft&shipmentType=IntraGulf&sortBy=createdAt&sortOrder=desc&page=1&limit=10
POST   /api/shipments/draft        # save a draft, minimal validation
POST   /api/shipments/finalize     # create + finalize, FULL business-rule validation
GET    /api/shipments/{id}
PUT    /api/shipments/{id}         # drafts only
DELETE /api/shipments/{id}
POST   /api/shipments/{id}/finalize
```

`status` accepts `draft` or `finalized`. `sortBy` accepts `createdAt`, `totalCost`, `status`.

### Rules and rates

```http
POST /api/rules/sender              # { from: { country } }
POST /api/rules/receiver            # { from: { country }, to: { country } }
POST /api/rules/package             # { from, to }  → also returns the detected shipmentType
POST /api/rules/service             # { shipmentType, package: { weight } }
POST /api/rules/additional-options  # { from, to, package: { weight } }
POST /api/rates                     # { serviceId, weight, senderCountry, receiverCountry, pickupMethod, ... }
```

### AI

```http
POST /api/agent/chat        # { message, history? }  → { reply, toolCalls, model, latencyMs }
POST /api/assistant/ask     # { question, k? }       → { answer, sources, model, latencyMs }
POST /api/assistant/search  # { query, k?, minScore? } → retrieval only, NO model call
GET  /api/agent/health      # public; reports key + index state
```

## Testing Opportunities

### Manual testing

1. **Progressive unlocking** — each card stays disabled until the previous is complete
2. **Boundary values** — exactly 17.0 vs 17.1 kg for home pickup; exactly 30 vs 30.1 kg for IntraGulf
3. **Conditional fields** — log in as `egy@` and ship to Saudi Arabia: the item description appears
4. **Forced state** — ship to Jordan: signature is checked *and* disabled
5. **Blocked route** — log in as `ksa@` and pick Iraq as the receiver

### UI automation

Every interactive element has a `data-testid`. The form generates them from the field
name, so they are stable across UI copy changes:

| Pattern | Example |
|---|---|
| `{fieldName}-input` | `receiverName-input`, `weight-input` |
| `{fieldName}-select` | `receiverCountry-select` |
| `{fieldName}-checkbox` | `insurance-checkbox` |
| `{fieldName}-error` | `weight-error` |
| `service-{serviceId}` | `service-gulf_express` |
| `pickup-{value}-radio` | `pickup-home-radio` |

Fixed IDs: `page-title`, `email-input`, `password-input`, `login-button`,
`register-button`, `save-draft-button`, `finalize-button`, `total-price`,
`error-message`, `payment-error-message`, `promo-modal`, `promo-close`.

AI surfaces: `agent-toggle`, `agent-panel`, `agent-input`, `agent-send`, `agent-close`,
`agent-thinking`, `agent-error`, `agent-message-{n}` (carries `data-role`),
`agent-tool-call-{toolName}`, `agent-latency-{n}`, `assistant-input`,
`assistant-submit`, `assistant-answer`, `assistant-sources`,
`assistant-source-{n}` (carries `data-source`).

```javascript
await page.getByTestId('receiverName-input').fill('Sara Al-Zoubi')
await page.getByTestId('weight-input').fill('18')
await page.getByTestId('finalize-button').click()
await expect(page.getByTestId('pickupMethod-error')).toBeVisible()
```

**A note on the promo modal**: `/shipments` shows an overlay on roughly 50% of visits, on
purpose, to teach Playwright's `addLocatorHandler`. Its test IDs are `promo-modal` and
`promo-close`.

### API testing

The highest-value exercise is **client vs server enforcement**. The UI hides options
the rules API says are unavailable, but the real check is server-side — so bypass the
form and post directly:

```bash
# Gulf → Iraq must be rejected even though the UI never lets you choose it
curl -b cookies.txt -X POST http://localhost:3000/api/shipments/finalize \
  -H 'Content-Type: application/json' \
  -d '{"from":{"country":"Saudi Arabia", ...},"to":{"country":"Iraq", ...}, ...}'
# → 400 {"error":"Validation failed","validationErrors":{"receiverCountry":"..."}}
```

Other good targets: post a tampered `rate` and confirm the server recalculates; request
another user's shipment id and confirm it 404s; finalize an already-finalized shipment.

### Testing the AI features

This is the part most test suites have never had to handle. Useful angles:

**Deterministic retrieval.** `/api/assistant/search` calls no chat model, so its output
depends only on the query embedding and the index. Assert on it without LLM flakiness:

```bash
curl -b cookies.txt -X POST http://localhost:3000/api/assistant/search \
  -H 'Content-Type: application/json' \
  -d '{"query":"shipping from Gulf countries to Iraq","k":3}'
# top hit should be logic.md / 09-business-rules-stories.md
```

**Assert on tool calls, not prose.** `/api/agent/chat` returns a `toolCalls` array. A
pricing question *must* route through `quote_price` rather than the model doing mental
arithmetic — that assertion is stable even when the wording changes.

**Authorization under adversarial input.** The agent's `userId` comes from the JWT and is
never a tool parameter. Ask it for another user's tracking number and it should refuse:

```
"Show me shipment TR142611255"   →  "No such shipment belongs to you."
```

Try to talk it into ignoring that. It should not work — this is the interesting
prompt-injection exercise.

**Grounding.** Ask the assistant something the docs don't cover. It is instructed to say
"I don't know based on the documentation" rather than invent a rule.

**Degraded modes.** Unset `OPENROUTER_API_KEY` → AI endpoints return `503` with a helpful
message while the rest of the app keeps working. Skip `npm run ingest` → the assistant
reports an empty index.

⚠️ Every agent/assistant test spends real tokens from your own key and inherits some LLM
nondeterminism. Prefer `/api/assistant/search` and `toolCalls` assertions where you can.

## Troubleshooting

**Reset everything**: `npm run reset` (then `npm run ingest` again if you use the AI)

**Database location**: `prisma/dev.db`

**Port in use**: `PORT=3001 npm run dev`

**Prisma client out of date**: `npx prisma generate`

**Assistant says the index is empty**: run `npm run ingest`, then restart the dev server —
the retriever caches chunks per server process.

**`OPENROUTER_API_KEY is not set`**: it lives in `.env`, which is gitignored. Copy
`.env.example` and add your own key.

## Learning Resources

- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Playwright: https://playwright.dev
- LangChain JS: https://docs.langchain.com/oss/javascript/langchain/overview
- OpenRouter: https://openrouter.ai/docs

## License

Created for educational purposes. Free to use for teaching and learning software testing.

---

**Happy Testing!** 🧪
