# XenoReach AI — AI-Native Mini CRM

An AI-native CRM for reaching shoppers across WhatsApp, SMS, Email and RCS —
ingest customers & orders, build audiences with natural language, generate
campaigns with AI, dispatch through a simulated channel service, and track
delivery/engagement analytics.

This repo contains everything needed to run the full product locally:

```
xenoreach-ai/
├── backend/
│   ├── crm-core/          # Spring Boot 3 (Java 21) — auth, CRM, segments, campaigns, analytics, AI
│   ├── channel-simulator/ # Spring Boot 3 — simulates SENT → DELIVERED/FAILED → OPENED → CLICKED → CONVERTED
│   └── docker-compose.yml # Postgres + both backend services
└── frontend/               # TanStack Start (React + Vite) — the dashboard UI
```

---

## 1. Architecture overview

```
Browser
  │
  │  Google Sign-In (Firebase)
  ▼
Frontend (TanStack Start, :5173 dev / :3000 build)
  │  REST + JWT (Authorization: Bearer <token>)
  ▼
crm-core (Spring Boot, :8080)
  │  POST /api/channel/send (async)
  ▼
channel-simulator (Spring Boot, :8081)
  │  POST /api/events/callback (DELIVERED/OPENED/CLICKED/...)
  ▼
crm-core  ──►  PostgreSQL (:5432)
```

- The frontend talks **only** to `crm-core`.
- `crm-core` resolves a campaign's audience from its segment's rule JSON,
  creates one `Communication` row per customer, and asynchronously hands each
  one to `channel-simulator`.
- `channel-simulator` schedules a randomized delivery lifecycle (1–10s delays,
  configurable probabilities) and calls back into `crm-core` with each stage
  (`SENT → DELIVERED/FAILED → OPENED → CLICKED → CONVERTED`), which updates
  the `Communication` and `Event` tables that power the Analytics screens.

---

## 2. Prerequisites

| Tool | Version | Used for |
|---|---|---|
| Java | 21 | both backend services |
| Maven | 3.9+ | building the backend (or use the included `Dockerfile`s) |
| Docker + Docker Compose | recent | easiest way to run Postgres + backend |
| Node.js | 20+ | frontend |
| Bun **or** npm/pnpm | latest | frontend package manager (repo includes `bun.lock`) |

---

## 3. Backend setup

### 3a. Quick start with Docker Compose (recommended)

```bash
cd backend
cp crm-core/.env.example crm-core/.env          # optional, see step 5 for AI/Firebase
docker compose up --build
```

This starts:
- **PostgreSQL** on `5432` (auto-creates `xenoreach` DB, runs Flyway
  migrations + seeds 10 demo customers/orders)
- **channel-simulator** on `8081`
- **crm-core** on `8080`

Swagger UI: http://localhost:8080/swagger-ui.html

> By default `docker-compose.yml` sets `AI_PROVIDER=mock` and
> `FIREBASE_ENABLED=false` so everything works with **zero external
> credentials**. See step 5 to enable real Gemini/OpenAI and real Firebase
> Google Sign-In verification.

### 3b. Run without Docker

```bash
# 1. Postgres
docker run -d --name xeno-pg -e POSTGRES_DB=xenoreach -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16-alpine

# 2. Channel simulator
cd backend/channel-simulator
mvn spring-boot:run

# 3. CRM core (new terminal)
cd backend/crm-core
mvn spring-boot:run
```

---

## 4. Frontend setup

```bash
cd frontend
cp .env.example .env
bun install      # or: npm install / pnpm install
bun run dev      # or: npm run dev
```

Open **http://localhost:5173**.

Set `VITE_API_BASE_URL` in `frontend/.env` to wherever `crm-core` is running
(default `http://localhost:8080` matches the steps above).

---

## 5. Enabling "Sign in with Google" (Firebase)

The app works **out of the box without Firebase** — "Continue with Google"
falls back to a dev-mode prompt that still exercises the full
auth → JWT → protected-API flow. To enable the real Google account picker:

### 5a. Create a Firebase project
1. Go to https://console.firebase.google.com → **Add project** (you can
   disable Google Analytics for it).
2. **Authentication → Sign-in method → Google → Enable**.
3. **Authentication → Settings → Authorized domains** → add `localhost` (and
   your deployed frontend domain later).

### 5b. Frontend config (Web app)
1. In Firebase Console: **Project settings → General → Your apps → Add app → Web**.
2. Copy the config values into `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
```

3. Restart the frontend dev server. "Continue with Google" now opens the real
   Google account picker and gets a real Firebase ID token.

### 5c. Backend verification (Admin SDK) — recommended for production
By default `crm-core` runs with `FIREBASE_ENABLED=false`, which **decodes**
the Google ID token's claims (email, name, picture) **without verifying the
signature**. This is fine for local dev/demos, but for production you should
verify tokens properly:

1. Firebase Console → **Project settings → Service accounts → Generate new
   private key** (downloads a JSON file).
2. Base64-encode it:
   ```bash
   base64 -w0 service-account.json   # macOS: base64 -i service-account.json
   ```
3. Set on `crm-core`:
   ```env
   FIREBASE_ENABLED=true
   FIREBASE_CREDENTIALS_BASE64=<paste base64 string>
   ```

With this enabled, `crm-core` verifies every Google ID token via the Firebase
Admin SDK before issuing its own JWT.

---

## 6. AI provider configuration (optional)

`crm-core` ships with a **mock/heuristic AI mode** (`AI_PROVIDER=mock`,
the default) that generates real segment rules and campaign copy from
keyword/regex heuristics — no API key needed, fully functional for demos.

To use a real LLM, set on `crm-core`:

```env
# Gemini (default model: gemini-1.5-flash)
AI_PROVIDER=gemini
GEMINI_API_KEY=your-key

# OR OpenAI (default model: gpt-4o-mini)
AI_PROVIDER=openai
OPENAI_API_KEY=your-key
```

If a key is missing or a call fails for any reason, `crm-core` automatically
falls back to the heuristic generator — the AI endpoints never hard-fail.

---

## 7. Using the app

1. Open the frontend, click **Continue with Google** (or **Sign in with
   email** if Firebase isn't configured) — this creates a user in `crm-core`
   and issues a JWT.
2. **Customers** — seeded with 10 demo customers/orders; add more via "Add
   customer".
3. **Segments** — type something like *"customers who spent over ₹5000 and
   haven't purchased in 60 days"* and click Generate, or build rules
   visually. Save the segment.
4. **Campaigns** — pick the segment, click Generate with a goal like *"Create
   a Diwali campaign for premium customers"*, review the AI-drafted message +
   recommended channel, then **Create & Launch**.
5. Behind the scenes, `channel-simulator` starts firing delivery/open/click
   callbacks over the next ~10–30 seconds.
6. **Analytics** — refresh after a few seconds to see delivered/opened/clicked
   numbers update; drill into a specific campaign from the dropdown.
7. **AI Command Center** — describe a goal in one prompt (e.g. *"Increase
   revenue from inactive users"*) and the agent builds the segment + campaign
   + channel recommendation in one go, with a **Launch this campaign** button.

---

## 8. Environment variable reference

### `backend/crm-core/.env`
| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/xenoreach` | Postgres connection (Neon-compatible) |
| `DATABASE_USERNAME` / `DATABASE_PASSWORD` | `postgres` / `postgres` | DB credentials |
| `JWT_SECRET` | (placeholder) | **Change in production** — HMAC secret for session JWTs |
| `JWT_EXPIRATION_MS` | `86400000` | Session length (24h) |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS — set to your frontend URL |
| `CHANNEL_SIMULATOR_URL` | `http://localhost:8081` | Internal call to channel-simulator |
| `AI_PROVIDER` | `mock` | `mock` \| `gemini` \| `openai` |
| `GEMINI_API_KEY` / `GEMINI_MODEL` | — / `gemini-1.5-flash` | Gemini config |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | — / `gpt-4o-mini` | OpenAI config |
| `FIREBASE_ENABLED` | `false` | `true` to verify ID tokens via Admin SDK |
| `FIREBASE_CREDENTIALS_BASE64` | — | Base64 service-account JSON (see §5c) |

### `backend/channel-simulator/.env`
| Variable | Default | Description |
|---|---|---|
| `CRM_CORE_URL` | `http://localhost:8080` | Where to POST callbacks |
| `SIM_MIN_DELAY_SECONDS` / `SIM_MAX_DELAY_SECONDS` | `1` / `10` | Delay range per stage |
| `SIM_FAILURE_RATE` | `0.05` | Probability a send fails |
| `SIM_OPEN_RATE` | `0.65` | Probability a delivered message is opened |
| `SIM_CLICK_RATE` | `0.35` | Probability an opened message is clicked |
| `SIM_CONVERSION_RATE` | `0.20` | Probability a clicked message converts |

### `frontend/.env`
| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | crm-core URL |
| `VITE_FIREBASE_API_KEY` / `_AUTH_DOMAIN` / `_PROJECT_ID` / `_APP_ID` | — | Firebase Web config (§5b); leave blank to use dev sign-in |

---

## 9. Segment rule format

Segments are stored as JSON rule trees and evaluated live as JPA
specifications:

```json
{
  "operator": "AND",
  "conditions": [
    { "field": "totalSpend", "operator": ">", "value": 5000 },
    { "field": "inactiveDays", "operator": ">", "value": 60 }
  ]
}
```

Supported fields: `totalSpend`, `age`, `city`, `gender`, `inactiveDays` (days
since last order), `lastOrderDate`. Groups can nest arbitrarily for AND/OR
combinations.

---

## 10. Deployment

- **Frontend** → Vercel/Netlify: `bun run build`, set `VITE_API_BASE_URL` and
  `VITE_FIREBASE_*` as build-time env vars, add the deployed domain to
  Firebase's Authorized domains.
- **crm-core / channel-simulator** → Railway/Render, one service per
  Dockerfile. Set `DATABASE_URL` to your Neon Postgres, `CHANNEL_SIMULATOR_URL`
  / `CRM_CORE_URL` to each other's public URLs, `ALLOWED_ORIGINS` to your
  frontend domain, and `FIREBASE_ENABLED=true` + `FIREBASE_CREDENTIALS_BASE64`.
- **Database** → Neon Postgres (Flyway migrates automatically on boot).

---

## 11. Troubleshooting

- **"Could not reach the XenoReach API"** — check `crm-core` is running and
  `VITE_API_BASE_URL` matches its port; check `ALLOWED_ORIGINS` includes the
  frontend's origin (CORS).
- **Google popup opens then errors** — confirm the Firebase project has
  Google sign-in enabled and `localhost` is an authorized domain (§5a).
- **Segment preview always shows 0** — make sure Postgres was seeded (Flyway
  `V2__seed_data.sql` runs automatically); check rule values/types match the
  field (e.g. `totalSpend` expects a number).
- **Campaign launch fails with "no matching customers"** — broaden the
  segment's rules; an empty audience cannot be launched.
