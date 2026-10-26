# VibeCheck Rooms ⚡
### BCA 5th Semester Minor Project (BCA-508)
**Institute of Management Studies (IMS), Noida**  
*Affiliated with Chaudhary Charan Singh University (CCSU), Meerut*

- **Candidate Name:** Gaurav Singh  
- **University Roll No.:** 240919106084  
- **Batch:** 2024–2027 (5th Semester)  
- **Project Title:** VibeCheck Rooms  
- **Project Coordinators:** Mr. Anushrav Mudgal, Mr. Nihal Kumar  
- **SOIT Head of Department:** Ms. Monika Dixit Bajpai  

---

## 1. Project Overview

**VibeCheck Rooms** is a social web application designed for friend groups, hostel roommates, and student teams. Inside private, invite-only rooms, members post a daily mood check-in (1 of 8 moods, an energy rating 1–5, an optional 80-character note, and up to 3 songs). The system calculates an aggregated **Group Vibe Score (0–100)**, identifies the room's dominant mood, plots a live mood-mix distribution, and automatically compiles a collaborative **Shared Playlist**.

### Key Highlights
- **10-Second Check-in:** Low-friction interface with single-tap mood selection and song attachments.
- **Formula-Driven Vibe Engine:** Transparent, mathematically defined score based on a rolling 24-hour window.
- **Collaborative Music Curation:** Aggregated playlist with direct streaming links and attribution.
- **Role-Based Moderation:** Room creator enjoys admin privileges (regenerate invite code, remove members, delete check-ins, archive room).
- **Three-Tier Architecture:** Built with React 19 + Vite (Frontend), Node.js & Express 5 (REST API), and Supabase PostgreSQL with Row Level Security.
- **Zero-Cost Deployment:** Fully hosted on free-tier cloud infrastructure (Vercel + Render + Supabase).

---

## 2. Vibe Score Algorithm & Mathematical Formula

The **Group Vibe Score** is computed dynamically from each active member's **single latest check-in** within the last 24 hours:

$$\text{Group Vibe Score} = \text{round}\left( \frac{\sum \text{Mood Scores of Active Members}}{\text{Number of Active Members}} \right)$$

### Fixed Mood Weightings
| Mood | Weight | Emoji | Mood | Weight | Emoji |
| :--- | :---: | :---: | :--- | :---: | :---: |
| **Happy** | 90 | 😊 | **Focused** | 65 | 🎯 |
| **Hyped** | 85 | ⚡ | **Nostalgic** | 55 | 📼 |
| **Romantic** | 80 | 💘 | **Stressed** | 30 | 😵‍💫 |
| **Chill** | 70 | 🌊 | **Sad** | 20 | 🌧️ |

### Score Range Labels
- `0 – 39`: **Low vibes**
- `40 – 64`: **Balanced vibes**
- `65 – 84`: **Good vibes**
- `85 – 100`: **Peak vibes**

### Worked Example (*Late Night Crew* Room)
- Rahul: Chill (70), Energy 3
- Aman: Hyped (85), Energy 5
- Rohit: Happy (90), Energy 4
- Gaurav: Chill (70), Energy 3
$$\text{Sum} = 70 + 85 + 90 + 70 = 315$$
$$\text{Average} = \frac{315}{4} = 78.75 \implies \mathbf{79\text{ (Good vibes)}}$$
- **Dominant Mood:** **Chill** (2 of 4 members)
- **Average Energy:** $\frac{3 + 5 + 4 + 3}{4} = \mathbf{3.8\text{ / }5}$

---

## 3. Fast-Track Examiner & Reviewer Demo Mode

For quick evaluation during college presentations, the application comes **pre-seeded** with sample data:
- **Demo Room Code:** `K7P2QX` (*Late Night Crew*)
- **Demo Member:** Click **"Try the demo room (Rahul)"** on the Login modal to test member features.
- **Demo Admin:** Click **"Demo Admin (Gaurav)"** on the Login modal to test room moderation, member removal, code regeneration, and room closure.

---

## 4. Local Installation & Setup

### Prerequisites
- Node.js (v20+ LTS recommended)
- npm (v10+)

### Running the Project
```bash
# Clone the repository
git clone https://github.com/your-username/vibecheck-rooms.git
cd vibecheck-rooms

# Install dependencies
npm install

# Start the Express API Backend (Port 3000)
cd server
npm run dev

# In a second terminal, start the React Vite Frontend (Port 5173)
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 5. Live Cloud Deployment Runbook

### 1. Database (Supabase PostgreSQL)
1. Create a free project on [Supabase](https://supabase.com).
2. Go to the SQL Editor and execute the 4 migration scripts in order:
   - `supabase/migrations/0001_schema.sql` (Tables & Constraints)
   - `supabase/migrations/0002_profile_trigger.sql` (Auth Trigger)
   - `supabase/migrations/0003_rls.sql` (Row Level Security)
   - `supabase/migrations/0004_checkin_rpc.sql` (Atomic Check-in RPC)
3. Execute `supabase/seed.sql` to populate the demo room.
4. Copy the Project URL, Publishable Key, and Secret Key from **Project Settings → API**.

### 2. Backend REST API (Render)
1. Create a new Web Service on [Render](https://render.com) linked to this repository.
2. Root Directory: `server`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Configure Environment Variables:
   - `SUPABASE_URL`: `https://<project-ref>.supabase.co`
   - `SUPABASE_SECRET_KEY`: `<your-supabase-secret-key>`
   - `CORS_ORIGINS`: `https://<your-client>.vercel.app,http://localhost:5173`

### 3. Frontend Client (Vercel)
1. Import the repository onto [Vercel](https://vercel.com).
2. Root Directory: `client`
3. Framework Preset: `Vite`
4. Set Environment Variables:
   - `VITE_API_URL`: `https://<your-render-api>.onrender.com`
   - `VITE_SUPABASE_URL`: `https://<project-ref>.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: `<your-supabase-publishable-key>`
5. Click **Deploy**.

---

## 6. Academic Disclaimer
*VibeCheck Rooms is created for academic assessment in partial fulfillment of the BCA degree at IMS Noida / CCSU Meerut. The vibe metric is designed for entertainment and self-expression, not psychological analysis.*
