# 15 — Backend & API Reference

Technical reference for the backend: stack, auth, every API endpoint with request bodies,
responses and error codes. Source: code in [AnenQA/ship-app](https://github.com/AnenQA/ship-app),
read 2026-10-22. Business rules themselves are in documents 01–14; the database is in
[16 — Database](./16-database.md).

## Overview

The backend is a SvelteKit app with JSON endpoints under `/api`, Prisma on SQLite, and
cookie-based JWT auth.

| Layer | What it is | Where |
|---|---|---|
| HTTP endpoints | SvelteKit `+server.ts` route handlers | `src/routes/api/**` |
| Auth | JWT in an httpOnly cookie, resolved once per request | `src/hooks.server.ts`, `src/lib/server/auth.ts` |
| Business logic | Validator, rate calculator, payload mapper | `src/lib/server/validators`, `services`, `shipment-payload.ts` |
| Rules config | JSON rule files served by `/api/rules/*` | `src/lib/rules/*.json` |
| Data access | Repositories over Prisma Client | `src/lib/server/repositories` |
| Database | SQLite file `prisma/dev.db` | `prisma/schema.prisma` |
| AI | LangChain/LangGraph agent + RAG over OpenRouter | `src/lib/server/ai`, `scripts/ingest.ts` |

### Running it

1. `npm install`
2. Copy `.env.example` to `.env` and set `JWT_SECRET` (and `OPENROUTER_API_KEY` for AI).
3. `npm run setup` — generates Prisma Client, pushes the schema, seeds demo users.
4. `npm run ingest` — builds the AI document index (only needed for AI endpoints).
5. `npm run dev` — starts the Vite dev server. `npm run reset` wipes and rebuilds the database.

### Base URL and format

- All endpoints are relative to the app origin, e.g. `http://localhost:5173/api/...` in dev.
- Requests and responses are JSON (`Content-Type: application/json`).
- No API versioning. Only `GET /api/shipments` pages (`page`, `limit`).

### Authentication

- `POST /api/auth/login` or `/register` sets cookie `auth_session`: a JWT `{ userId, email }`, signed with `JWT_SECRET`.
- Cookie flags: `httpOnly`, `sameSite=lax`, `path=/`, `maxAge` 30 days, `secure` in production only. No refresh.
- Every request passes through `hooks.server.ts`, which loads the user into `locals.user` (password excluded).
- Protected endpoints call `requireUser()` and answer `401` when there is no valid cookie.
- API clients (Postman, Playwright) must log in first and send the cookie back on each call.

### Error format

| Source | Body | Typical status |
|---|---|---|
| Handler returns an error | `{ "error": "Invalid email or password" }` | 400, 401, 404, 409, 500, 503 |
| Validation failure | `{ "error": "Validation failed", "validationErrors": { "<field>": "<message>" } }` | 400 |
| `requireUser()` / SvelteKit `error()` | `{ "message": "Unauthorized" }` | 401 |

## Endpoints

Auth = needs the `auth_session` cookie; without it the endpoint answers `401`.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create an account and log in |
| POST | `/api/auth/login` | No | Log in, set cookie |
| POST | `/api/auth/logout` | No | Clear cookie |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/shipments` | Yes | List own shipments (filter, sort, page) |
| POST | `/api/shipments` | Yes | Create a draft from flat fields (legacy, no validation) |
| POST | `/api/shipments/draft` | Yes | Save a draft |
| POST | `/api/shipments/finalize` | Yes | Create and finalize in one step |
| GET | `/api/shipments/{id}` | Yes | One shipment |
| PUT | `/api/shipments/{id}` | Yes | Update a draft |
| DELETE | `/api/shipments/{id}` | Yes | Delete draft / cancel finalized |
| POST | `/api/shipments/{id}/finalize` | Yes | Finalize an existing draft |
| POST | `/api/rates` | No | Price preview |
| POST | `/api/rules/sender` | No | Sender card rules |
| POST | `/api/rules/receiver` | No | Receiver card rules + route block |
| POST | `/api/rules/package` | No | Package rules for the route |
| POST | `/api/rules/service` | No | Services that fit type and weight |
| POST | `/api/rules/additional-options` | No | Signature and pickup rules |
| POST | `/api/agent/chat` | Yes | AI shipping agent |
| GET | `/api/agent/health` | No | AI configuration check |
| POST | `/api/assistant/ask` | Yes | RAG answer from the rules docs |
| POST | `/api/assistant/search` | Yes | Retrieval only, no chat model |

## Shared objects

### User

Never includes the password.

```json
{ "id": 2, "email": "ksa@qacart.com", "fullName": "Khalid Al-Otaibi", "phone": "0551234567",
  "country": "Saudi Arabia", "city": "Riyadh", "street": "King Fahd Road", "postalCode": "12211",
  "createdAt": "2026-10-22T09:00:00.000Z", "updatedAt": "2026-10-22T09:00:00.000Z" }
```

### Shipment payload (request)

The nested body sent to `/draft`, `/finalize` and `PUT /{id}`. Missing text fields become `""`,
missing numbers `0`.

```json
{
  "from": { "name": "Khalid Al-Otaibi", "phone": "0551234567", "country": "Saudi Arabia",
            "city": "Riyadh", "street": "King Fahd Road", "postalCode": "12211" },
  "to":   { "name": "Sultan Al-Harbi", "phone": "0559876543", "country": "Saudi Arabia",
            "city": "Jeddah", "street": "Prince Sultan Street", "postalCode": "21442" },
  "package": { "weight": 5, "length": 30, "width": 20, "height": 15, "description": "" },
  "service": { "type": "domestic_standard", "pickupMethod": "home", "shipmentType": "Domestic" },
  "additional": { "signature": false, "liquid": false, "insurance": false, "packaging": false },
  "rates": { "base": 25.5, "signature": 0, "insurance": 0, "packaging": 0, "total": 25.5 }
}
```

- `service.type` = service id: `domestic_standard`, `domestic_express`, `gulf_standard`,
  `gulf_express`, `international_economy`, `international_standard`.
- `service.pickupMethod` = `home` (default) or `postal_office`.
- `service.shipmentType` is optional; when absent the server derives it from the two countries.
- `rates` is only stored by `/draft` and `PUT`. Finalize ignores it and recalculates.
- Countries are sent by English name (`"United Arab Emirates"`), not ISO code.

### Shipment (response)

Built by the repository from the flat table row.

```json
{
  "id": 7, "trackingNumber": "TR482913057", "status": "draft",
  "from": { "name": "...", "phone": "...", "country": "...", "city": "...", "street": "...", "postalCode": "..." },
  "to":   { "name": "...", "phone": "...", "country": "...", "city": "...", "street": "...", "postalCode": "..." },
  "package": { "weight": 5, "length": 30, "width": 20, "height": 15, "description": "" },
  "service": { "type": "domestic_standard", "shipmentType": "Domestic", "pickupMethod": "home" },
  "options": { "signature": false, "liquid": false, "insurance": false, "packaging": false },
  "rate": { "base": 25.5, "total": 25.5, "signature": 0, "insurance": 0, "packaging": 0, "liquid": 0 },
  "createdAt": "2026-10-22T09:15:00.000Z", "updatedAt": "2026-10-22T09:15:00.000Z"
}
```

`status` is `draft` or `finalized`. `rate.liquid` is always `0`; the liquid fee is inside `total`.

## Auth endpoints

### POST `/api/auth/register`

- Body: `email`, `password`, `fullName`, `phone`, `country`, `city`, `street`, `postalCode` —
  all required (street too, even for non-Gulf).
- Checks: email format, password ≥ 6 chars, then the sender-card rules (name, phone, city,
  postal code lengths). Email is stored lower-case.

| Status | Body |
|---|---|
| 201 | `{ "message": "Registered successfully", "user": User }` + cookie |
| 400 | `All fields are required` · `Invalid email format` · `Password must be at least 6 characters` · first sender-rule message |
| 409 | `Email is already registered` |
| 500 | `Failed to register user` |

### POST `/api/auth/login`

Body: `{ "email": "ksa@qacart.com", "password": "Test@1234" }` (email matched case-insensitively).

| Status | Body |
|---|---|
| 200 | `{ "message": "Logged in successfully", "user": User }` + cookie |
| 400 | `Email and password are required` |
| 401 | `Invalid email or password` (same for unknown email and wrong password) |
| 500 | `Login failed` |

### POST `/api/auth/logout`

No body. Always `200` → `{ "message": "Logged out successfully" }`; the cookie is deleted.

### GET `/api/auth/me`

`200` → `{ "user": User }` · `401` → `{ "error": "Unauthorized" }`.

## Shipment endpoints

### GET `/api/shipments`

| Query param | Values | Default |
|---|---|---|
| `status` | `draft`, `finalized`, `all` | all |
| `shipmentType` | `Domestic`, `IntraGulf`, `International`, `all` | all |
| `sortBy` | `createdAt`, `totalCost`, `status` | `createdAt` |
| `sortOrder` | `asc`, `desc` | `desc` |
| `page` | integer ≥ 1 | `1` |
| `limit` | integer (no maximum) | `10` |

- `200` → `{ "shipments": [Shipment], "total": 23, "page": 1, "limit": 10, "totalPages": 3 }`.
  Only the caller's shipments.
- `500` → `Failed to load shipments` (also what an unknown `sortBy` column produces).

### POST `/api/shipments/draft`

Body: Shipment payload. Only checks that weight and dimensions, if present, are non-negative numbers.

| Status | Body |
|---|---|
| 201 | `{ "success": true, "message": "Draft saved successfully", "shipment": Shipment }` |
| 400 | `{ "error": "Invalid data format", "validationErrors": { "weight": "Weight must be a valid number" } }` |
| 500 | `Failed to save draft` |

### POST `/api/shipments/finalize`

Body: Shipment payload. Runs every business rule, recalculates the price, then writes a draft
row and flips it to finalized.

| Status | Body |
|---|---|
| 201 | `{ "success": true, "message": "Shipment finalized successfully", "shipment": Shipment, "rateBreakdown": { "baseCost", "signatureCost", "insuranceCost", "packagingCost", "liquidCost" } }` |
| 400 | `Validation failed` + `validationErrors` (field → message) |
| 400 | `Failed to calculate cost` + `details` (unknown service, or weight over the service max) |
| 400 | `Failed to finalize shipment` + `details` (any other error) |

Example validation failure (Saudi sender to Iraq, home pickup at 20 kg):

```json
{ "error": "Validation failed",
  "validationErrors": {
    "receiverCountry": "Shipping from Gulf countries to Iraq is not currently available",
    "pickupMethod": "Home pickup is not available for packages over 17 kg. Please choose drop off at a postal office" } }
```

Validation error keys: `senderName`, `senderPhone`, `senderCountry`, `senderCity`,
`senderPostalCode`, `senderStreet`, `receiverName`, `receiverPhone`, `receiverCountry`,
`receiverCity`, `receiverPostalCode`, `receiverStreet`, `weight`, `length`, `width`, `height`,
`itemDescription`, `signatureRequired`, `pickupMethod`, `serviceType`, `shipmentType`.

### POST `/api/shipments/{id}/finalize`

No body. Finalizes a stored draft: rebuilds the form data from the row, validates, recalculates,
overwrites prices, sets status.

| Status | Body |
|---|---|
| 200 | Same body as `/finalize` |
| 400 | `Invalid shipment ID` · `Shipment is already finalized` · `Failed to calculate cost` |
| 400 | `Validation failed` + `validationErrors` + `message: "This draft cannot be finalized because it contains data errors"` |
| 404 | `Shipment not found` |
| 500 | `Failed to finalize shipment` + `details` |

### GET `/api/shipments/{id}`

| Status | Body |
|---|---|
| 200 | `{ "shipment": Shipment }` |
| 400 | `Invalid shipment ID` |
| 404 | `Shipment not found` (also for another user's id) |
| 500 | `Failed to load shipment` |

### PUT `/api/shipments/{id}`

Body: Shipment payload. Drafts only; no business-rule validation; stores the client's `rates`.

| Status | Body |
|---|---|
| 200 | Shipment (not wrapped) |
| 400 | `Invalid shipment ID` · `Only drafts can be edited` · `Failed to update shipment` + `details` |
| 404 | `Shipment not found` |

### DELETE `/api/shipments/{id}`

Hard delete for both states.

| Status | Body |
|---|---|
| 200 | `{ "success": true, "message": "Shipment deleted successfully" }` (draft) or `"Shipment cancelled successfully"` (finalized) |
| 400 | `Invalid shipment ID` |
| 404 | `Shipment not found` |
| 500 | `Failed to delete shipment` |

### POST `/api/shipments` (legacy)

Body is flat form data (`senderName`, …, `serviceType`, plus `baseCost`, `totalCost`, …).
Saves a draft with no validation and the client's prices. `201` → Shipment; `400` →
`Failed to create shipment` + `details`. The UI does not call it.

## Rates and rules endpoints

These endpoints are public and read nothing from the database; they evaluate the JSON files in
`src/lib/rules`.

### POST `/api/rates`

```json
{ "serviceId": "gulf_standard", "weight": 15, "senderCountry": "Kuwait", "receiverCountry": "Saudi Arabia",
  "pickupMethod": "home", "signatureRequired": true, "containsLiquid": false, "insurance": true, "packaging": false }
```

First five fields required. `200` →

```json
{ "totalPrice": 74.5,
  "breakdown": { "baseCost": 54.5, "signatureCost": 5, "insuranceCost": 15, "packagingCost": 0, "liquidCost": 0 },
  "context": { "serviceName": "Gulf Standard", "shipmentType": "IntraGulf", "weight": 15,
               "senderCountry": "Kuwait", "receiverCountry": "Saudi Arabia", "pickupMethod": "home" } }
```

- `baseCost` = service base + weight × per-kg + pickup fee (25 + 22.50 + 7 = 54.50).
- `400` → `All required fields must be filled` (also for weight `0`) ·
  `Weight 31kg exceeds service maximum of 30kg`.
- `404` → `Service not found`. `500` → `Failed to calculate price`.

### Rules endpoints

| Endpoint | Body | Returns (beyond the card's JSON config) |
|---|---|---|
| `/api/rules/sender` | `{ "from": { "country" } }` | Country options, `senderStreet.required` = sender is Gulf |
| `/api/rules/receiver` | `{ "from": { "country" }, "to": { "country" } }` | Country options, `receiverStreet.required`, `validationErrors.receiverCountry` for Gulf → Iraq |
| `/api/rules/package` | `{ "from": { "country" }, "to": { "country" } }` | `shipmentType`, `maxWeight`, `maxDimension`, `itemDescription.required/visible`; `400` if a country is missing |
| `/api/rules/service` | `{ "shipmentType", "package": { "weight" } }` | `services` that fit the weight; `400` if type missing or invalid |
| `/api/rules/additional-options` | `{ "from", "to", "package": { "weight" } }` | `signatureRequired.checked/disabled` for Jordan/Egypt; pickup `allowedValues`, `defaultValue`, `disabledValues` |

## AI endpoints

All AI endpoints (except health) call OpenRouter and answer `503` with a missing-key message when
`OPENROUTER_API_KEY` is unset.

### POST `/api/agent/chat`

- Body: `message` (required, ≤ 4000 chars), `history` (optional,
  `[{ "role": "user" | "assistant", "content" }]`, last 10 kept), `formContext` (optional:
  `values`, `completed`, `errors`, `shipmentType` of the open form).
- `200` → `{ "reply", "toolCalls", "proposal", "model", "latencyMs" }`. `proposal` carries
  suggested form values when the agent offers to fill the form.
- `400` → `message is required` · `message is too long (max 4000 characters)`.
  `500` → the agent's error message.
- Agent tools: `search_shipments`, `get_shipment`, `quote_price`, `check_rules`,
  `list_services`, `search_policy_docs`, `list_countries`, `create_draft_shipment`; on the form
  also `read_form`, `propose_form_values`.

### POST `/api/assistant/ask`

Body `{ "question", "k": 4 }` (k clamped 1–10).
`200` → `{ "answer", "sources": [{ "n", "source", "heading", "score" }], "model", "latencyMs" }`.
`400` → `question is required`.

### POST `/api/assistant/search`

Body `{ "query", "k": 4, "minScore": 0 }`.
`200` → `{ "query", "k", "minScore", "indexedChunks", "results" }`, where results are the top
chunks by cosine similarity. `400` → `query is required`.

### GET `/api/agent/health`

Public, never calls OpenRouter.
`200` → `{ "ok", "apiKeyConfigured", "model", "embeddingModel", "indexedChunks", "hints": [] }`;
`ok` is true only with a key and at least one indexed chunk.

## Environment variables

| Variable | Used for | Default / example |
|---|---|---|
| `DATABASE_URL` | SQLite file location | `file:./dev.db` |
| `JWT_SECRET` | Signs the auth cookie | Falls back to `fallback-secret-change-in-production` if unset |
| `OPENROUTER_API_KEY` | All AI endpoints and `npm run ingest` | none; AI endpoints answer `503` without it |
| `OPENROUTER_MODEL` | Chat model for agent and assistant | `openai/gpt-5.6-terra` |
| `OPENROUTER_EMBEDDING_MODEL` | Embeddings for the RAG index | `openai/text-embedding-3-small` |
| `NODE_ENV` | `production` turns on the cookie's `secure` flag | — |

## Where the code differs from the business documents

Found while reading the code; worth checking before writing tests against either source.
See also [14 — Known Gaps](./14-known-gaps-and-contradictions.md).

| Topic | Business documents say | Code does |
|---|---|---|
| Tracking number on drafts | Only given at finalization | Assigned when the draft row is created; kept on finalize |
| Tracking number uniqueness | Unique | Random with no retry; a collision fails the insert |
| Estimated delivery | Set at finalization from the service | Never written |
| Sender | Always the logged-in user | Taken from the request's `from`; the server does not compare it to the profile |
| Draft prices | Preview only | `/draft` and `PUT` store whatever `rates` the client sends until finalize |
| Finalize atomicity | — | `/finalize` inserts then updates without a transaction; a failure between leaves a draft |
| Name characters | Letters, spaces, `-`, `'` only | Server checks length ≥ 2 only |
| Postal code max | 3–10 chars | Shipment validator checks minimum 3 only |
| Description max | 200 chars | Shipment validator checks minimum 5 only |
| Registration street | — | Required for every country, unlike the shipment form |

The repo's `README.md` still documents endpoints and prices that no longer exist; this document
supersedes it for API details.
