# 16 — Database

The database is one SQLite file (`prisma/dev.db`, set by `DATABASE_URL`) with three tables:
`User`, `Shipment` and `DocChunk`. The schema (`prisma/schema.prisma`) is applied with
`prisma db push`, so there are no migration files. Source: code in
[AnenQA/ship-app](https://github.com/AnenQA/ship-app), read 2026-10-22.

## Relations

```
User 1 ──── * Shipment      (Shipment.userId → User.id, cascade on delete)
DocChunk                    (stands alone)
```

## Tables

### User

Registered customers. The address fields double as the permanent sender address.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | Int | PK, autoincrement | |
| `email` | String | unique, indexed | Stored lower-case |
| `password` | String | | bcrypt hash, 10 rounds; never returned |
| `fullName` | String | | |
| `phone` | String | | |
| `country` | String | | English country name |
| `city` | String | | |
| `street` | String | | Required at registration |
| `postalCode` | String | | |
| `createdAt` | DateTime | default now() | |
| `updatedAt` | DateTime | @updatedAt | Set by Prisma on every update |

### Shipment

One row per order, draft or finalized. The API reshapes it into the nested Shipment object
(see [15 — API Reference](./15-backend-api-reference.md#shipment-response)).

| Column | Type | Default | Notes |
|---|---|---|---|
| `id` | Int | autoincrement | PK |
| `trackingNumber` | String | | Unique, indexed. `TR` + 9 digits, assigned at creation (drafts too) |
| `userId` | Int | | FK → `User.id`, indexed, cascade delete |
| `senderName`, `senderStreet`, `senderCity`, `senderPostalCode`, `senderCountry`, `senderPhone` | String | | Copied from the request's `from` |
| `receiverName`, `receiverStreet`, `receiverCity`, `receiverPostalCode`, `receiverCountry`, `receiverPhone` | String | | From `to` |
| `weight` | Float | | kg |
| `length`, `width`, `height` | Float | | cm |
| `contentDescription` | String | `""` | API field `package.description` |
| `shipmentType` | String | `Domestic` | `Domestic`, `IntraGulf`, `International` |
| `pickupMethod` | String | `home` | `home` or `postal_office` |
| `serviceType` | String | | Service id, e.g. `gulf_standard` |
| `signatureRequired` | Boolean | false | |
| `containsLiquid` | Boolean | false | |
| `insurance` | Boolean | false | |
| `packaging` | Boolean | false | |
| `price` | Float | | Same value as `totalCost` |
| `baseCost` | Float | 0 | Service base + weight cost + pickup fee |
| `insuranceCost`, `signatureCost`, `packagingCost` | Float | 0 | No liquid column; liquid is only in the total |
| `totalCost` | Float | 0 | |
| `isDraft` | Boolean | false | App writes `true` on create, `false` on finalize |
| `status` | String | `Pending` | Indexed. App only writes `draft` or `finalized` |
| `createdAt` | DateTime | now() | Indexed; default sort |
| `updatedAt` | DateTime | @updatedAt | |
| `estimatedDelivery` | DateTime? | null | Never written by current code |
| `actualDelivery` | DateTime? | null | Never written by current code |

### DocChunk

The AI assistant's search index: text chunks from `stories/*.md` and `src/lib/rules/*.json`
with their embeddings.

| Column | Type | Notes |
|---|---|---|
| `id` | Int | PK, autoincrement |
| `source` | String | File path, e.g. `stories/09-business-rules-stories.md`; indexed |
| `heading` | String | Nearest markdown heading, used for citations |
| `content` | String | Chunk text (about 900 chars, 120 overlap) |
| `embedding` | String | JSON array of floats; similarity computed in JS |
| `createdAt` | DateTime | default now() |

## When tables are updated

`Shipment` is written by six actions, `User` only by registration and seeding, and `DocChunk`
only by `npm run ingest`. Every other endpoint only reads.

| Trigger | Table | Write | What changes |
|---|---|---|---|
| `POST /api/auth/register` | User | INSERT | New row, hashed password, lower-cased email |
| `POST /api/shipments/draft` | Shipment | INSERT | New row, `status=draft`, `isDraft=true`, new tracking number, client's `rates` |
| `POST /api/shipments` (legacy) | Shipment | INSERT | Same as draft, from flat fields, client's prices, no checks |
| Agent tool `create_draft_shipment` with `confirm: true` | Shipment | INSERT | Draft row after full rule check, server-calculated prices |
| `PUT /api/shipments/{id}` (drafts only) | Shipment | UPDATE | Every data and price column overwritten; `updatedAt` refreshed |
| `POST /api/shipments/finalize` | Shipment | INSERT, then UPDATE | Draft row with server prices, then `status=finalized`, `isDraft=false` |
| `POST /api/shipments/{id}/finalize` | Shipment | UPDATE, then UPDATE | Prices recalculated and rewritten, then `status=finalized`, `isDraft=false` |
| `DELETE /api/shipments/{id}` | Shipment | DELETE | Row removed permanently (draft or finalized) |
| `npm run seed` / `npm run setup` | Shipment, User | DELETE all, INSERT | 5 users and 6 shipments recreated |
| `npm run reset` | all | file deleted | Database file removed and rebuilt; `DocChunk` is empty until the next ingest |
| `npm run ingest` | DocChunk | DELETE all, INSERT | Index rebuilt from `stories/*.md` and the rules JSON |
| User row deleted (no endpoint does this) | Shipment | DELETE (cascade) | All of that user's shipments |

Read-only: login, me, logout, `GET /api/shipments`, `GET /api/shipments/{id}`, `/api/rates`,
all `/api/rules/*`, `/api/assistant/*` and `/api/agent/health` (these read `DocChunk`). The
agent's other tools read `Shipment` but never write.

### Columns that never change after insert

- `id`, `userId`, `trackingNumber`, `createdAt` on `Shipment`.
- Everything on `User`: `userRepository.update` exists but no endpoint calls it, so profiles
  cannot be edited.
- `estimatedDelivery` and `actualDelivery` are never set by any code path.

## Seed data

`npm run setup` (or `npm run seed`) empties `Shipment` and `User`, then inserts 5 users
(password `Test@1234`) and 6 shipments: 5 finalized, 1 draft.

| User | Country | Seeded shipments |
|---|---|---|
| `ksa@qacart.com` | Saudi Arabia | 1 Domestic, finalized |
| `kwt@qacart.com` | Kuwait | 1 IntraGulf to UAE, finalized |
| `jor@qacart.com` | Jordan | 1 International to Egypt, finalized · 1 Domestic draft |
| `egy@qacart.com` | Egypt | 1 International to Saudi Arabia, finalized |
| `uae@qacart.com` | United Arab Emirates | 1 IntraGulf to Kuwait, finalized |

Seeded prices are hard-coded and do not all match the current pricing rules.

## Conventions

- Countries, statuses and shipment types are free strings matched by exact value; there are no
  enums in the database.
- Money is USD in Float columns, rounded to 2 decimals by the rate calculator.
