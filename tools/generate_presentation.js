// tools/generate_presentation.js
// Generates perfectly aligned VibeCheck_Rooms_Minor_Project_Presentation.pptx using pptxgenjs

const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();

// Slide Layout: Modern 16:9 Widescreen (13.333" x 7.5")
pptx.layout = 'LAYOUT_WIDE';

// Styling Palette (Matches 02_DESIGN.md & Web UI)
const BG_DARK = '0B0B10';
const SURFACE_DARK = '15151D';
const SURFACE_2 = '1E1E29';
const BORDER_COLOR = '2A2A38';
const TEXT_WHITE = 'F5F5FA';
const TEXT_MUTED = 'A1A1B5';
const LIME_ACCENT = 'C6FF3D';
const VIOLET_ACCENT = '8B5CF6';
const PINK_ACCENT = 'FF4D8D';
const CYAN_ACCENT = '22D3EE';
const AMBER_ACCENT = 'FFB020';

const FONT_BODY = 'Segoe UI';
const FONT_MONO = 'Consolas';

const TOTAL_SLIDES = 14;

function addHeader(slide, title, category = 'BCA-508 MINOR PROJECT PRESENTATION') {
  slide.background = { color: BG_DARK };

  // Category Tag
  slide.addText(category.toUpperCase(), {
    x: 0.8,
    y: 0.4,
    w: 8.0,
    h: 0.25,
    fontSize: 9.5,
    bold: true,
    color: LIME_ACCENT,
    fontFace: FONT_BODY,
    margin: 0,
  });

  // Slide Title
  slide.addText(title, {
    x: 0.8,
    y: 0.65,
    w: 11.733,
    h: 0.55,
    fontSize: 21,
    bold: true,
    color: TEXT_WHITE,
    fontFace: FONT_BODY,
    margin: 0,
  });

  // Sleek Divider Line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.25,
    w: 11.733,
    h: 0.02,
    fill: { color: BORDER_COLOR },
  });
}

function addFooter(slide, slideNum) {
  // Left: Project & Student Info
  slide.addText('VibeCheck Rooms • Gaurav Singh (Roll No. 240919106084) • IMS Noida (CCSU)', {
    x: 0.8,
    y: 6.95,
    w: 8.5,
    h: 0.3,
    fontSize: 9,
    color: TEXT_MUTED,
    fontFace: FONT_BODY,
    margin: 0,
    valign: 'middle',
  });

  // Right: Slide Number
  if (slideNum) {
    slide.addText(`Slide ${slideNum} of ${TOTAL_SLIDES}`, {
      x: 9.5,
      y: 6.95,
      w: 3.033,
      h: 0.3,
      fontSize: 9,
      color: TEXT_MUTED,
      fontFace: FONT_BODY,
      align: 'right',
      margin: 0,
      valign: 'middle',
    });
  }
}

// ==========================================
// SLIDE 1: TITLE SLIDE
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };

  // Top College Header
  slide.addText('INSTITUTE OF MANAGEMENT STUDIES, NOIDA\nSCHOOL OF INFORMATION TECHNOLOGY (SOIT)', {
    x: 0.8,
    y: 0.75,
    w: 11.733,
    h: 0.6,
    fontSize: 12,
    bold: true,
    color: LIME_ACCENT,
    align: 'center',
    fontFace: FONT_BODY,
    margin: 0,
  });

  // Main Project Title
  slide.addText('“VIBECHECK ROOMS”', {
    x: 0.8,
    y: 1.5,
    w: 11.733,
    h: 0.9,
    fontSize: 38,
    bold: true,
    color: TEXT_WHITE,
    align: 'center',
    fontFace: FONT_BODY,
    margin: 0,
  });

  // Subtitle
  slide.addText('A Real-Time Group Mood Synchronization & Collaborative Music Sharing Platform', {
    x: 0.8,
    y: 2.45,
    w: 11.733,
    h: 0.45,
    fontSize: 15,
    color: CYAN_ACCENT,
    align: 'center',
    fontFace: FONT_BODY,
    margin: 0,
  });

  // University Affiliation
  slide.addText('Minor Project (BCA-508) Presentation for BCA 5th Semester\nAffiliated with Chaudhary Charan Singh University (CCSU), Meerut', {
    x: 0.8,
    y: 3.0,
    w: 11.733,
    h: 0.55,
    fontSize: 11.5,
    color: TEXT_MUTED,
    align: 'center',
    fontFace: FONT_BODY,
    margin: 0,
  });

  // Candidate & Panel Box (Centered)
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.4,
    y: 3.9,
    w: 10.533,
    h: 2.7,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1.5 },
    rectRadius: 0.1,
  });

  // Submitted By (Left Column)
  slide.addText([
    { text: 'SUBMITTED BY:\n', options: { bold: true, color: LIME_ACCENT, fontSize: 10.5 } },
    { text: 'GAURAV SINGH\n', options: { bold: true, color: TEXT_WHITE, fontSize: 16 } },
    { text: 'University Roll No.: 240919106084\n', options: { color: CYAN_ACCENT, fontSize: 12, bold: true } },
    { text: 'BCA (Batch 2024–2027)\nSchool of Information Technology (SOIT), IMS Noida', options: { color: TEXT_MUTED, fontSize: 11 } },
  ], {
    x: 1.8,
    y: 4.15,
    w: 4.6,
    h: 2.2,
    fontFace: FONT_BODY,
    valign: 'middle',
  });

  // Divider Line between columns
  slide.addShape(pptx.ShapeType.rect, {
    x: 6.66,
    y: 4.15,
    w: 0.02,
    h: 2.2,
    fill: { color: BORDER_COLOR },
  });

  // Under Guidance Of (Right Column)
  slide.addText([
    { text: 'UNDER GUIDANCE OF:\n', options: { bold: true, color: PINK_ACCENT, fontSize: 10.5 } },
    { text: 'School of Information Technology\n', options: { bold: true, color: TEXT_WHITE, fontSize: 14 } },
    { text: 'HOD: Ms. Monika Dixit Bajpai\n', options: { color: TEXT_WHITE, fontSize: 11.5 } },
    { text: 'Project Coordinators: Mr. Anushrav Mudgal, Mr. Nihal Kumar', options: { color: TEXT_MUTED, fontSize: 11 } },
  ], {
    x: 7.0,
    y: 4.15,
    w: 4.6,
    h: 2.2,
    fontFace: FONT_BODY,
    valign: 'middle',
  });
}

// ==========================================
// SLIDE 2: INTRODUCTION & PROBLEM STATEMENT
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '1. Introduction & Problem Statement');
  addFooter(slide, 2);

  // Left Card: The Problem
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.5,
    w: 5.7,
    h: 5.2,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1.5 },
    rectRadius: 0.1,
  });

  slide.addText('The Problem in Modern Friend Groups', {
    x: 1.1,
    y: 1.75,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    bold: true,
    color: PINK_ACCENT,
    fontFace: FONT_BODY,
    margin: 0,
  });

  slide.addText([
    { text: '• Busy Group Chat Chaos:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'Mood updates and song recommendations get buried under hundreds of messages within minutes in WhatsApp/Discord.\n\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: '• Proprietary Algorithm Barriers:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'Services like Spotify Blend depend on private streaming history and fail to capture how people feel on a specific day.\n\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: '• Absence of Lightweight Spaces:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'No free, cross-platform space exists where friends can combine self-reported mood with music in under 15 seconds.', options: { color: TEXT_MUTED, fontSize: 11 } },
  ], {
    x: 1.1,
    y: 2.2,
    w: 5.1,
    h: 4.3,
    fontFace: FONT_BODY,
    valign: 'top',
  });

  // Right Card: The Solution
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.833,
    y: 1.5,
    w: 5.7,
    h: 5.2,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1.5 },
    rectRadius: 0.1,
  });

  slide.addText('The VibeCheck Rooms Solution', {
    x: 7.133,
    y: 1.75,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    bold: true,
    color: LIME_ACCENT,
    fontFace: FONT_BODY,
    margin: 0,
  });

  slide.addText([
    { text: '• Private Invite-Only Rooms:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'Users create rooms and invite friends using an unambiguous 6-character room code with zero phone-number leaks.\n\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: '• Quick Daily Check-In:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'Choose 1 of 8 moods, set energy (1-5), write an optional 80-char note, and attach up to 3 songs.\n\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: '• Collective Group Vibe Score (0-100):\n', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'A transparent mathematical algorithm calculates the room’s vibe score, dominant mood, and auto-builds a shared playlist.', options: { color: TEXT_MUTED, fontSize: 11 } },
  ], {
    x: 7.133,
    y: 2.2,
    w: 5.1,
    h: 4.3,
    fontFace: FONT_BODY,
    valign: 'top',
  });
}

// ==========================================
// SLIDE 3: OBJECTIVES & SCOPE OF THE PROJECT
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '2. Objectives & Scope of the Project');
  addFooter(slide, 3);

  const objectives = [
    { num: '01', title: 'Seamless Room Creation & Access Control', desc: 'Allow users to register securely, create rooms with unique 6-character codes, and manage members.' },
    { num: '02', title: 'Low-Friction 15-Second Check-In Flow', desc: 'Enable quick mood selection (8 moods), energy ratings (1-5), optional notes, and up to 3 song attachments.' },
    { num: '03', title: 'Transparent Mathematical Vibe Engine', desc: 'Compute rolling 24-hour Group Vibe Score (0-100), dominant room mood, and mood-mix distribution.' },
    { num: '04', title: 'Collaborative Music Curation & Moderation', desc: 'Aggregate members’ music into a shared playlist and provide admin controls to moderate content and members.' },
    { num: '05', title: 'Zero-Cost Cloud Deployment', desc: 'Host production frontend on Vercel/GitHub Pages, REST API on Render, and PostgreSQL on Supabase at Rs. 0 cost.' },
  ];

  objectives.forEach((obj, idx) => {
    const yPos = 1.55 + idx * 1.02;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: yPos,
      w: 11.733,
      h: 0.88,
      fill: { color: SURFACE_DARK },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });

    // Number Badge
    slide.addText(obj.num, {
      x: 1.0,
      y: yPos + 0.15,
      w: 0.6,
      h: 0.55,
      fontSize: 16,
      bold: true,
      color: LIME_ACCENT,
      fontFace: FONT_BODY,
      margin: 0,
      align: 'center',
      valign: 'middle',
    });

    // Vertical mini-separator
    slide.addShape(pptx.ShapeType.rect, {
      x: 1.75,
      y: yPos + 0.18,
      w: 0.02,
      h: 0.52,
      fill: { color: BORDER_COLOR },
    });

    // Title & Description
    slide.addText(obj.title, {
      x: 1.95,
      y: yPos + 0.12,
      w: 10.3,
      h: 0.35,
      fontSize: 13,
      bold: true,
      color: TEXT_WHITE,
      fontFace: FONT_BODY,
      margin: 0,
    });

    slide.addText(obj.desc, {
      x: 1.95,
      y: yPos + 0.47,
      w: 10.3,
      h: 0.32,
      fontSize: 11,
      color: TEXT_MUTED,
      fontFace: FONT_BODY,
      margin: 0,
    });
  });
}

// ==========================================
// SLIDE 4: THREE-TIER SYSTEM ARCHITECTURE
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '3. Three-Tier System Architecture');
  addFooter(slide, 4);

  const tiers = [
    {
      label: 'TIER 1: PRESENTATION',
      title: 'Client Application (SPA)',
      color: CYAN_ACCENT,
      x: 0.8,
      bullets: [
        { title: '• React 19 + Vite:\n', text: 'High-performance Single Page Application.\n\n' },
        { title: '• Tailwind CSS v4:\n', text: 'Dark-theme design system with custom mood palette.\n\n' },
        { title: '• Client State & Polling:\n', text: 'Automated 20-second polling for real-time room updates.\n\n' },
        { title: '• Deployment:\n', text: 'Vercel / GitHub Pages Global CDN' },
      ],
    },
    {
      label: 'TIER 2: APPLICATION',
      title: 'Express 5 REST API',
      color: LIME_ACCENT,
      x: 4.82,
      bullets: [
        { title: '• Node.js 20/24 Runtime:\n', text: 'Asynchronous event-driven REST API server.\n\n' },
        { title: '• Pure Vibe Score Engine:\n', text: 'Deterministic business logic with unit test coverage.\n\n' },
        { title: '• Security Middleware:\n', text: 'Helmet security headers, CORS filtering & rate limiting.\n\n' },
        { title: '• Deployment:\n', text: 'Render Cloud Web Service' },
      ],
    },
    {
      label: 'TIER 3: DATA TIER',
      title: 'Supabase PostgreSQL',
      color: PINK_ACCENT,
      x: 8.85,
      bullets: [
        { title: '• Relational PostgreSQL DB:\n', text: '5 tables in 3rd Normal Form (3NF) with constraints.\n\n' },
        { title: '• Atomic Transactions:\n', text: 'PL/pgSQL RPC function saves checkin & songs together.\n\n' },
        { title: '• Row Level Security (RLS):\n', text: 'Deny-by-default access policies & JWT verification.\n\n' },
        { title: '• Deployment:\n', text: 'Supabase Managed Cloud' },
      ],
    },
  ];

  tiers.forEach((t) => {
    // Card Box
    slide.addShape(pptx.ShapeType.roundRect, {
      x: t.x,
      y: 1.5,
      w: 3.68,
      h: 5.2,
      fill: { color: SURFACE_DARK },
      line: { color: t.color, width: 1.8 },
      rectRadius: 0.1,
    });

    // Tier Label
    slide.addText(t.label, {
      x: t.x + 0.25,
      y: 1.75,
      w: 3.18,
      h: 0.3,
      fontSize: 10.5,
      bold: true,
      color: t.color,
      fontFace: FONT_BODY,
      margin: 0,
    });

    // Tier Title
    slide.addText(t.title, {
      x: t.x + 0.25,
      y: 2.08,
      w: 3.18,
      h: 0.45,
      fontSize: 15,
      bold: true,
      color: TEXT_WHITE,
      fontFace: FONT_BODY,
      margin: 0,
    });

    // Content Bullets
    const textRuns = [];
    t.bullets.forEach((b) => {
      textRuns.push({ text: b.title, options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } });
      textRuns.push({ text: b.text, options: { color: TEXT_MUTED, fontSize: 10.5 } });
    });

    slide.addText(textRuns, {
      x: t.x + 0.25,
      y: 2.55,
      w: 3.18,
      h: 3.95,
      fontFace: FONT_BODY,
      valign: 'top',
    });
  });
}

// ==========================================
// SLIDE 5: USER JOURNEY & CORE TRANSACTION FLOW
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '4. User Flow & Core Transaction: Mood Check-in');
  addFooter(slide, 5);

  const steps = [
    { title: '1. Authenticate', desc: 'User logs in or uses demo reviewer account. JWT issued.' },
    { title: '2. Access Room', desc: 'Create room or enter 6-character code. Membership validated.' },
    { title: '3. Form Input', desc: 'Select 1 of 8 moods, set energy (1-5), optional note & 0-3 songs.' },
    { title: '4. Atomic Save', desc: 'POST request invokes RPC function; checkin & songs saved atomically.' },
    { title: '5. Vibe Update', desc: 'Vibe engine recalculates score; dashboard, chart & playlist refresh.' },
  ];

  steps.forEach((st, idx) => {
    const xPos = 0.8 + idx * 2.38;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: 1.5,
      w: 2.22,
      h: 2.1,
      fill: { color: SURFACE_DARK },
      line: { color: BORDER_COLOR, width: 1.2 },
      rectRadius: 0.08,
    });

    slide.addText(`STEP 0${idx + 1}`, {
      x: xPos + 0.15,
      y: 1.65,
      w: 1.92,
      h: 0.28,
      fontSize: 10,
      bold: true,
      color: LIME_ACCENT,
      fontFace: FONT_BODY,
      margin: 0,
    });

    slide.addText(st.title, {
      x: xPos + 0.15,
      y: 1.95,
      w: 1.92,
      h: 0.38,
      fontSize: 12.5,
      bold: true,
      color: TEXT_WHITE,
      fontFace: FONT_BODY,
      margin: 0,
    });

    slide.addText(st.desc, {
      x: xPos + 0.15,
      y: 2.38,
      w: 1.92,
      h: 1.1,
      fontSize: 10.5,
      color: TEXT_MUTED,
      fontFace: FONT_BODY,
      margin: 0,
    });
  });

  // Transactional Guarantees Box Below
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 3.85,
    w: 11.733,
    h: 2.85,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1.5 },
    rectRadius: 0.1,
  });

  slide.addText('Transactional Guarantees & Constraints', {
    x: 1.1,
    y: 4.05,
    w: 8.0,
    h: 0.35,
    fontSize: 14,
    bold: true,
    color: VIOLET_ACCENT,
    fontFace: FONT_BODY,
    margin: 0,
  });

  slide.addText([
    { text: '• Rolling 24-Hour Scope: ', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'Only the single latest check-in per member within the last 24 hours counts towards the score. Stale check-ins expire automatically.\n\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: '• All-or-Nothing Integrity: ', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'The Postgres RPC function ensures check-ins and songs cannot be partially inserted; if any query fails, the transaction rolls back cleanly.\n\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: '• Immediate Client Feedback: ', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'The check-in endpoint returns the updated vibe score payload directly, allowing instant reactive UI updates without a full page reload.', options: { color: TEXT_MUTED, fontSize: 11 } },
  ], {
    x: 1.1,
    y: 4.5,
    w: 11.1,
    h: 2.05,
    fontFace: FONT_BODY,
    valign: 'top',
  });
}

// ==========================================
// SLIDE 6: DATA FLOW DIAGRAMS (DFD HIERARCHY)
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '5. Data Flow Diagrams (DFD Hierarchy)');
  addFooter(slide, 6);

  const dfds = [
    {
      title: 'DFD Level 0 (Context)',
      color: LIME_ACCENT,
      x: 0.8,
      runs: [
        { text: '• External Entities:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
        { text: '1. Member\n2. Room Admin\n\n', options: { color: CYAN_ACCENT, fontSize: 11 } },
        { text: '• Inputs from Member:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
        { text: 'Auth details, room create/join, mood check-in & songs.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
        { text: '• Inputs from Admin:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
        { text: 'Moderation actions, code regeneration, close room.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
        { text: '• Outputs to User:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
        { text: 'Vibe score, dominant mood, mood-mix chart & shared playlist.', options: { color: TEXT_MUTED, fontSize: 10.5 } },
      ],
    },
    {
      title: 'DFD Level 1 (Subsystems)',
      color: VIOLET_ACCENT,
      x: 4.82,
      runs: [
        { text: '• 1.0 Authentication:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
        { text: 'Registers/logs in users; writes to D1 Profiles.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
        { text: '• 2.0 Room Management:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
        { text: 'Generates codes & links members; stores in D2.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
        { text: '• 3.0 Check-in & Songs:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
        { text: 'Validates & writes records to D3 & D4.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
        { text: '• 4.0 Vibe Calculation:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
        { text: 'Aggregates checkins to compute score & mix.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
        { text: '• 5.0 Admin Moderation:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
        { text: 'Manages memberships and room lifecycle.', options: { color: TEXT_MUTED, fontSize: 10.5 } },
      ],
    },
    {
      title: 'DFD Level 2 (Check-in)',
      color: PINK_ACCENT,
      x: 8.85,
      runs: [
        { text: '• 3.1 Session & Membership:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
        { text: 'Verifies bearer JWT & active room membership.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
        { text: '• 3.2 Schema Validation:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
        { text: 'Checks mood enum, energy range (1-5), ≤80 chars note, and ≤3 songs.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
        { text: '• 3.3 / 3.4 Atomic Insertion:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
        { text: 'Inserts 1 checkin row and up to 3 song rows.\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
        { text: '• 3.5 Recalculate Vibe Score:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
        { text: 'Re-evaluates 24h score & triggers UI refresh.', options: { color: TEXT_MUTED, fontSize: 10.5 } },
      ],
    },
  ];

  dfds.forEach((d) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: d.x,
      y: 1.5,
      w: 3.68,
      h: 5.2,
      fill: { color: SURFACE_DARK },
      line: { color: BORDER_COLOR, width: 1.5 },
      rectRadius: 0.1,
    });

    slide.addText(d.title, {
      x: d.x + 0.25,
      y: 1.75,
      w: 3.18,
      h: 0.35,
      fontSize: 14,
      bold: true,
      color: d.color,
      fontFace: FONT_BODY,
      margin: 0,
    });

    slide.addText(d.runs, {
      x: d.x + 0.25,
      y: 2.15,
      w: 3.18,
      h: 4.35,
      fontFace: FONT_BODY,
      valign: 'top',
    });
  });
}

// ==========================================
// SLIDE 7: ENTITY RELATIONSHIP DIAGRAM (ERD & 3NF)
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '6. Entity Relationship Diagram (ERD & 3NF)');
  addFooter(slide, 7);

  const tables = [
    { name: 'profiles', keys: 'PK: id (UUID)', cols: 'display_name, email, avatar_color, created_at' },
    { name: 'rooms', keys: 'PK: id | FK: created_by', cols: 'name, room_code (UK), is_active, created_at' },
    { name: 'room_members', keys: 'PK: id | FK: room_id, user_id', cols: 'role (admin/member), joined_at' },
    { name: 'mood_checkins', keys: 'PK: id | FK: room_id, user_id', cols: 'mood (enum), energy (1-5), note (max 80), created_at' },
    { name: 'songs', keys: 'PK: id | FK: checkin_id', cols: 'title, artist, link_url, position (1-3)' },
  ];

  tables.forEach((tbl, idx) => {
    const yPos = 1.55 + idx * 0.94;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: yPos,
      w: 11.733,
      h: 0.82,
      fill: { color: SURFACE_DARK },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });

    slide.addText(tbl.name, {
      x: 1.1,
      y: yPos + 0.15,
      w: 2.3,
      h: 0.5,
      fontSize: 14,
      bold: true,
      color: LIME_ACCENT,
      fontFace: FONT_MONO,
      margin: 0,
      valign: 'middle',
    });

    slide.addText(tbl.keys, {
      x: 3.5,
      y: yPos + 0.15,
      w: 3.3,
      h: 0.5,
      fontSize: 11,
      bold: true,
      color: CYAN_ACCENT,
      fontFace: FONT_BODY,
      margin: 0,
      valign: 'middle',
    });

    slide.addText(tbl.cols, {
      x: 6.9,
      y: yPos + 0.15,
      w: 5.4,
      h: 0.5,
      fontSize: 11,
      color: TEXT_MUTED,
      fontFace: FONT_BODY,
      margin: 0,
      valign: 'middle',
    });
  });

  // Note on 3NF
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 6.35,
    w: 11.733,
    h: 0.45,
    fill: { color: SURFACE_2 },
    line: { color: BORDER_COLOR, width: 1 },
    rectRadius: 0.06,
  });

  slide.addText('Third Normal Form (3NF) Certified: Resolves M:N user-room relationship via junction table room_members. Zero redundant columns. Cascading deletes on foreign keys.', {
    x: 1.0,
    y: 6.35,
    w: 11.333,
    h: 0.45,
    fontSize: 10,
    color: TEXT_WHITE,
    italic: true,
    fontFace: FONT_BODY,
    margin: 0,
    valign: 'middle',
  });
}

// ==========================================
// SLIDE 8: VIBE SCORE ALGORITHM & MATHEMATICAL PROOF
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '7. Vibe Score Algorithm & Mathematical Proof');
  addFooter(slide, 8);

  // Formula Card
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.5,
    w: 11.733,
    h: 1.55,
    fill: { color: SURFACE_DARK },
    line: { color: LIME_ACCENT, width: 1.5 },
    rectRadius: 0.1,
  });

  slide.addText('Mathematical Formula (Rolling 24-Hour Scope)', {
    x: 1.1,
    y: 1.7,
    w: 8.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: LIME_ACCENT,
    fontFace: FONT_BODY,
    margin: 0,
  });

  slide.addText('Group Vibe Score = round( sum(Mood Scores of Active Members) / Number of Active Members )', {
    x: 1.1,
    y: 2.05,
    w: 11.1,
    h: 0.45,
    fontSize: 14.5,
    bold: true,
    color: TEXT_WHITE,
    fontFace: FONT_MONO,
    margin: 0,
  });

  slide.addText('Dominant Mood: Highest frequency mood among active members. Tie-breaker: most recent submission timestamp.', {
    x: 1.1,
    y: 2.55,
    w: 11.1,
    h: 0.3,
    fontSize: 11,
    color: TEXT_MUTED,
    fontFace: FONT_BODY,
    margin: 0,
  });

  // Worked Example - Left Side (Member Inputs)
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 3.25,
    w: 6.8,
    h: 3.45,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1.2 },
    rectRadius: 0.1,
  });

  slide.addText('Worked Example Test Case: Room "Late Night Crew"', {
    x: 1.1,
    y: 3.45,
    w: 6.2,
    h: 0.35,
    fontSize: 13,
    bold: true,
    color: VIOLET_ACCENT,
    fontFace: FONT_BODY,
    margin: 0,
  });

  const memberData = [
    { name: 'Rahul', mood: 'Chill', score: '70', energy: '3 / 5' },
    { name: 'Aman', mood: 'Hyped', score: '85', energy: '5 / 5' },
    { name: 'Rohit', mood: 'Happy', score: '90', energy: '4 / 5' },
    { name: 'Gaurav', mood: 'Chill', score: '70', energy: '3 / 5' },
  ];

  memberData.forEach((m, idx) => {
    const yPos = 3.95 + idx * 0.58;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 1.1,
      y: yPos,
      w: 6.2,
      h: 0.48,
      fill: { color: SURFACE_2 },
      line: { color: BORDER_COLOR, width: 0.8 },
      rectRadius: 0.06,
    });

    slide.addText([
      { text: `${m.name}: `, options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
      { text: `Mood: ${m.mood}  •  `, options: { color: CYAN_ACCENT, fontSize: 11 } },
      { text: `Score: ${m.score}  •  `, options: { color: LIME_ACCENT, bold: true, fontSize: 11 } },
      { text: `Energy: ${m.energy}`, options: { color: AMBER_ACCENT, fontSize: 11 } },
    ], {
      x: 1.3,
      y: yPos,
      w: 5.8,
      h: 0.48,
      fontFace: FONT_BODY,
      margin: 0,
      valign: 'middle',
    });
  });

  // Worked Example - Right Side (Calculated Output Box)
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.8,
    y: 3.25,
    w: 4.733,
    h: 3.45,
    fill: { color: SURFACE_2 },
    line: { color: LIME_ACCENT, width: 1.5 },
    rectRadius: 0.1,
  });

  slide.addText([
    { text: 'CALCULATED OUTPUT:\n\n', options: { bold: true, color: LIME_ACCENT, fontSize: 11.5 } },
    { text: '• Total Mood Score: 315\n', options: { color: TEXT_WHITE, fontSize: 12 } },
    { text: '• Active Members: 4\n', options: { color: TEXT_WHITE, fontSize: 12 } },
    { text: '• Calculation: 315 / 4 = 78.75\n', options: { color: TEXT_WHITE, fontSize: 12 } },
    { text: '• Final Score: 79 (Good vibes)\n', options: { bold: true, color: LIME_ACCENT, fontSize: 14 } },
    { text: '• Dominant Mood: Chill (2 of 4)\n', options: { color: CYAN_ACCENT, fontSize: 12 } },
    { text: '• Average Energy: 3.8 / 5', options: { color: AMBER_ACCENT, fontSize: 12 } },
  ], {
    x: 8.1,
    y: 3.5,
    w: 4.133,
    h: 2.95,
    fontFace: FONT_BODY,
    valign: 'middle',
  });
}

// ==========================================
// SLIDE 9: USER INTERFACE DESIGN & KEY PAGES
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '8. User Interface Design & Key Pages');
  addFooter(slide, 9);

  const pages = [
    { title: '1. Landing / Home Page', desc: 'Hero headline "What’s the vibe today?", room code entry, how-it-works cards, and interactive demo preview.' },
    { title: '2. Login & Sign-up Modal', desc: 'Instant authentication, inline validation, and 1-click fast-track demo login for examiners.' },
    { title: '3. Room Dashboard', desc: 'Hero VibeMeter (0-100), 8-mood checkin form, energy selector, mood-mix chart, and shared playlist.' },
    { title: '4. Admin Moderation Panel', desc: 'Room statistics, member removal, 6-character code regeneration, check-in deletion, and room archiving.' },
    { title: '5. Room History Page', desc: 'Chronological archive of past check-ins, member notes, and attached songs with timestamp tracking.' },
  ];

  pages.forEach((p, idx) => {
    const yPos = 1.55 + idx * 1.02;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: yPos,
      w: 11.733,
      h: 0.88,
      fill: { color: SURFACE_DARK },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });

    slide.addText(p.title, {
      x: 1.1,
      y: yPos + 0.15,
      w: 3.5,
      h: 0.55,
      fontSize: 13,
      bold: true,
      color: LIME_ACCENT,
      fontFace: FONT_BODY,
      margin: 0,
      valign: 'middle',
    });

    // Vertical mini-separator
    slide.addShape(pptx.ShapeType.rect, {
      x: 4.75,
      y: yPos + 0.18,
      w: 0.02,
      h: 0.52,
      fill: { color: BORDER_COLOR },
    });

    slide.addText(p.desc, {
      x: 4.95,
      y: yPos + 0.15,
      w: 7.3,
      h: 0.55,
      fontSize: 11,
      color: TEXT_MUTED,
      fontFace: FONT_BODY,
      margin: 0,
      valign: 'middle',
    });
  });
}

// ==========================================
// SLIDE 10: ROLE-BASED MODERATION & ADMIN SYSTEM
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '9. Role-Based Moderation & Admin System');
  addFooter(slide, 10);

  const adminFeatures = [
    { title: 'Server-Enforced RBAC', desc: 'Routes /api/rooms/:id/stats and moderation endpoints strictly verify role in room_members table. Non-admins receive HTTP 403 Forbidden.' },
    { title: 'Live Statistics Telemetry', desc: 'Instant visibility over total members, check-ins, shared playlist tracks, and members active in the last 24 hours.' },
    { title: 'Cascading Member Removal', desc: 'Removing a member deletes their check-ins and songs, preventing orphan records and preserving clean vibe scores.' },
    { title: 'Invite Code Invalidation', desc: 'One-click code regeneration instantly terminates compromised or old room codes and creates a fresh 6-character token.' },
    { title: 'Room Archival (Danger Zone)', desc: 'Admins can close the room. Closed rooms prevent new member joins and disable check-in posting permanently.' },
  ];

  adminFeatures.forEach((af, idx) => {
    const yPos = 1.55 + idx * 1.02;

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: yPos,
      w: 11.733,
      h: 0.88,
      fill: { color: SURFACE_DARK },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });

    slide.addText(af.title, {
      x: 1.1,
      y: yPos + 0.15,
      w: 3.5,
      h: 0.55,
      fontSize: 13,
      bold: true,
      color: PINK_ACCENT,
      fontFace: FONT_BODY,
      margin: 0,
      valign: 'middle',
    });

    // Vertical mini-separator
    slide.addShape(pptx.ShapeType.rect, {
      x: 4.75,
      y: yPos + 0.18,
      w: 0.02,
      h: 0.52,
      fill: { color: BORDER_COLOR },
    });

    slide.addText(af.desc, {
      x: 4.95,
      y: yPos + 0.15,
      w: 7.3,
      h: 0.55,
      fontSize: 11,
      color: TEXT_MUTED,
      fontFace: FONT_BODY,
      margin: 0,
      valign: 'middle',
    });
  });
}

// ==========================================
// SLIDE 11: TECHNICAL REQUIREMENTS & DEPLOYMENT STACK
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '10. Technical Requirements & Deployment Stack');
  addFooter(slide, 11);

  // Left: Software Stack
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.5,
    w: 5.7,
    h: 5.2,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1.5 },
    rectRadius: 0.1,
  });

  slide.addText('Software & Development Stack', {
    x: 1.1,
    y: 1.75,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    bold: true,
    color: CYAN_ACCENT,
    fontFace: FONT_BODY,
    margin: 0,
  });

  slide.addText([
    { text: '• Operating System: ', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
    { text: 'Windows 10/11 / Linux (Ubuntu 22.04)\n\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: '• Runtime & Backend: ', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
    { text: 'Node.js 20/24 LTS, Express 5, TypeScript\n\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: '• Frontend: ', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
    { text: 'React 19, Vite, Tailwind CSS v4, Lucide Icons\n\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: '• Database & Auth: ', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
    { text: 'Supabase PostgreSQL, Supabase Auth (JWT)\n\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: '• Testing & Tools: ', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
    { text: 'Vitest, Supertest, VS Code, Git & GitHub', options: { color: TEXT_MUTED, fontSize: 11 } },
  ], {
    x: 1.1,
    y: 2.2,
    w: 5.1,
    h: 4.3,
    fontFace: FONT_BODY,
    valign: 'top',
  });

  // Right: Cloud Deployment & Budget
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.833,
    y: 1.5,
    w: 5.7,
    h: 5.2,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1.5 },
    rectRadius: 0.1,
  });

  slide.addText('Cloud Infrastructure (Rs. 0 Cost)', {
    x: 7.133,
    y: 1.75,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    bold: true,
    color: LIME_ACCENT,
    fontFace: FONT_BODY,
    margin: 0,
  });

  slide.addText([
    { text: '• Frontend Hosting: Vercel / GitHub Pages\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
    { text: 'Global edge deployment with automatic SSL.\nCost: Rs. 0\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• API Hosting: Render Free Tier\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
    { text: 'Node.js container with health checks (/api/health).\nCost: Rs. 0\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
    { text: '• Managed Database: Supabase Cloud\n', options: { bold: true, color: TEXT_WHITE, fontSize: 11.5 } },
    { text: 'PostgreSQL instance with automated backups.\nCost: Rs. 0\n\n', options: { color: TEXT_MUTED, fontSize: 10.5 } },
  ], {
    x: 7.133,
    y: 2.2,
    w: 5.1,
    h: 3.3,
    fontFace: FONT_BODY,
    valign: 'top',
  });

  // Zero-cost Highlight Pill
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.133,
    y: 5.7,
    w: 5.1,
    h: 0.75,
    fill: { color: SURFACE_2 },
    line: { color: LIME_ACCENT, width: 1.5 },
    rectRadius: 0.08,
  });

  slide.addText('TOTAL INFRASTRUCTURE EXPENSE: Rs. 0', {
    x: 7.133,
    y: 5.7,
    w: 5.1,
    h: 0.75,
    fontSize: 12.5,
    bold: true,
    color: LIME_ACCENT,
    align: 'center',
    fontFace: FONT_BODY,
    margin: 0,
    valign: 'middle',
  });
}

// ==========================================
// SLIDE 12: LIMITATIONS & FUTURE SCOPE
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '11. Limitations & Future Scope');
  addFooter(slide, 12);

  // Left: Limitations
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.5,
    w: 5.7,
    h: 5.2,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1.5 },
    rectRadius: 0.1,
  });

  slide.addText('Current Project Limitations', {
    x: 1.1,
    y: 1.75,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    bold: true,
    color: PINK_ACCENT,
    fontFace: FONT_BODY,
    margin: 0,
  });

  slide.addText([
    { text: '• Free-Tier Spin Down:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'Render free services sleep after 15 min idle; cold start takes ~50 seconds.\n\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: '• Manual Music Linking:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'Songs are stored as metadata and links; no embedded streaming player.\n\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: '• 20-Second Polling:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'Near real-time refresh rather than WebSocket push streams.', options: { color: TEXT_MUTED, fontSize: 11 } },
  ], {
    x: 1.1,
    y: 2.2,
    w: 5.1,
    h: 4.3,
    fontFace: FONT_BODY,
    valign: 'top',
  });

  // Right: Future Scope
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.833,
    y: 1.5,
    w: 5.7,
    h: 5.2,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1.5 },
    rectRadius: 0.1,
  });

  slide.addText('Future Roadmap & Enhancements', {
    x: 7.133,
    y: 1.75,
    w: 5.1,
    h: 0.35,
    fontSize: 15,
    bold: true,
    color: LIME_ACCENT,
    fontFace: FONT_BODY,
    margin: 0,
  });

  slide.addText([
    { text: '• Spotify Web API Integration:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'Search track catalog, display album art, and play 30s previews directly.\n\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: '• WebSockets / Supabase Realtime:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'Instant bi-directional vibe updates with zero polling latency.\n\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: '• AI Mood Insights & Weekly Recaps:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'Analyze trends over time (e.g. "Your room is happiest on Fridays!").', options: { color: TEXT_MUTED, fontSize: 11 } },
  ], {
    x: 7.133,
    y: 2.2,
    w: 5.1,
    h: 4.3,
    fontFace: FONT_BODY,
    valign: 'top',
  });
}

// ==========================================
// SLIDE 13: LIVE DEMONSTRATION & VERIFICATION
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '12. Live Demonstration & Verification');
  addFooter(slide, 13);

  // Big Demo Credentials Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.5,
    w: 11.733,
    h: 5.2,
    fill: { color: SURFACE_DARK },
    line: { color: LIME_ACCENT, width: 1.8 },
    rectRadius: 0.1,
  });

  // Top Banner
  slide.addText('Examiner Fast-Track Review Credentials & Live Demo Guide', {
    x: 1.1,
    y: 1.75,
    w: 11.1,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: LIME_ACCENT,
    fontFace: FONT_BODY,
    margin: 0,
  });

  // Credentials Pill
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.1,
    y: 2.25,
    w: 11.1,
    h: 0.65,
    fill: { color: SURFACE_2 },
    line: { color: BORDER_COLOR, width: 1 },
    rectRadius: 0.08,
  });

  slide.addText([
    { text: 'Seeded Demo Room: ', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: '“Late Night Crew”    |    ', options: { bold: true, color: CYAN_ACCENT, fontSize: 12 } },
    { text: 'Room Invite Code: ', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'K7P2QX    |    ', options: { bold: true, color: LIME_ACCENT, fontSize: 14 } },
    { text: 'Live Link: ', options: { bold: true, color: TEXT_WHITE, fontSize: 12 } },
    { text: 'https://gauravsingh08112005-ai.github.io/VibeCheck/', options: { color: CYAN_ACCENT, fontSize: 11 } },
  ], {
    x: 1.3,
    y: 2.25,
    w: 10.7,
    h: 0.65,
    fontFace: FONT_BODY,
    margin: 0,
    valign: 'middle',
  });

  // Walkthrough Bullet Points
  slide.addText([
    { text: '• Member Walkthrough:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 12.5 } },
    { text: 'Click "Demo Member (Rahul)" on the login modal to view the room, see the 79 Good vibes score, post a new check-in with songs, and inspect the shared playlist.\n\n', options: { color: TEXT_MUTED, fontSize: 11.5 } },

    { text: '• Admin Walkthrough:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 12.5 } },
    { text: 'Click "Demo Admin (Gaurav)" to open the Admin Panel, view room statistics (42 check-ins, 96 songs), regenerate the room code, delete spam, or close the room.\n\n', options: { color: TEXT_MUTED, fontSize: 11.5 } },

    { text: '• Automated Unit Tests:\n', options: { bold: true, color: TEXT_WHITE, fontSize: 12.5 } },
    { text: 'Run npm test in the server directory to verify the 315/4 = 79 worked example unit tests pass cleanly with 100% test coverage.', options: { color: TEXT_MUTED, fontSize: 11.5 } },
  ], {
    x: 1.1,
    y: 3.1,
    w: 11.1,
    h: 3.4,
    fontFace: FONT_BODY,
    valign: 'top',
  });
}

// ==========================================
// SLIDE 14: CONCLUSION & THANK YOU
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };

  slide.addText('THANK YOU!', {
    x: 0.8,
    y: 1.2,
    w: 11.733,
    h: 0.9,
    fontSize: 44,
    bold: true,
    color: LIME_ACCENT,
    align: 'center',
    fontFace: FONT_BODY,
    margin: 0,
  });

  slide.addText('Questions & Answers', {
    x: 0.8,
    y: 2.15,
    w: 11.733,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: TEXT_WHITE,
    align: 'center',
    fontFace: FONT_BODY,
    margin: 0,
  });

  // Candidate Details Card (Centered)
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 2.2,
    y: 3.0,
    w: 8.933,
    h: 3.6,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1.5 },
    rectRadius: 0.1,
  });

  slide.addText([
    { text: 'GAURAV SINGH\n', options: { bold: true, color: TEXT_WHITE, fontSize: 20 } },
    { text: 'University Roll No.: 240919106084\n\n', options: { bold: true, color: CYAN_ACCENT, fontSize: 13.5 } },
    { text: 'Email: gauravsingh.bcr24079@imsnoida.com  •  Mobile: +91 7289860248\n\n', options: { color: TEXT_MUTED, fontSize: 11.5 } },
    { text: 'Bachelor of Computer Application (BCA 5th Sem, Batch 2024–27)\n', options: { color: TEXT_WHITE, fontSize: 12.5 } },
    { text: 'School of Information Technology (SOIT), Institute of Management Studies, Noida\n', options: { color: TEXT_MUTED, fontSize: 11.5 } },
    { text: 'Chaudhary Charan Singh University (CCSU), Meerut', options: { color: LIME_ACCENT, fontSize: 12, bold: true } },
  ], {
    x: 2.5,
    y: 3.25,
    w: 8.333,
    h: 3.1,
    align: 'center',
    fontFace: FONT_BODY,
    valign: 'middle',
  });
}

// Save presentation file
const outputPath = path.resolve('C:/Users/DELL/Desktop/VibeCheck/VibeCheck_Rooms_Minor_Project_Presentation.pptx');

pptx.writeFile({ fileName: outputPath })
  .then((fileName) => {
    console.log(`[PPTX] Presentation generated successfully with perfect layout and alignment: ${fileName}`);
  })
  .catch((err) => {
    console.error(`[PPTX] Error generating presentation:`, err);
    process.exit(1);
  });
