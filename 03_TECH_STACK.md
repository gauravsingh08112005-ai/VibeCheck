# VibeCheck Rooms: Best Tech Stack and Build Guide (for Antigravity)

**Version:** 1.0  |  **Date:** 25 Oct 2026
**Read with:** `01_PRD.md` (requirements) and `02_DESIGN.md` (UI spec).

---

## 1. Verdict

Your synopsis stack (React + Vite + Tailwind → Express → Supabase Postgres/Auth, hosted on Vercel / Render / Supabase) is **the right choice**. It is free, widely documented (so AI agents write it well), and it matches the three-tier architecture your report already describes. Keep it. Only the **versions and a few details** need updating, because some of the synopsis choices are now out of date.

### 1.1 What to change from the synopsis

| Item | Synopsis | Use instead | Reason (researched Oct 2026) |
|------|----------|-------------|------------------------------|
| Node.js | 20 LTS | **24 LTS** | Node 20 hit end-of-life on 30 Apr 2026: no security patches. Node 24 is supported to Apr 2028. (Node 26 becomes LTS on 28 Oct 2026, but 24 is the safer, better-supported pick for a 31 Oct deadline.) |
| React | 18 | **19.2.x** | Current stable line; default in modern Vite templates. |
| Tailwind | (unspecified) | **v4** with `@tailwindcss/vite` | CSS-first config (`@theme`), no PostCSS or `tailwind.config.js`. Default for new projects. |
| Supabase keys | anon + service_role | **Publishable** `sb_publishable_…` (client) and **Secret** `sb_secret_…` (API only) | Supabase is deprecating the legacy keys by end of 2026. Legacy keys still work today, but start on the new ones. |
| Language | JavaScript | **TypeScript** (recommended) | Types let the agent catch its own mistakes (wrong field names, wrong payloads) before you do. Report can say "JavaScript/TypeScript". |
| Server state | not specified | **TanStack Query** | Gives 20 s polling, caching, retries and loading/error states in a few lines. |
| Validation | not specified | **Zod** | One schema validates API input; the same shapes can be shared with the client. |
| Check-in save | "single transaction" | **Postgres function (RPC)** | `supabase-js` cannot run multi-statement transactions; an RPC makes check-in + songs atomic. |

> Pin exact versions when you install (run `npm view <pkg> version` or let `npm install` write them to `package-lock.json`). Do not hand-type version numbers from memory.

---

## 2. Final stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Language | TypeScript (strict) on client and server | `strict: true`, no `any` |
| Runtime | Node.js **24 LTS** | Set `"engines": { "node": ">=24" }` and `.nvmrc` = `24` |
| Package manager | **npm** with workspaces | Simplest on Windows; agent-friendly |
| **Frontend** | React 19 + **Vite** | SPA, no SSR needed |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | Tokens from `02_DESIGN.md` |
| Routing | React Router v7 (declarative/library mode) | Routes in the PRD and design doc |
| Server state | TanStack Query v5 | `refetchInterval: 20000`, pause when tab hidden |
| Forms | React Hook Form + Zod resolver | Validation mirrors server rules |
| Charts | Recharts | Mood-mix bar chart |
| Icons | lucide-react | |
| Auth (client) | `@supabase/supabase-js` | Sign-in/up/out + session only |
| **Backend** | **Express 5** | Native async error handling |
| Backend libs | `cors`, `helmet`, `express-rate-limit`, `zod`, `dotenv` (dev only), `pino` + `pino-http` (logs) | |
| Auth (server) | Verify JWT with `supabase.auth.getUser(token)` | Simple and always correct; optional later optimisation: local JWKS check with `jose` |
| **Database** | Supabase **PostgreSQL** | SQL migrations in `/supabase/migrations`, seed in `/supabase/seed.sql` |
| DB access | `supabase-js` with the **secret key** on the server | Service-side only, bypasses RLS; the API does the authorisation |
| Testing | **Vitest** (unit + API), **Supertest** (HTTP), **Playwright** (1-2 end-to-end smoke tests, optional) | Vibe engine must be unit tested |
| Lint/format | ESLint + Prettier | |
| CI/CD | GitHub → Vercel (client) and GitHub → Render (API) | Auto-deploy on push to `main` |
| Uptime | UptimeRobot (hits `/api/health` every 5 min) + GitHub Actions cron (pings Supabase) | See Section 7 |

**Cost:** Rs. 0 on Vercel Hobby, Render Free, Supabase Free, GitHub Free. Free-plan limits can change; recheck before the viva.

---

## 3. Architecture (matches your report's three tiers)

```
Browser (React 19 SPA on Vercel)
   │  HTTPS (Bearer JWT)                      ┌─ Supabase Auth (sign-in, JWT)
   ▼                                          │
Express 5 REST API (Render)  ──────────────── ┤
   │  supabase-js + secret key, TLS           └─ PostgreSQL (5 tables + RPC + RLS)
   ▼
```

**Rules of the architecture (important for the agent):**
1. The browser talks to **Supabase only for auth** (sign up, log in, log out, session). **All app data goes through the Express API.**
2. The browser never sees the secret key. Only the publishable key and project URL are in client env vars.
3. Every API route: authenticate → validate (Zod) → authorise (membership/role) → act → respond.
4. Business rules (vibe score, 3-song limit, 24 h window, tie-break) live **only on the server** in a pure, unit-tested module.
5. Database constraints (CHECK, UNIQUE, FK, cascade) are the last line of defence; RLS is enabled with deny-by-default.

### 3.1 Request flow: posting a check-in
1. `useMutation` → `POST /api/rooms/:id/checkins` with the Bearer token.
2. `requireAuth` middleware calls `supabase.auth.getUser(token)` → attaches `req.user`.
3. `requireRoomMember` loads the membership row; 403 if missing; 409 `ROOM_CLOSED` if the room is inactive.
4. Zod validates the body (mood enum, energy 1-5, note ≤ 80, ≤ 3 songs, http/https links).
5. API calls RPC `create_checkin_with_songs` (atomic).
6. `vibeService.compute(roomId)` reads each current member's latest check-in within 24 h → score, label, dominant, mix.
7. Response returns the check-in and fresh vibe; client invalidates `['vibe', id]` and `['playlist', id]`.

### 3.2 Vibe engine design
- `server/src/modules/vibe/vibe.ts`: **pure functions** (`scoreFor(mood)`, `compute(checkins, now)`, `labelFor(score)`). No DB inside. Easy to unit test with the PRD worked example (315/4 → 79).
- `vibe.service.ts` fetches rows and calls the pure functions.
- Fetch latest-per-member in SQL (`select distinct on (user_id) … order by user_id, created_at desc`) filtered by `created_at > now() - interval '24 hours'` and restricted to current members.

---

## 4. Repository structure

```
vibecheck-rooms/
├─ AGENTS.md                      # Always-on rules for Antigravity (Section 8.2)
├─ README.md                      # Setup, demo logins, deploy URLs, screenshots
├─ package.json                   # npm workspaces: ["client", "server"]
├─ .nvmrc                         # 24
├─ .gitignore                     # .env*, node_modules, dist
├─ docs/
│  ├─ 01_PRD.md
│  ├─ 02_DESIGN.md
│  └─ 03_TECH_STACK.md
├─ .agents/
│  └─ workflows/                  # Optional slash-command workflows (Section 8.4)
├─ supabase/
│  ├─ migrations/
│  │  ├─ 0001_schema.sql          # tables, constraints, indexes
│  │  ├─ 0002_profile_trigger.sql # auth.users → profiles
│  │  ├─ 0003_rls.sql             # enable RLS, minimal policies
│  │  └─ 0004_checkin_rpc.sql     # create_checkin_with_songs()
│  └─ seed.sql                    # demo room (timestamps relative to now())
├─ client/                        # Vercel
│  ├─ index.html
│  ├─ vite.config.ts              # react() + tailwindcss()
│  ├─ vercel.json                 # SPA rewrite to /index.html
│  ├─ .env.example
│  └─ src/
│     ├─ main.tsx, App.tsx, index.css   # index.css holds the @theme tokens
│     ├─ lib/ (supabase.ts, api.ts, moods.ts, queryClient.ts)
│     ├─ hooks/ (useAuth, useRoomVibe, usePlaylist, …)
│     ├─ components/ (ui/ … , room/ … , admin/ …)
│     ├─ pages/ (Landing, Rooms, Dashboard, Members, Playlist, History, Admin, NotFound, Forbidden)
│     └─ types/ (api.ts)
└─ server/                        # Render
   ├─ render.yaml                 # optional blueprint
   ├─ .env.example
   └─ src/
      ├─ index.ts                 # listen on process.env.PORT
      ├─ app.ts                   # express app (exported for Supertest)
      ├─ config/ (env.ts with Zod-validated env, moods.ts)
      ├─ middleware/ (requireAuth, requireRoomMember, requireAdmin, validate, errorHandler, rateLimit)
      ├─ modules/
      │  ├─ rooms/ (routes, service, schemas)
      │  ├─ checkins/ (routes, service, schemas)
      │  ├─ vibe/ (vibe.ts, vibe.service.ts, routes, vibe.test.ts)
      │  ├─ playlist/
      │  └─ admin/
      └─ lib/ (supabase.ts, roomCode.ts, errors.ts)
```

---

## 5. Environment variables

| Where | Variable | Value / notes |
|-------|----------|---------------|
| client (Vercel) | `VITE_SUPABASE_URL` | `https://<ref>.supabase.co` |
| client (Vercel) | `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` (safe to expose) |
| client (Vercel) | `VITE_API_URL` | `https://<your-api>.onrender.com` |
| server (Render) | `SUPABASE_URL` | same project URL |
| server (Render) | `SUPABASE_SECRET_KEY` | `sb_secret_…` **never in client or Git** |
| server (Render) | `CORS_ORIGINS` | Comma-separated: your `*.vercel.app` URL + `http://localhost:5173` |
| server (Render) | `NODE_ENV` | `production` |
| server (Render) | `NODE_VERSION` | `24` (pins the runtime on Render) |
| server (Render) | `PORT` | Provided by Render; read it, never hard-code |

Commit `.env.example` files only. The server must **fail fast at startup** if a required variable is missing (Zod-validated `env.ts`).

---

## 6. Security checklist (maps to the PRD and your report)

- [ ] `helmet()` on, `cors({ origin: allowList })`, `express.json({ limit: '10kb' })`.
- [ ] `express-rate-limit`: global limit plus a stricter one on `/api/rooms/join` (stops code guessing). Set `app.set('trust proxy', 1)` on Render so the limiter sees real client IPs.
- [ ] Every protected route runs `requireAuth`; every `/api/rooms/:id/*` route runs `requireRoomMember`; moderation routes run `requireAdmin` (reads `room_members.role`, never trusts the client).
- [ ] Room codes generated with `crypto.randomInt` from the alphabet `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`, retry on unique-violation.
- [ ] Zod validation on every body, param and query; reject unknown fields (`.strict()`).
- [ ] Song links: only `http:` / `https:` accepted; rendered with `rel="noopener noreferrer" target="_blank"`. Never render user text with `dangerouslySetInnerHTML`.
- [ ] Generic error responses; log details server-side only (no tokens or emails in logs).
- [ ] RLS enabled on all tables; `EXECUTE` on the check-in RPC revoked from `anon` and `authenticated`.
- [ ] Secret key only in Render env; `.env` in `.gitignore`; run `git log -p | grep sb_secret` before submitting.

---

## 7. Deployment runbook (do in this order)

**1. Supabase**
- Create a project (nearest region, e.g. Mumbai if available). Run the four migrations, then `seed.sql` (SQL editor or Supabase CLI).
- Auth settings: enable email sign-up. For the demo, turn **off** "Confirm email" so reviewers can register instantly (document this choice in the report).
- Copy the project URL, publishable key and secret key (Settings → API Keys).
- Create the demo users through Supabase Auth (admin API or dashboard) so the seed can reference their IDs.

**2. Render (API)**
- New Web Service from the GitHub repo, **root directory `server`**.
- Build: `npm ci && npm run build`; Start: `npm start` (runs `node dist/index.js`).
- Health check path: `/api/health`.
- Set env vars from Section 5. After the first deploy, copy the `onrender.com` URL.

**3. Vercel (client)**
- Import the repo, **root directory `client`**, framework preset Vite.
- Set the three `VITE_*` variables. `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` so React Router deep links work.
- Copy the production URL and put it into Render's `CORS_ORIGINS`, then redeploy the API.

**4. Keep-alives (important on free plans)**
- Render free services sleep after ~15 min idle. Add an **UptimeRobot** monitor on `https://<api>/api/health` every 5 min.
- Supabase free projects pause after about a week of inactivity. Add a **GitHub Actions** scheduled workflow (daily) that calls your API's `/api/health/db`-style endpoint or a cheap Supabase REST query. Add that endpoint (`GET /api/health` can optionally run `select 1`).
- Before the demo, open the site once to wake everything.

**5. Smoke test on the live URL (from your phone):** register → create room → post check-in → see score → open admin as the demo admin → regenerate code.

---

## 8. How to work in Google Antigravity

### 8.1 Concepts (verified in Antigravity docs and community guides, Oct 2026)
- **Rules:** persistent, always-on instructions. Antigravity reads **`AGENTS.md`** automatically (supported since IDE 1.20.5) and its own `GEMINI.md` and `.agents/rules/`. If both exist, `GEMINI.md` takes precedence in Antigravity. **Each rules or workflow file has a limit of 12,000 characters**, so keep them short and put the long material in `/docs`.
- **Skills:** `SKILL.md` folders in `.agents/skills/<name>/`, loaded on demand by description. Optional for this project.
- **Workflows:** user-triggered slash commands stored in `.agents/workflows/`. Useful for repeated chores such as "/verify".
- Antigravity is agent-first: you give a task, the agent plans, edits, runs the terminal and can verify in the browser, and you review what it produced. Prefer **Planning mode** with a strong model for each phase, and review the agent's plan before it edits code. Exact UI labels may have changed, so use the in-app settings to confirm.

### 8.2 `AGENTS.md` (copy to the repo root; about 4,000 characters)

````markdown
# VibeCheck Rooms: Agent Rules

## Source of truth
Read these before coding and follow them over your own assumptions:
- docs/01_PRD.md (requirements, business rules, API contract)
- docs/02_DESIGN.md (tokens, components, pages)
- docs/03_TECH_STACK.md (stack, structure, security, deploy)
If something is ambiguous or conflicts, STOP and ask. Do not invent features.

## Stack (do not substitute)
- Node 24 LTS, TypeScript strict, npm workspaces (`client`, `server`).
- Client: React 19, Vite, Tailwind CSS v4 (CSS-first @theme, no tailwind.config.js), React Router v7, TanStack Query v5, React Hook Form + Zod, Recharts, lucide-react.
- Server: Express 5, Zod, helmet, cors, express-rate-limit, pino.
- Data: Supabase Postgres + Supabase Auth. SQL migrations in `supabase/migrations`.
- Tests: Vitest, Supertest. Playwright only for 1-2 smoke tests.

## Architecture rules
1. The browser uses Supabase ONLY for auth. All app data goes through the Express API.
2. Never put the Supabase secret key in client code, logs or Git. Client uses the publishable key only.
3. Every API route: authenticate -> validate with Zod (.strict) -> authorise (membership/role from DB) -> act -> respond.
4. The vibe score logic lives in a pure module `server/src/modules/vibe/vibe.ts` and must have unit tests including the PRD example (315/4 -> 79, dominant chill, avg energy 3.8).
5. Check-in + songs are saved with the Postgres RPC `create_checkin_with_songs` (atomic).
6. Use the error format and codes from PRD section 6. Never leak stack traces.
7. Moods and their colours come from one shared constant; mood SCORES exist only on the server.

## Code style
- No `any`. No dead code. No commented-out blocks. Small files, named exports.
- Validate env with Zod at startup; fail fast.
- Every screen has loading, empty and error states (see design doc section 6).
- Accessible by default: labels, focus states, aria-live for toasts/score, reduced-motion support.
- Do not use localStorage for auth tokens manually; use the Supabase client session.

## Workflow rules
- Work in the phases of docs/03_TECH_STACK.md section 8.3. One phase per task. Do not start the next phase.
- Before editing: show a short plan. After editing: run lint, type-check and tests, fix failures, then summarise what changed and what to verify.
- Commit-sized changes. Never delete or rewrite files outside the current phase without asking.
- Install only packages listed in the stack; ask before adding anything else.
- Never run destructive DB commands (drop, truncate) without explicit approval.

## Definition of done (per phase)
Type-check passes, tests pass, no console errors, UI matches docs/02_DESIGN.md at 360px and 1280px, requirements for that phase in docs/01_PRD.md are met.
````

### 8.3 Build phases (paste one prompt per Antigravity task)

Open the repo folder in Antigravity, add the three files to `/docs` and `AGENTS.md` to the root, then run the phases **in order**. Review the plan and diff each time, commit, and start a **new task** for the next phase so the context stays clean.

**Phase 0: Scaffold** (25 Oct)
> Read AGENTS.md and the three docs in /docs. Create the monorepo from docs/03_TECH_STACK.md section 4: npm workspaces `client` (Vite + React 19 + TS + Tailwind v4 with the @theme tokens from docs/02_DESIGN.md section 2.8) and `server` (Express 5 + TS, `app.ts` + `index.ts`, Zod env validation, helmet, cors allow-list, `/api/health`). Add ESLint, Prettier, Vitest, Supertest, `.env.example` files, `.gitignore`, `.nvmrc`. Do not build features yet. Verify `npm run dev` for both apps and `npm test` run clean, then summarise.

**Phase 1: Database** (25 Oct)
> Create the four SQL migrations and `seed.sql` exactly per docs/01_PRD.md sections 7 and 10 (tables, constraints, indexes, profile trigger, RLS deny-by-default, `create_checkin_with_songs` RPC with revoked execute for anon/authenticated). Seed timestamps relative to now(). Explain how I run them in Supabase and how to create the demo auth users. Do not touch application code.

**Phase 2: Auth** (25 Oct)
> Implement FR-A1 to FR-A6. Client: Supabase client, `useAuth`, protected route, the Landing page shell and the Login/Sign-up modal per docs/02_DESIGN.md 5.1-5.2. Server: `requireAuth` using `supabase.auth.getUser`, plus tests for 401. Include "Try the demo room".

**Phase 3: Rooms** (26 Oct)
> Implement FR-R1 to FR-R6: server routes create/join/list/details with the code generator, 409/404 rules and tests; client Rooms list, Create and Join modals, Copy code. Follow the API shapes in PRD section 8.

**Phase 4: Check-ins** (26 Oct)
> Implement FR-C1 to FR-C7: Zod schemas, `POST /api/rooms/:id/checkins` via the RPC, delete rules, and the client check-in form (MoodChip, EnergyDots, note counter, SongForm, max 3). Write tests for every validation row in PRD section 6.

**Phase 5: Vibe engine and dashboard** (27 Oct)
> Implement FR-V1 to FR-V5. First write `vibe.ts` pure functions and unit tests (PRD 5.2-5.4 including tie-break, 24 h window, empty room). Then the `/vibe` and `/playlist` routes and the dashboard per docs/02_DESIGN.md 5.4 with TanStack Query polling every 20 s (paused when the tab is hidden), Refresh button, Recharts mood-mix chart, Latest moods and Playlist cards.

**Phase 6: Admin and history** (28 Oct)
> Implement FR-M1 to FR-M6 and FR-V7: `requireAdmin`, stats, remove member (also deletes their check-ins), delete check-in, regenerate code, close room, admin panel page, history page, 403 page. Write role tests: member gets 403 on every admin route, non-member gets 403 on reads, no token gets 401.

**Phase 7: Polish and QA** (28 Oct)
> Go through docs/02_DESIGN.md section 9 using the browser at 360, 768 and 1280 px. Add the ServerWakeBanner, empty/error/loading states, reduced-motion handling, accessibility fixes. Report any gap against the PRD acceptance checklist (section 12).

**Phase 8: Deploy** (29 Oct)
> Prepare deployment per docs/03_TECH_STACK.md section 7: `render.yaml`, `vercel.json`, README with demo logins and env tables, GitHub Actions keep-alive workflow, and a pre-deploy checklist for secrets. Do not add real secrets to any file.

### 8.4 Optional workflow: `/verify`
Create `.agents/workflows/verify.md` (keep it under 12,000 characters):
```markdown
# Verify
1. Run `npm run lint`, `npm run typecheck` and `npm test` in the repo root. Fix failures.
2. Start both apps, open the client in the browser and run through: login, post a check-in, see the score update.
3. Check the console and network tab for errors.
4. Report pass/fail per item against docs/01_PRD.md section 12.
```

### 8.5 Tips for good results
- **One phase = one task.** Long mixed tasks make agents drift.
- **Make the agent plan first** and approve it. Reject plans that add libraries or features not in the docs.
- **Ask for verification, not just code:** "run the tests and show me the output".
- **Commit after every green phase** (`git commit`) so you can roll back a bad run.
- **Never paste real keys into prompts or chat.** Put them in `.env` files that are git-ignored.
- If the agent disagrees with the docs, change the doc first, then re-run the task. Docs are the source of truth.

---

## 9. Alternatives considered (and why not)

| Option | Verdict |
|--------|---------|
| Next.js full-stack | Fewer moving parts, but your report and synopsis commit to a separate API tier on Render; changing it means rewriting architecture sections and diagrams. |
| Supabase only (no Express; client + RLS + Edge Functions) | Cheapest and fastest, but removes the REST API tier your marks depend on. Keep Express. |
| Firebase | Not relational; your ERD, constraints and joins would not apply. |
| Prisma / Drizzle ORM | Good tools, but one more thing to learn and deploy; `supabase-js` + SQL migrations is enough for five tables. |
| WebSockets / Supabase Realtime | Out of scope per synopsis; polling every 20 s is simpler and fine for 2-10 members. |
| Node 26 | Becomes LTS on 28 Oct 2026; too new to rely on three days before submission. |
| Create React App | Deprecated; use Vite. |

---

## 10. Risks and mitigations

| Risk | Mitigation |
|------|-----------|
| Render cold start (~1 min) during the viva | UptimeRobot ping + open the site 5 minutes before; ServerWakeBanner in the UI |
| Supabase project paused | Daily keep-alive; unpause from the dashboard if needed |
| Only 6 days left | Follow the compressed plan in PRD section 11; cut order is defined there |
| Agent adds unwanted libraries or features | `AGENTS.md` stack lock + "ask before adding" rule; review each plan |
| Secret key leaked | Server-only env; check Git history; rotate keys in Supabase if exposed |
| Free-plan terms change | Report notes plan limits "as of Oct 2026"; architecture is provider-portable |
| Email confirmation blocks demo sign-ups | Disable confirm-email for the demo project, or use the seeded demo accounts |

---

## 11. Report updates to make (so the synopsis matches the build)

1. Section 2.1 / 8.2: Node.js **24 LTS**, React **19**, Tailwind **v4**, TypeScript, TanStack Query, Zod, Express 5.
2. Section 3.5: mention the Supabase **publishable / secret** keys instead of anon / service-role.
3. Section 3.3 API table: add `GET /api/rooms/:id/checkins` (history).
4. Section 7: note the `create_checkin_with_songs` function that makes the check-in transaction atomic.
5. Section 2.1.4 (Scheduling): update to the actual dates you built it.
