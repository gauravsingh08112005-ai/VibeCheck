# VibeCheck Rooms: Design Document

**Version:** 1.0  |  **Date:** 25 Oct 2026
**Read with:** `01_PRD.md` (what to build) and `03_TECH_STACK.md` (how it is built).
**Audience:** The coding agent (Google Antigravity) and the developer. Follow the tokens and component specs exactly so the UI stays consistent across pages.

---

## 1. Design intent

**Personality:** playful, late-night, music-y. Think "friends' group playlist at 11 pm", not "corporate dashboard".
**Feel:** dark theme, big friendly numbers, rounded cards, pill buttons, bright accent colours that map to moods.
**Principles**
1. **One glance = one answer.** The vibe score is the hero of the dashboard.
2. **Under 15 seconds to post.** The check-in form is always visible on the dashboard, with few taps.
3. **Moods are colours.** Each mood has a fixed colour used everywhere (chips, chart, avatars' ring, playlist badges).
4. **Never a dead end.** Every screen has loading, empty and error states with a clear next action.
5. **Calm destructive actions.** Danger actions are pink outlined, never filled, and always confirm.

---

## 2. Design tokens

### 2.1 Colours (dark theme only for MVP)

| Token | Hex | Use |
|-------|-----|-----|
| `--color-bg` | `#0B0B10` | App background |
| `--color-surface` | `#15151D` | Cards, sidebar |
| `--color-surface-2` | `#1E1E29` | Inputs, raised elements, hover |
| `--color-border` | `#2A2A38` | Card and input borders |
| `--color-text` | `#F5F5FA` | Primary text |
| `--color-text-muted` | `#A1A1B5` | Secondary text (min contrast 4.5:1 on surface) |
| `--color-lime` | `#C6FF3D` | Primary action, vibe score numerals, room code |
| `--color-violet` | `#8B5CF6` | Selected nav, secondary accent, focus ring |
| `--color-pink` | `#FF4D8D` | Headline accent, destructive outline, "Hyped" |
| `--color-cyan` | `#22D3EE` | "Chill", info |
| `--color-amber` | `#FFB020` | "Happy", warnings |
| `--color-danger` | `#FF4D8D` | Same as pink; destructive text and borders |
| `--color-success` | `#4ADE80` | Success toasts |

Text on lime, cyan, amber and pink fills is always **`#0B0B10`** (dark) for contrast.

### 2.2 Mood palette (fixed mapping, single source of truth)

| Mood | Colour | Emoji | Score |
|------|--------|-------|-------|
| happy | `#FFB020` | 😊 | 90 |
| hyped | `#FF4D8D` | ⚡ | 85 |
| romantic | `#FB7185` | 💘 | 80 |
| chill | `#22D3EE` | 🌊 | 70 |
| focused | `#8B5CF6` | 🎯 | 65 |
| nostalgic | `#E0A96D` | 📼 | 55 |
| stressed | `#FF7A45` | 😵‍💫 | 30 |
| sad | `#5B8DEF` | 🌧️ | 20 |

Implement as a single `MOODS` constant (`label`, `color`, `emoji`) shared by chips, chart and avatars. Never hard-code mood colours elsewhere. The score values live on the **server**, not the client.

### 2.3 Score label colours
| Label | Colour |
|-------|--------|
| Low vibes | `#5B8DEF` |
| Balanced vibes | `#FFB020` |
| Good vibes | `#C6FF3D` |
| Peak vibes | Gradient `#C6FF3D → #FF4D8D` |

### 2.4 Avatar colours
Initials avatars use one of: `#C6FF3D`, `#22D3EE`, `#FF4D8D`, `#FFB020`, `#8B5CF6`, `#FB7185`. Stored in `profiles.avatar_color`. Dark initials text.

### 2.5 Typography
- **Headings / numerals:** *Bricolage Grotesque* (600-800).
- **Body / UI:** *Plus Jakarta Sans* (400-700).
- Load via Google Fonts with `display=swap` and fallbacks: `system-ui, -apple-system, "Segoe UI", sans-serif`.

| Style | Size / line-height | Weight | Font |
|-------|--------------------|--------|------|
| Display (hero headline, vibe score) | 64-96 px / 1.0 (mobile 48-64) | 800 | Bricolage |
| H1 page title | 28 px / 1.2 | 700 | Bricolage |
| H2 card title | 18 px / 1.3 | 700 | Bricolage |
| Body | 15-16 px / 1.5 | 400-500 | Jakarta |
| Small / meta | 13 px / 1.4 | 500 | Jakarta |
| Micro (chips, badges) | 12 px / 1.2 | 700 | Jakarta |

### 2.6 Shape, spacing, elevation
- **Radius:** cards `20px`, inputs `14px`, chips and buttons `9999px` (pill), modals `24px`.
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48. Card padding 20-24 px. Page gutter 16 px mobile, 32 px desktop.
- **Elevation:** no heavy shadows. Use border + surface contrast. Modal gets `0 24px 80px rgba(0,0,0,.6)` and a `rgba(0,0,0,.6)` backdrop with blur.
- **Focus ring:** 2 px `--color-violet` plus 2 px offset, visible on all interactive elements.

### 2.7 Motion
- Durations: 120 ms (hover), 200 ms (press, toggles), 350 ms (score count-up, chart bars).
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Score count-up on change; bars grow from 0; new playlist rows slide in once.
- **Respect `prefers-reduced-motion`:** disable count-up and slides, keep instant state changes.

### 2.8 Tailwind v4 theme snippet (put in `src/index.css`)

```css
@import "tailwindcss";

@theme {
  --color-bg: #0B0B10;
  --color-surface: #15151D;
  --color-surface-2: #1E1E29;
  --color-border: #2A2A38;
  --color-text: #F5F5FA;
  --color-muted: #A1A1B5;
  --color-lime: #C6FF3D;
  --color-violet: #8B5CF6;
  --color-pink: #FF4D8D;
  --color-cyan: #22D3EE;
  --color-amber: #FFB020;
  --color-success: #4ADE80;

  --font-display: "Bricolage Grotesque", system-ui, sans-serif;
  --font-sans: "Plus Jakarta Sans", system-ui, sans-serif;

  --radius-card: 20px;
  --radius-input: 14px;
}

html { color-scheme: dark; background: var(--color-bg); color: var(--color-text); }
body { font-family: var(--font-sans); }
```

---

## 3. Layout and responsiveness

| Breakpoint | Layout |
|------------|--------|
| < 640 px (mobile) | Single column. Sidebar becomes a **bottom tab bar** (Room, Members, Playlist, History, Admin*). Room name + code in a sticky top bar. |
| 640-1023 px (tablet) | Single column cards, two-up where it fits. Collapsible left rail (icons only). |
| ≥ 1024 px (desktop) | Left sidebar (240 px) + two-column content: left = Group vibe card + Latest moods; right = Your check-in + Shared playlist (matches the approved mockup). |

*Admin tab is rendered only when the user is that room's admin.

Rules: no horizontal page scroll; tables scroll inside their own container; minimum tap target 44 × 44 px; design at 360 px first.

**App shell:** sidebar (logo, room name, code chip with Copy, nav, user menu with Log out), header ("Hey {name}" + room summary + Refresh button), content area.

---

## 4. Component specifications

Build these once in `src/components/ui/` and reuse. Props and states listed so the agent does not invent variants.

| Component | Variants / states | Notes |
|-----------|-------------------|-------|
| **Button** | `primary` (lime fill, dark text), `secondary` (outline, white border), `ghost`, `danger` (pink **outline**), sizes `md`/`lg`; states hover, active, focus, disabled, **loading** (spinner, keeps width) | All pill-shaped. Primary is used at most once per view. |
| **Input / Textarea** | default, focus (violet ring), error (pink border + message below), disabled | Label always above; helper/error text 13 px. Password has Show/Hide toggle. |
| **MoodChip** | unselected (surface-2, muted text), selected (mood colour fill, dark text, emoji), disabled | `role="radio"` inside a `radiogroup`; arrow-key navigation. Grid of 8: 4 × 2 desktop, 2 × 4 mobile. |
| **EnergyDots** | 5 dots, 1-5; filled up to selected value in lime | `role="slider"`-like radiogroup; labelled "Energy 3 of 5"; tap dot or arrow keys. |
| **Avatar** | sizes 28/40; initials on colour | Optional 2 px ring in the member's current mood colour. |
| **Card** | surface bg, 1 px border, radius 20 | Optional title row with right-aligned meta. |
| **VibeScoreCard** | has-data, **empty**, loading skeleton | Big numeral (Display, lime or label colour), label, "Dominant: Chill", "Energy 3.8 / 5", stacked mood-mix bar, "How is this calculated?" link. |
| **MoodMixChart** | Recharts `BarChart` on the dashboard (one bar per mood present, bar colour = mood colour, count labels); compact stacked bar inside VibeScoreCard | Includes a visually hidden data table for screen readers. |
| **LatestMoodRow** | has check-in, **no check-in yet** | Avatar, name, relative time ("10 min ago"), right-aligned mood pill. Optional note below in muted text (truncate 1 line, full on hover/tap). |
| **SongForm** | 0-3 rows; each row = title, artist, optional link | "+ Add song" (hidden at 3), remove (×) per row. Inline errors per field. |
| **SongRow** | default | Colour square = mood colour of the check-in, title (bold), artist (muted), "by {name}", link icon if URL. |
| **Badge** | `ADMIN` (violet fill), `MEMBER` (surface-2), `CLOSED` (pink outline) | 12 px, uppercase. |
| **Modal** | auth, join-with-code, create-room | Focus trap, Esc to close, return focus on close, scroll lock. |
| **ConfirmDialog** | destructive | Title states the exact consequence ("Remove Rahul and delete 9 check-ins?"), buttons: Cancel (secondary) and the action (danger). Default focus on Cancel. |
| **Toast** | success, error, info | Bottom-centre (mobile) / bottom-right (desktop); auto-dismiss 4 s; `aria-live="polite"`. |
| **Skeleton** | block, line, circle | Shimmer; disabled under reduced motion. |
| **EmptyState** | icon/emoji + headline + one sentence + one action | e.g. "No songs yet. Add a song to your next check-in." |
| **ErrorState** | message + Retry button | Plain language; no technical details. |
| **ServerWakeBanner** | shown if an API call exceeds 4 s | "Waking up the server… this can take up to a minute on the free plan." Auto-hides on success. |
| **StatCard** | label + number | Used on the admin panel (Members, Check-ins, Songs, Active today). |
| **DataTable** | desktop table → mobile stacked cards | Used for the admin members list. |

---

## 5. Page specifications

### 5.1 Landing / Home (`/`)
- **Nav (sticky):** logo (two overlapping circles, violet + pink, "vibecheck"), "How it works" anchor, "Log in" text button, "Get started" primary pill.
- **Hero (left):** H1 "What's the vibe" (white) + "today?" (pink); sub-copy "Drop your mood and 3 songs with your friends. See the whole room's vibe score in one tap."; CTAs: **Create a room** (primary) and **Join with code** (secondary).
  - Create a room when logged out → opens the sign-up modal, then continues to create.
  - Join with code → opens an inline code field / modal with a 6-box code input.
- **Preview card (right):** sample "Late Night Crew" room: code chip `K7P2QX`, score **79**, "Good vibes", "Dominant mood: Chill", four mood chips, mini bars. Static, not interactive. Mark with `aria-hidden` or a clear "Example" label.
- **How it works:** 3 step cards (1 Create a room: "Get a 6-character code", 2 Drop your mood: "Pick a mood + up to 3 songs", 3 See the vibe: "Score, mood mix, playlist"). Numbered violet circles.
- **Footer:** disclaimer ("A fun, self-reported indicator, not a medical or psychological measurement.") + "Try the demo room" link.

### 5.2 Login / Sign-up modal (`/login` as a route that renders over the landing page)
- Title "Welcome back" (login) / "Join the vibe" (sign-up). Close (×) button.
- Segmented control tabs: **Log in | Sign up** (selected = violet fill) switching forms without navigation.
- Fields: Name (sign-up only), Email, Password (Show toggle; sign-up shows "8+ characters").
- **Continue** primary full-width button with loading spinner.
- Below: **Try the demo room** (violet text link) and "New here? Sign up takes 20 seconds".
- Errors under each field; auth failures as a single plain message above the button.
- After success: go to the single room, or the room list, or the last visited room.

### 5.3 Rooms list (`/rooms`)
- Header "Your rooms" + buttons **Create room** and **Join with code**.
- Room cards: name, code chip, member count, role badge, "Closed" badge if inactive. Click opens `/room/:id`.
- Empty state: "No rooms yet. Create one or join a friend's room with a code."
- Create room modal: one input (room name, counter `n/40`) → on success show the new code large with a Copy button and "Share this code with friends".

### 5.4 Room dashboard (`/room/:id`): main screen
**Header:** "Hey {name}" (H1), summary "{Room} · {n} members · {k} checked in (last 24 h)", Refresh button (spins while fetching) and "Updated 12 s ago" text.

**Desktop grid (2 columns):**
- **Left column**
  1. **Group Vibe Score card:** label "GROUP VIBE SCORE" (micro, muted), numeral (Display, lime), label ("Good vibes"), "Dominant: Chill", "Energy 3.8 / 5", stacked mood-mix bar with legend. Link "How is this calculated?" opens the explainer drawer (FR-V6).
  2. **Latest moods card:** one `LatestMoodRow` per member, newest first; members without a check-in at the bottom, muted.
- **Right column**
  3. **Your check-in card:** 8 `MoodChip`s, `EnergyDots`, note textarea with live counter, `SongForm`, **Post** primary button (right-aligned). Post is disabled until a mood and energy are chosen. After success: toast "Vibe posted!", form resets, the score animates.
  4. **Shared playlist card:** header with song count ("12 songs"); `SongRow`s newest first; "View all" opens `/room/:id/playlist`. Empty state if none.

**Mobile order:** Your check-in → Group vibe → Latest moods → Playlist (posting comes first on small screens).

**Closed room:** show a pink "This room is closed" banner; the check-in form is replaced by a read-only notice.

### 5.5 Members (`/room/:id/members`)
List of members with avatar, name, role badge, joined date, and last mood pill. Admin sees a link to the admin panel.

### 5.6 Playlist (`/room/:id/playlist`)
Full list of `SongRow`s, newest first, "Load more" button (50 per page). Each row shows who added it and a link icon if available.

### 5.7 History (`/room/:id/history`)
Timeline of check-ins (avatar, name, mood pill, energy dots, note, songs count, time). Own entries show a trash icon (ConfirmDialog). "Load older" button (20 per page).

### 5.8 Admin panel (`/room/:id/admin`)
- **Header:** "Admin panel", violet `ADMIN` badge, room name.
- **Stat cards (4):** Members (cyan numeral), Check-ins (lime), Songs (pink), Active today (amber).
- **Members table** (left, wide): avatar + name, role badge, joined date (e.g. "12 Oct"), check-in count, **Remove** (pink outline pill). The admin's own row has no Remove button.
- **Right column:**
  - **Room code card:** code large in lime, "Regenerate code" secondary button (ConfirmDialog: "The old code will stop working.").
  - **Recent check-ins:** rows like "Rahul · Chill" with a pink "Delete" text button.
  - **Danger zone:** "Close room" pink outline button (ConfirmDialog: "No one will be able to post new check-ins.").
- Non-admins visiting the URL see the **403 page** ("You need to be this room's admin to see this page." + Back to room).

### 5.9 System pages
- **404:** "This page wandered off." + Back home.
- **403:** as above.
- **Session expired:** toast "Please log in again." and open the login modal.

---

## 6. States and microcopy

| Situation | Behaviour / copy |
|-----------|------------------|
| First load of any data | Skeletons shaped like the final card (no spinners on whole pages) |
| Empty vibe | "No check-ins in the last 24 hours. Be the first to drop a vibe!" |
| Empty playlist | "No songs yet. Add a song to your next check-in." |
| Network error | "Couldn't reach the server. Check your connection and try again." + Retry |
| Cold start (> 4 s) | ServerWakeBanner (see Section 4) |
| Join: bad code | "We couldn't find an active room with that code." |
| Join: already in room | "You're already in this room." + link to open it |
| Post: validation | Field-level messages ("Pick a mood to continue", "Song title is required", "Link must start with http:// or https://") |
| Post success | Toast "Vibe posted!" |
| Delete success | Toast "Check-in deleted" |
| Code copied | Button text "Copied" for 2 s |
| Closed room post attempt | "This room is closed, so new check-ins aren't accepted." |

Tone: friendly, short, lowercase-casual where it helps ("Drop your mood"), never blaming the user.

---

## 7. Accessibility checklist
- Contrast ≥ 4.5:1 for body text and ≥ 3:1 for large text and UI borders. Muted text must be tested on `--color-surface`.
- Never rely on colour alone for moods: every mood chip includes the **label text and emoji**.
- Mood chips and energy dots are keyboard operable (arrow keys, Space/Enter) with visible focus.
- Modals trap focus, close on Esc, and restore focus to the trigger.
- Score and toast updates use `aria-live="polite"`.
- Charts have text alternatives (hidden table or `aria-label` summary: "Mood mix: 2 chill, 1 hyped, 1 happy").
- Images/icons: decorative icons `aria-hidden`; icon-only buttons have `aria-label` (Copy code, Refresh, Delete).
- Respect `prefers-reduced-motion`.
- Form inputs always have an associated `<label>`; errors linked via `aria-describedby`.

---

## 8. Iconography and assets
- Icons: **Lucide** (`lucide-react`), 20 px, 1.75 stroke. Suggested: `Copy`, `RefreshCw`, `Music`, `Users`, `History`, `Shield`, `Trash2`, `LogOut`, `Link`, `X`, `Plus`.
- Logo: two overlapping circles (violet `#8B5CF6` and pink `#FF4D8D`, 70% overlap) + wordmark "vibecheck" in Bricolage 700. Provide as an inline SVG component.
- Favicon: the overlapping-circles mark.
- No stock photos; the product's visuals come from colour, numerals and mood chips.

---

## 9. Design QA checklist (for the agent's browser check)
1. At 360 px, 768 px and 1280 px: no horizontal scroll, nothing overlaps, tap targets ≥ 44 px.
2. Every mood displays the same colour on chip, chart, pill and playlist swatch.
3. The score numeral, label and colour change correctly across all four ranges (try 20, 50, 79, 92).
4. Every destructive action shows a ConfirmDialog with specific wording.
5. Loading, empty and error states exist on dashboard, playlist, history, members and admin.
6. Keyboard-only run-through: sign up → create room → post check-in → delete it.
7. Reduced-motion setting turns off count-up and slide animations.
