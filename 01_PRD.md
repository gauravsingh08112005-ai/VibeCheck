# VibeCheck Rooms: Product Requirements Document (PRD)

**Version:** 1.0  |  **Date:** 25 Oct 2026  |  **Owner:** Gaurav Singh (BCA-508 Minor Project, IMS Noida / CCSU Meerut)
**Audience:** The coding agent (Google Antigravity) and the developer. Treat this file as the source of truth for *what* to build. See `02_DESIGN.md` for *how it looks* and `03_TECH_STACK.md` for *how it is built*.

---

## 1. Product summary

**One-liner:** A private room where friends post a mood, an energy level and up to three songs, and instantly see the group's combined vibe and a shared playlist.

**Core loop (must feel instant):**
1. Create a room → get a 6-character code → friends join with the code.
2. Each member posts a check-in: 1 mood (of 8) + energy (1-5) + optional note (≤80 chars) + 0-3 songs.
3. The dashboard shows the **Group Vibe Score (0-100)**, label, dominant mood, mood-mix chart, latest moods and the shared playlist.
4. A room admin can moderate: remove members, delete check-ins, regenerate the code, close the room.

**Positioning:** A social/entertainment tool. The vibe score is a fun, self-reported indicator, **not** a medical or psychological measurement. This disclaimer must appear in the UI footer and on the "How the score works" panel.

### 1.1 Goals
- G1. Secure sign-up/login and private rooms joined by code.
- G2. Post a check-in in under 15 seconds.
- G3. Transparent, formula-based vibe score (the formula is shown to users).
- G4. Shared playlist + mood-mix chart derived from all members' data.
- G5. Role-based moderation (Admin vs Member) enforced on the server.
- G6. Permanent storage in PostgreSQL with proper keys and constraints.
- G7. Live public HTTPS deployment at Rs. 0 cost.

### 1.2 Non-goals (out of scope for this version)
Audio streaming or music-API integration, WebSockets/real-time push, AI mood analysis, native mobile app, payments, push notifications, in-app chat.

---

## 2. Decisions that refine the synopsis (read first)

The synopsis left a few things open or out of date. The agent must follow these decisions.

| # | Topic | Decision | Why |
|---|-------|----------|-----|
| D1 | Runtime | **Node.js 24 LTS**, not Node 20 | Node 20 reached end-of-life on 30 Apr 2026 and gets no security patches. |
| D2 | React version | **React 19.2**, not 18 | React 19 is the current standard; Vite templates target it. |
| D3 | Tailwind | **Tailwind CSS v4** (CSS-first `@theme`, no `tailwind.config.js`) | Default for new projects in 2026. |
| D4 | Supabase keys | Use **publishable** (`sb_publishable_...`) in the client and **secret** (`sb_secret_...`) on the API | Supabase is deprecating `anon` / `service_role` by end of 2026. |
| D5 | Multiple rooms | The data model and API allow a user to be in **many rooms**. UI: if the user has exactly 1 room, open it directly; otherwise show a simple room list. | The synopsis has `GET /api/rooms/me` (a list) but also lists multi-room under future scope. This supports both without extra work. |
| D6 | "Today" | Everywhere the UI says "today" it means the **rolling last 24 hours** (same window as the vibe score). | Keeps UI and formula consistent. |
| D7 | Removing a member | Removing a member **also deletes that member's check-ins (and songs) in that room**. | Avoids orphan data and keeps vibe/playlist queries simple. |
| D8 | Song moderation | Admin deletes a check-in to remove its songs (no separate song-delete in MVP). Optional stretch: `DELETE /api/songs/:id`. | Matches the 5-table design. |
| D9 | History page | A paginated list of the room's check-ins, newest first, 20 per page. Needs `GET /api/rooms/:id/checkins`. | The dashboard mockup has a "History" nav item the synopsis never specified. |
| D10 | Admin | Exactly **one admin per room** (the creator) in MVP. The admin cannot remove themselves. | Simplest correct role model. |
| D11 | Schedule | The original plan (coding 7-23 Oct, review 24 Oct) has passed. Use the compressed plan in Section 11 for the final submission on **31 Oct 2026**. | Today is 25 Oct 2026. |

---

## 3. Users and roles

| Role | Who | Can do |
|------|-----|--------|
| Visitor | Not logged in | See landing page, open login/sign-up, try the demo room |
| Member | Registered user in a room | Create/join rooms, post check-ins, view vibe/playlist/chart/history, delete **own** check-ins |
| Room Admin | Creator of a room (also a Member) | Everything a Member can, plus: view stats, delete **any** check-in, remove members, regenerate code, close room |
| System | Vibe engine + Supabase Auth | Verify sessions, calculate the vibe score |

**Primary personas**
- *Rahul, 20, hostel roommate:* wants a 10-second daily check-in with friends, no onboarding.
- *Gaurav, 21, room admin:* creates the room, shares the code, removes spam, closes the room after the semester.
- *Examiner / reviewer:* opens the live link, clicks "Try the demo room", and must see every feature within 2 minutes.

---

## 4. Functional requirements

Priority: **P0** = must ship for submission, **P1** = should ship, **P2** = stretch.

### 4.1 Authentication
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-A1 | Sign up with display name, email and password via Supabase Auth. A `profiles` row is created automatically (DB trigger). | P0 |
| FR-A2 | Log in with email + password; session persisted by Supabase client; JWT sent as `Authorization: Bearer <token>` to the API. | P0 |
| FR-A3 | Log out clears the session and returns to the landing page. | P0 |
| FR-A4 | Protected routes redirect unauthenticated users to the landing page with the login modal open. | P0 |
| FR-A5 | "Try the demo room" button signs in as a seeded demo user and opens the seeded demo room. | P0 |
| FR-A6 | Inline validation: valid email, password ≥ 8 characters, name 1-40 characters. Errors in plain language. | P0 |

**Acceptance:** wrong password shows "That email or password doesn't look right." and never reveals which one was wrong.

### 4.2 Rooms
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-R1 | Create a room with a name (1-40 chars). Server generates a unique 6-character uppercase code (A-Z and 2-9, excluding look-alikes `0 O 1 I`). Creator becomes `admin`. | P0 |
| FR-R2 | Join a room by code (case-insensitive input, stored uppercase). New member gets role `member`. | P0 |
| FR-R3 | Joining a room you are already in returns **409**. Unknown or closed room returns **404**. | P0 |
| FR-R4 | List my rooms (`GET /api/rooms/me`) with role and member count. | P0 |
| FR-R5 | Room details with member list (name, role, joined date, avatar colour). | P0 |
| FR-R6 | Room code can be copied with one click (copy button shows "Copied" for 2 s). | P0 |

### 4.3 Mood check-in (core transaction)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-C1 | One check-in = mood (1 of 8) + energy (integer 1-5) + optional note (≤80) + 0-3 songs (title, artist required; link optional). | P0 |
| FR-C2 | Only room members can post; room must be active. | P0 |
| FR-C3 | Check-in row and its song rows are saved **in one database transaction**. | P0 |
| FR-C4 | After posting, the dashboard refreshes and shows the new score, chart and playlist without a page reload. | P0 |
| FR-C5 | A member may post multiple check-ins; only the **latest within 24 h** counts toward the vibe score. | P0 |
| FR-C6 | Delete own check-in (confirmation dialog). Admin may delete any check-in. Songs are deleted with it (cascade). | P0 |
| FR-C7 | Note shows a live counter (`23/80`); song fields show inline errors. "Add another song" disappears at 3 songs. | P0 |

### 4.4 Vibe engine and reports
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-V1 | Compute Group Vibe Score, label, dominant mood, average energy (see Section 5). | P0 |
| FR-V2 | Mood-mix chart: count of members per mood among those counted in the score. | P0 |
| FR-V3 | "Latest moods" list: each member's latest check-in with relative time; members with no check-in show "No check-in yet". | P0 |
| FR-V4 | Shared playlist: all songs in the room, newest first, with title, artist, who added it, optional link icon (opens in a new tab with `rel="noopener noreferrer"`). | P0 |
| FR-V5 | Dashboard auto-refreshes every 20 s and has a manual Refresh button. Pause polling when the tab is hidden. | P0 |
| FR-V6 | "How the score works" panel shows the mood score table and formula. | P1 |
| FR-V7 | History page: paginated check-ins, newest first. | P1 |

### 4.5 Admin moderation
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-M1 | Admin panel is visible and reachable **only** to the room's admin. Others get a 403 page. The server enforces this. | P0 |
| FR-M2 | Stats cards: members, check-ins, songs, active (last 24 h). | P0 |
| FR-M3 | Remove member (confirmation dialog). Also deletes that member's check-ins in the room (D7). | P0 |
| FR-M4 | Delete any check-in from "Recent check-ins". | P0 |
| FR-M5 | Regenerate room code. The old code stops working immediately. | P0 |
| FR-M6 | Close room (confirmation dialog). Closed rooms accept no new check-ins and no new joins; data stays readable to members. | P0 |

---

## 5. Business rules: vibe score logic

### 5.1 Mood scores (fixed, stored in server config)
| Mood | Score | Mood | Score |
|------|-------|------|-------|
| happy | 90 | focused | 65 |
| hyped | 85 | nostalgic | 55 |
| romantic | 80 | stressed | 30 |
| chill | 70 | sad | 20 |

### 5.2 Formulas
- **Counted check-ins:** for each *current member* of the room, take their **single latest** check-in whose `created_at` is within the last 24 hours. Members with none are not counted.
- **Group Vibe Score** = `round( sum(mood scores of counted check-ins) / count of counted check-ins )`. If nothing is counted, score is `null` and the UI shows "No check-ins yet. Be the first!"
- **Average energy** = mean of energy values of counted check-ins, shown to 1 decimal.
- **Dominant mood** = the mood chosen by the most counted members. **Tie-break:** the tied mood whose most recent check-in is newest.
- **Mood mix** = `{ mood: count }` for counted check-ins.

### 5.3 Labels
| Score | Label |
|-------|-------|
| 0-39 | Low vibes |
| 40-64 | Balanced vibes |
| 65-84 | Good vibes |
| 85-100 | Peak vibes |

### 5.4 Worked example (must be a unit test)
Room "Late Night Crew": Rahul chill/3, Aman hyped/5, Rohit happy/4, Gaurav chill/3.
Sum = 70+85+90+70 = 315, 315/4 = 78.75 → **79 (Good vibes)**. Dominant = **chill** (2 of 4). Average energy = 15/4 = **3.8**.

---

## 6. Validation rules and error contract

| Field | Rule | Status |
|-------|------|--------|
| mood | One of: happy, hyped, romantic, chill, focused, nostalgic, stressed, sad | 400 |
| energy | Whole number 1-5 | 400 |
| note | Optional, ≤80 characters (trim whitespace) | 400 |
| songs | 0-3 items; `title` and `artist` required, ≤100 chars each | 400 |
| link | Optional; must start with `http://` or `https://` | 400 |
| room name | 1-40 characters | 400 |
| room code | Exactly 6 letters/digits; room must exist and be active | 404 |
| membership | Cannot join the same room twice | 409 |
| authentication | Valid session token on protected routes | 401 |
| authorisation | Must belong to the room; admin role for moderation routes | 403 |

**Standard error body** (never leak internals or stack traces):
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Energy must be a whole number from 1 to 5.", "fields": { "energy": "Must be 1-5" } } }
```
Codes: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `ALREADY_MEMBER`, `ROOM_CLOSED`, `RATE_LIMITED`, `INTERNAL`.

---

## 7. Data model

Five tables in third normal form. Many-to-many between users and rooms is resolved by `room_members`.

```sql
-- profiles: mirrors auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  email text not null,
  avatar_color text not null default '#8B5CF6',
  created_at timestamptz not null default now()
);

create table rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  room_code char(6) not null unique check (room_code ~ '^[A-Z0-9]{6}$'),
  created_by uuid not null references profiles(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table room_members (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('admin','member')),
  joined_at timestamptz not null default now(),
  unique (room_id, user_id)
);

create table mood_checkins (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  mood text not null check (mood in
    ('happy','hyped','romantic','chill','focused','nostalgic','stressed','sad')),
  energy integer not null check (energy between 1 and 5),
  note text check (note is null or char_length(note) <= 80),
  created_at timestamptz not null default now()
);

create table songs (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid not null references mood_checkins(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  artist text not null check (char_length(artist) between 1 and 100),
  link_url text check (link_url is null or link_url ~* '^https?://'),
  position integer not null check (position between 1 and 3),
  unique (checkin_id, position)
);

-- Indexes on foreign keys and hot paths
create index on room_members (user_id);
create index on room_members (room_id);
create index on mood_checkins (room_id, created_at desc);
create index on mood_checkins (room_id, user_id, created_at desc);
create index on songs (checkin_id);
```

**Also required (agent should add in the migration):**
- Trigger `on_auth_user_created` on `auth.users` → inserts into `profiles` using `raw_user_meta_data->>'display_name'`, the email, and a random avatar colour from the palette in `02_DESIGN.md`.
- Postgres function `create_checkin_with_songs(p_room uuid, p_user uuid, p_mood text, p_energy int, p_note text, p_songs jsonb)` that inserts the check-in and songs atomically (FR-C3). Execute permission only for the API's secret-key role; revoke from `anon` and `authenticated`.
- **Row Level Security enabled on all five tables** as a second line of defence. The API uses the secret key (which bypasses RLS) and does its own authorisation checks. Add only a minimal `profiles` self-read policy; everything else is deny-by-default for `anon`/`authenticated`.

---

## 8. API specification

Base URL: `${VITE_API_URL}`. All routes except health require `Authorization: Bearer <supabase access token>`. JSON in, JSON out. Timestamps are ISO-8601 UTC.

| Method | Endpoint | Purpose | Access | Success |
|--------|----------|---------|--------|---------|
| GET | `/api/health` | Health check (also keeps host awake) | Public | 200 |
| POST | `/api/rooms` | Create room | Member | 201 |
| POST | `/api/rooms/join` | Join by code | Member | 200 |
| GET | `/api/rooms/me` | My rooms | Member | 200 |
| GET | `/api/rooms/:id` | Room details + members | Room member | 200 |
| POST | `/api/rooms/:id/checkins` | Post check-in + songs | Room member | 201 |
| GET | `/api/rooms/:id/checkins?limit=20&before=<iso>` | History (D9) | Room member | 200 |
| GET | `/api/rooms/:id/vibe` | Score, label, dominant, mix, latest moods | Room member | 200 |
| GET | `/api/rooms/:id/playlist?limit=50&offset=0` | Shared playlist | Room member | 200 |
| DELETE | `/api/checkins/:id` | Delete check-in (own, or any as admin) | Owner/Admin | 204 |
| DELETE | `/api/rooms/:id/members/:userId` | Remove member | Admin | 204 |
| POST | `/api/rooms/:id/regenerate-code` | New room code | Admin | 200 |
| PATCH | `/api/rooms/:id/close` | Close room | Admin | 200 |
| GET | `/api/rooms/:id/stats` | Admin stats + recent check-ins | Admin | 200 |

### Key payloads

**POST `/api/rooms`**: request `{ "name": "Late Night Crew" }` → 201
```json
{ "id": "uuid", "name": "Late Night Crew", "roomCode": "K7P2QX", "role": "admin", "isActive": true }
```

**POST `/api/rooms/join`**: request `{ "roomCode": "k7p2qx" }` → 200 `{ "id": "uuid", "name": "...", "role": "member" }`

**POST `/api/rooms/:id/checkins`**: request
```json
{ "mood": "chill", "energy": 3, "note": "Rainy night, lo-fi on",
  "songs": [ { "title": "Blinding Lights", "artist": "The Weeknd", "link": "https://..." } ] }
```
→ 201 `{ "checkin": { "id": "uuid", "mood": "chill", "energy": 3, "note": "...", "createdAt": "..." }, "vibe": { ...same as GET vibe... } }`
(Returning the fresh vibe lets the UI update instantly.)

**GET `/api/rooms/:id/vibe`** → 200
```json
{
  "score": 79, "label": "Good vibes", "dominantMood": "chill", "averageEnergy": 3.8,
  "countedMembers": 4, "totalMembers": 5,
  "moodMix": { "chill": 2, "hyped": 1, "happy": 1 },
  "latestMoods": [
    { "userId": "uuid", "displayName": "Rahul", "avatarColor": "#22D3EE",
      "mood": "chill", "energy": 3, "note": null, "createdAt": "..." },
    { "userId": "uuid", "displayName": "Kavya", "avatarColor": "#8B5CF6", "mood": null }
  ]
}
```
When nobody has checked in: `score: null, label: null, dominantMood: null, moodMix: {}`.

**GET `/api/rooms/:id/playlist`** → 200
```json
{ "total": 12, "songs": [ { "id": "uuid", "title": "Kesariya", "artist": "Arijit Singh",
  "link": null, "addedBy": { "userId": "uuid", "displayName": "Aman", "avatarColor": "#FF4D8D" },
  "createdAt": "..." } ] }
```

**GET `/api/rooms/:id/stats`** (admin) → 200
```json
{ "members": 5, "checkins": 42, "songs": 96, "activeToday": 4,
  "memberRows": [ { "userId": "uuid", "displayName": "Rahul", "role": "member", "joinedAt": "...", "checkinCount": 9 } ],
  "recentCheckins": [ { "id": "uuid", "displayName": "Rahul", "mood": "chill", "createdAt": "..." } ],
  "roomCode": "K7P2QX", "isActive": true }
```

---

## 9. Non-functional requirements

| Area | Requirement |
|------|-------------|
| Performance | Landing page < 2.5 s on 4G. API: check-in < 800 ms, dashboard data < 500 ms with server awake. |
| Cold start | Render free tier sleeps after 15 min idle (first request can take about a minute). The UI must show a friendly "Waking up the server… this can take up to a minute" banner after 4 s of waiting, and retry automatically. |
| Security | HTTPS only; JWT verified on every protected route; membership checked before any read/write; admin role checked server-side; strict input validation; CORS allow-list; Helmet headers; basic rate limiting (e.g. 100 req / 15 min per IP, stricter on join); generic error messages; no secrets in the client or in Git. |
| Privacy | Store only name, email, moods, notes and songs. No tracking, no ads. |
| Accessibility | WCAG 2.1 AA contrast, keyboard operable, visible focus, labels on every input, `aria-live` for toasts and score changes. |
| Responsive | Mobile-first from 360 px width up to desktop. |
| Browsers | Latest two versions of Chrome, Edge, Firefox, Safari. |
| Reliability | Free Supabase projects pause after a week of inactivity: add a keep-alive (see `03_TECH_STACK.md`). |
| Cost | Rs. 0 (Vercel Hobby, Render free, Supabase free, GitHub free). |

---

## 10. Demo seed data

Seed (idempotent) a **demo room** so reviewers see everything in under two minutes.

- Users: Gaurav (admin), Rahul, Aman, Rohit, Kavya (demo password documented in the README, not in the UI).
- Room: **Late Night Crew**, code **K7P2QX**.
- Check-ins within the last 24 h: Rahul chill/3, Aman hyped/5, Rohit happy/4, Gaurav chill/3; Kavya has none → score **79, Good vibes**, dominant chill, energy 3.8.
- Songs: Blinding Lights (The Weeknd), Kesariya (Arijit Singh), Heat Waves (Glass Animals), Tum Hi Ho (Arijit Singh), plus extras to reach ~12 songs.
- Older history rows (outside 24 h) so the History page has content.
- Seed timestamps must be **relative to `now()`**, so the demo never goes stale.
- "Try the demo room" signs in as the demo **Member** (Rahul) by default; document the admin demo login in the README for the admin walkthrough.

---

## 11. Milestones (compressed plan: 25-31 Oct 2026)

| Date | Deliverable |
|------|-------------|
| 25 Oct (today) | Repo + both app skeletons, Supabase project, migrations + seed, auth working end-to-end |
| 26 Oct | Rooms (create/join/list), check-in form + validation, atomic save |
| 27 Oct | Vibe engine (unit-tested), dashboard, chart, playlist, auto-refresh |
| 28 Oct | Admin panel + role tests, history page, polish, responsive pass |
| 29 Oct | Deploy (Supabase → Render → Vercel), CORS, keep-alive, live end-to-end test |
| 30 Oct | Screenshots for the report, update the synopsis/report, demo rehearsal, code freeze |
| 31 Oct | Final presentation and hard-copy submission |

**Cut order if time runs out:** (1) FR-V6 score explainer, (2) FR-V7 history, (3) mood-mix animation polish. Never cut P0 items or the role tests.

---

## 12. Definition of done / acceptance checklist

**Auth:** register, login, logout, protected-route redirect, demo login.
**Rooms:** create returns a unique code; join works; joining twice → 409; bad code → 404; closed room → 404 on join.
**Check-in:** invalid mood/energy/note/songs/link each return 400 with a field message; 4th song rejected; success updates dashboard in < 2 s; check-in and songs saved atomically (simulate a failure: no partial rows).
**Vibe:** worked example in 5.4 passes as a unit test; tie-break test; "no check-ins" state; 24-hour window test; removed member excluded.
**Roles:** a Member calling any admin route gets 403; a non-member reading a room gets 403; a request with no token gets 401; a Member cannot delete another member's check-in.
**Admin:** remove member, delete check-in (songs cascade), regenerate code (old code → 404), close room (new check-in → 409/`ROOM_CLOSED`).
**UI:** loading, empty and error states on every screen; works at 360 px; keyboard-only flow possible.
**Deploy:** public HTTPS link works from a phone; `/api/health` returns 200; no secrets in the repo; `.env.example` present.

---

## 13. Assumptions and open questions

1. Songs are plain text plus an optional link; no music API. (Confirmed by scope.)
2. The vibe score only reflects members who checked in within 24 h; it is not retroactive.
3. D5, D7, D9 and D10 are my recommended defaults. If your mentor wants different behaviour, change them here **before** prompting the agent.
4. The report should say "JavaScript/TypeScript" if you adopt TypeScript (recommended in `03_TECH_STACK.md`).
