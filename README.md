# ShipTest

A shipping management app used for teaching software testing — manual testing,
UI automation, API testing, and AI/agent testing.

It ships with an AI assistant: a LangChain agent that can read your shipments,
price them with the real pricing engine, answer questions about the shipping
rules from the project documentation, and offer to fill the shipment form for
you.

> This README covers **setup and running only**. The business rules and the AI
> behaviour are documented as user stories in [`stories/`](./stories).

---

## Requirements

- **Node.js 18+**
- **npm**

Nothing else. The database is a local SQLite file — no database server, no
Docker, no cloud account needed to run the app.

---

## Setup

**1. Install dependencies**

```bash
npm install
```

**2. Create your environment file**

```bash
cp .env.example .env
```

`.env` is git-ignored and never committed. `.env.example` is the template.

**3. Create and seed the database**

```bash
npm run setup
```

This generates the Prisma client, creates `prisma/dev.db`, and seeds test users
and sample shipments.

**4. Start the app**

```bash
npm run dev
```

Open **http://localhost:3000**

---

## Logging in

The seed creates five users. They all share the same password:

| Email | Password |
|---|---|
| `ksa@qacart.com` | `Test@1234` |
| `uae@qacart.com` | `Test@1234` |
| `kwt@qacart.com` | `Test@1234` |
| `jor@qacart.com` | `Test@1234` |
| `egy@qacart.com` | `Test@1234` |

Each user is based in a different country, which changes which shipping rules
apply. You can also register a new account from the sign-up page.

---

## Enabling the AI assistant (optional)

The app runs fine without this. The AI features simply return a `503` with a
message telling you what is missing.

The assistant runs through **OpenRouter**, and **every student uses their own
API key** — nothing is shared.

**1. Get an API key**

Sign up and create a key at:

### 👉 https://openrouter.ai/keys

OpenRouter is pay-as-you-go. Indexing the docs costs a fraction of a cent, and
normal use during a course costs very little.

**2. Add the key to `.env`**

```bash
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

**3. Build the documentation index**

```bash
npm run ingest
```

This reads the project documentation, creates embeddings via OpenRouter, and
stores them locally. Run it once — and again whenever the docs change.

**4. Restart the dev server**

```bash
npm run dev
```

**5. Check it worked**

```bash
curl http://localhost:3000/api/agent/health
```

Expected:

```json
{ "ok": true, "apiKeyConfigured": true, "indexedChunks": 235 }
```

If `ok` is `false`, the `hints` field in that response tells you what to fix.

### Choosing a model

`OPENROUTER_MODEL` in `.env` selects the chat model. Any tool-capable model from
https://openrouter.ai/models works.

| Model | Notes |
|---|---|
| `openai/gpt-5.6-terra` | Default. Reliable multi-step tool use. |
| `google/gemini-3.5-flash` | Also reliable, a little slower. |
| `google/gemini-3.5-flash-lite` | **Avoid** — returns empty replies after tool calls. |

Where to find the assistant once it is enabled:

- The **chat bubble** in the bottom-right of the create / edit / repeat shipment
  page. It can read the form and offer to fill it in.
- The **Shipping Rules Assistant** at `/assistant`, which answers from the
  project documentation and shows its sources.

---

## Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run check` | Type-check Svelte and TypeScript |
| `npm run setup` | Generate Prisma client, create the DB, seed it |
| `npm run seed` | Re-seed only |
| `npm run reset` | Delete the database and set it up again |
| `npm run ingest` | Build the AI documentation index (needs an API key) |

---

## Tech stack

- **SvelteKit 2** with **Svelte 5** (runes) and TypeScript
- **Tailwind CSS**
- **SQLite** via **Prisma**
- **LangChain** with **OpenRouter** for the agent and the RAG assistant

---

## Troubleshooting

The app reports setup problems itself — a missing API key or an unbuilt index
come back as a clear message, and `GET /api/agent/health` lists what is missing.
This section is only for things it cannot tell you.

**Port 3000 already in use**

```bash
npm run dev -- --port 3001
```

**Start over with a clean database**

```bash
npm run reset      # deletes prisma/dev.db, recreates and re-seeds it
npm run ingest     # only if you use the AI features
```

**`@prisma/client did not initialize yet`**

The generated client is out of date after a schema change:

```bash
npx prisma generate
```

**Changes to the docs are not reflected in the assistant**

The index is built once and cached per server process. Re-run `npm run ingest`,
then restart the dev server.

---

## Notes for automation

There are **no `data-testid` attributes**, deliberately. Every control is
reachable through accessible locators — `getByRole`, `getByLabel` — which is what
Playwright recommends. If something cannot be located that way, treat it as an
accessibility bug.

No tests are included. Writing them is the exercise.

---

## License

Created for educational purposes. Free to use for teaching and learning software
testing.
