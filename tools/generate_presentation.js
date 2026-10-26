// tools/generate_presentation.js
// Generates VibeCheck_Rooms_Minor_Project_Presentation.pptx using pptxgenjs

const PptxGenJS = require('pptxgenjs');
const path = require('path');

const pptx = new PptxGenJS();

// Slide Layout: 16:9 Widescreen
pptx.layout = 'LAYOUT_16x9';

// Styling Palette (Matches 02_DESIGN.md)
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

function addHeader(slide, title, category = 'BCA-508 MINOR PROJECT PRESENTATION') {
  slide.background = { color: BG_DARK };

  // Category Tag
  slide.addText(category.toUpperCase(), {
    x: 0.8,
    y: 0.4,
    w: 8.0,
    h: 0.3,
    fontSize: 10,
    bold: true,
    color: LIME_ACCENT,
    fontFace: 'Arial',
  });

  // Title
  slide.addText(title, {
    x: 0.8,
    y: 0.7,
    w: 11.5,
    h: 0.6,
    fontSize: 22,
    bold: true,
    color: TEXT_WHITE,
    fontFace: 'Arial',
  });

  // Divider Line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.35,
    w: 11.7,
    h: 0.02,
    fill: { color: BORDER_COLOR },
  });
}

function addFooter(slide) {
  slide.addText('VibeCheck Rooms • Gaurav Singh (Roll No. 240919106084) • IMS Noida (CCSU)', {
    x: 0.8,
    y: 7.0,
    w: 10.0,
    h: 0.3,
    fontSize: 9,
    color: TEXT_MUTED,
    fontFace: 'Arial',
  });
}

// ==========================================
// SLIDE 1: TITLE SLIDE
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };

  // Accent Tag
  slide.addText('INSTITUTE OF MANAGEMENT STUDIES, NOIDA\nSCHOOL OF INFORMATION TECHNOLOGY (SOIT)', {
    x: 1.0,
    y: 1.0,
    w: 11.3,
    h: 0.6,
    fontSize: 12,
    bold: true,
    color: LIME_ACCENT,
    align: 'center',
    fontFace: 'Arial',
  });

  // Project Title
  slide.addText('“VIBECHECK ROOMS”', {
    x: 1.0,
    y: 1.7,
    w: 11.3,
    h: 1.1,
    fontSize: 40,
    bold: true,
    color: TEXT_WHITE,
    align: 'center',
    fontFace: 'Arial',
  });

  // Subtitle
  slide.addText('A Real-Time Group Mood Synchronization & Collaborative Music Sharing Platform', {
    x: 1.0,
    y: 2.8,
    w: 11.3,
    h: 0.5,
    fontSize: 15,
    color: CYAN_ACCENT,
    align: 'center',
    fontFace: 'Arial',
  });

  slide.addText('Minor Project (BCA-508) Presentation for BCA 5th Semester\nAffiliated with Chaudhary Charan Singh University (CCSU), Meerut', {
    x: 1.0,
    y: 3.4,
    w: 11.3,
    h: 0.6,
    fontSize: 12,
    color: TEXT_MUTED,
    align: 'center',
    fontFace: 'Arial',
  });

  // Candidate & Panel Box
  slide.addShape(pptx.ShapeType.rect, {
    x: 1.5,
    y: 4.3,
    w: 10.3,
    h: 2.2,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1.5 },
  });

  // Submitted By (Left)
  slide.addText([
    { text: 'SUBMITTED BY:\n', options: { bold: true, color: LIME_ACCENT, fontSize: 11 } },
    { text: 'GAURAV SINGH\n', options: { bold: true, color: TEXT_WHITE, fontSize: 16 } },
    { text: 'University Roll No.: 240919106084\n', options: { color: TEXT_WHITE, fontSize: 12 } },
    { text: 'BCA (Batch 2024–2027)\nSOIT, IMS Noida', options: { color: TEXT_MUTED, fontSize: 11 } },
  ], {
    x: 2.0,
    y: 4.6,
    w: 4.8,
    h: 1.6,
    fontFace: 'Arial',
  });

  // Under Guidance Of (Right)
  slide.addText([
    { text: 'UNDER GUIDANCE OF:\n', options: { bold: true, color: PINK_ACCENT, fontSize: 11 } },
    { text: 'School of Information Technology\n', options: { bold: true, color: TEXT_WHITE, fontSize: 14 } },
    { text: 'HOD: Ms. Monika Dixit Bajpai\n', options: { color: TEXT_WHITE, fontSize: 12 } },
    { text: 'Project Coordinators: Mr. Anushrav Mudgal, Mr. Nihal Kumar', options: { color: TEXT_MUTED, fontSize: 11 } },
  ], {
    x: 6.8,
    y: 4.6,
    w: 4.8,
    h: 1.6,
    fontFace: 'Arial',
  });
}

// ==========================================
// SLIDE 2: INTRODUCTION & PROBLEM BACKGROUND
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '1. Introduction & Problem Statement');
  addFooter(slide);

  // Left Card: The Problem
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.7,
    w: 5.6,
    h: 5.0,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1 },
  });

  slide.addText('The Problem in Modern Friend Groups', {
    x: 1.1,
    y: 1.9,
    w: 5.0,
    h: 0.4,
    fontSize: 15,
    bold: true,
    color: PINK_ACCENT,
    fontFace: 'Arial',
  });

  slide.addText([
    { text: '• Busy Group Chat Chaos:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Mood updates and music recommendations get buried under hundreds of chat messages within minutes.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Proprietary Algorithm Barriers:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Services like Spotify Blend depend on private streaming history and fail to capture how people feel on a specific day.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Absence of lightweight spaces:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'No free, cross-platform space exists where friends can combine self-reported mood with music in under 15 seconds.', options: { color: TEXT_MUTED } },
  ], {
    x: 1.1,
    y: 2.4,
    w: 5.0,
    h: 4.0,
    fontSize: 12,
    fontFace: 'Arial',
  });

  // Right Card: The Solution
  slide.addShape(pptx.ShapeType.rect, {
    x: 6.8,
    y: 1.7,
    w: 5.7,
    h: 5.0,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1 },
  });

  slide.addText('The VibeCheck Rooms Solution', {
    x: 7.1,
    y: 1.9,
    w: 5.0,
    h: 0.4,
    fontSize: 15,
    bold: true,
    color: LIME_ACCENT,
    fontFace: 'Arial',
  });

  slide.addText([
    { text: '• Private Invite-Only Rooms:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Users create rooms and invite friends using an unambiguous 6-character room code.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Quick Daily Check-In:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Choose 1 of 8 moods, set energy (1-5), write a short note, and attach up to 3 songs.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Collective Group Vibe Score (0-100):\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'A transparent mathematical algorithm calculates the room’s vibe score, dominant mood, and auto-builds a shared playlist.', options: { color: TEXT_MUTED } },
  ], {
    x: 7.1,
    y: 2.4,
    w: 5.1,
    h: 4.0,
    fontSize: 12,
    fontFace: 'Arial',
  });
}

// ==========================================
// SLIDE 3: OBJECTIVES OF THE PROJECT
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '2. Objectives & Scope of the Project');
  addFooter(slide);

  const objectives = [
    { num: '01', title: 'Seamless Room Creation & Access Control', desc: 'Allow users to register securely, create rooms with unique 6-character codes, and manage members.' },
    { num: '02', title: 'Low-Friction 15-Second Check-In Flow', desc: 'Enable quick mood selection (8 moods), energy ratings (1-5), optional notes, and up to 3 song attachments.' },
    { num: '03', title: 'Transparent Mathematical Vibe Engine', desc: 'Compute rolling 24-hour Group Vibe Score (0-100), dominant room mood, and mood-mix distribution.' },
    { num: '04', title: 'Collaborative Music Curation & Moderation', desc: 'Aggregate members’ music into a shared playlist and provide admin controls to moderate content and members.' },
    { num: '05', title: 'Zero-Cost Cloud Deployment', desc: 'Host production frontend on Vercel, REST API on Render, and PostgreSQL database on Supabase at Rs. 0 cost.' },
  ];

  objectives.forEach((obj, idx) => {
    const yPos = 1.6 + idx * 1.0;
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: yPos,
      w: 11.7,
      h: 0.85,
      fill: { color: SURFACE_DARK },
      line: { color: BORDER_COLOR, width: 1 },
    });

    slide.addText(obj.num, {
      x: 1.0,
      y: yPos + 0.15,
      w: 0.7,
      h: 0.5,
      fontSize: 18,
      bold: true,
      color: LIME_ACCENT,
      fontFace: 'Arial',
    });

    slide.addText(obj.title, {
      x: 1.8,
      y: yPos + 0.1,
      w: 9.5,
      h: 0.35,
      fontSize: 13,
      bold: true,
      color: TEXT_WHITE,
      fontFace: 'Arial',
    });

    slide.addText(obj.desc, {
      x: 1.8,
      y: yPos + 0.42,
      w: 10.0,
      h: 0.35,
      fontSize: 11,
      color: TEXT_MUTED,
      fontFace: 'Arial',
    });
  });
}

// ==========================================
// SLIDE 4: THREE-TIER ARCHITECTURE
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '3. Three-Tier System Architecture');
  addFooter(slide);

  // Presentation Tier Box
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.7,
    w: 3.6,
    h: 5.0,
    fill: { color: SURFACE_DARK },
    line: { color: CYAN_ACCENT, width: 2 },
  });

  slide.addText('TIER 1: PRESENTATION', {
    x: 1.0,
    y: 1.9,
    w: 3.2,
    h: 0.3,
    fontSize: 11,
    bold: true,
    color: CYAN_ACCENT,
    fontFace: 'Arial',
  });

  slide.addText('Client Application (SPA)', {
    x: 1.0,
    y: 2.2,
    w: 3.2,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: TEXT_WHITE,
    fontFace: 'Arial',
  });

  slide.addText([
    { text: '• React 19 + Vite\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'High-performance Single Page Application.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Tailwind CSS v4\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Dark-theme design system with custom mood palette.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Client State & Polling\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Automated 20-second polling for real-time room updates.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Deployment:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Vercel Edge Global CDN', options: { color: CYAN_ACCENT } },
  ], {
    x: 1.0,
    y: 2.7,
    w: 3.2,
    h: 3.8,
    fontSize: 11,
    fontFace: 'Arial',
  });

  // Application Tier Box
  slide.addShape(pptx.ShapeType.rect, {
    x: 4.85,
    y: 1.7,
    w: 3.6,
    h: 5.0,
    fill: { color: SURFACE_DARK },
    line: { color: LIME_ACCENT, width: 2 },
  });

  slide.addText('TIER 2: APPLICATION', {
    x: 5.05,
    y: 1.9,
    w: 3.2,
    h: 0.3,
    fontSize: 11,
    bold: true,
    color: LIME_ACCENT,
    fontFace: 'Arial',
  });

  slide.addText('Express 5 REST API', {
    x: 5.05,
    y: 2.2,
    w: 3.2,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: TEXT_WHITE,
    fontFace: 'Arial',
  });

  slide.addText([
    { text: '• Node.js 20/24 Runtime\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Asynchronous event-driven REST API server.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Pure Vibe Score Engine\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Deterministic business logic with unit test coverage.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Security Middleware\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Helmet security headers, CORS filtering & rate limiting.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Deployment:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Render Cloud Web Service', options: { color: LIME_ACCENT } },
  ], {
    x: 5.05,
    y: 2.7,
    w: 3.2,
    h: 3.8,
    fontSize: 11,
    fontFace: 'Arial',
  });

  // Data Tier Box
  slide.addShape(pptx.ShapeType.rect, {
    x: 8.9,
    y: 1.7,
    w: 3.6,
    h: 5.0,
    fill: { color: SURFACE_DARK },
    line: { color: PINK_ACCENT, width: 2 },
  });

  slide.addText('TIER 3: DATA TIER', {
    x: 9.1,
    y: 1.9,
    w: 3.2,
    h: 0.3,
    fontSize: 11,
    bold: true,
    color: PINK_ACCENT,
    fontFace: 'Arial',
  });

  slide.addText('Supabase PostgreSQL', {
    x: 9.1,
    y: 2.2,
    w: 3.2,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: TEXT_WHITE,
    fontFace: 'Arial',
  });

  slide.addText([
    { text: '• Relational PostgreSQL DB\n', options: { bold: true, color: TEXT_WHITE } },
    { text: '5 tables in 3rd Normal Form (3NF) with constraints.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Atomic Transactions\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'PL/pgSQL RPC function saves checkin & songs together.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Row Level Security (RLS)\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Deny-by-default access policies & JWT verification.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Deployment:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Supabase Managed Cloud', options: { color: PINK_ACCENT } },
  ], {
    x: 9.1,
    y: 2.7,
    w: 3.2,
    h: 3.8,
    fontSize: 11,
    fontFace: 'Arial',
  });
}

// ==========================================
// SLIDE 5: USER JOURNEY & CORE TRANSACTION FLOW
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '4. User Flow & Core Transaction: Mood Check-in');
  addFooter(slide);

  const steps = [
    { title: '1. Authenticate', desc: 'User logs in or uses demo reviewer account. JWT issued.' },
    { title: '2. Access Room', desc: 'Create room or enter 6-character code. Membership validated.' },
    { title: '3. Form Input', desc: 'Select 1 of 8 moods, set energy (1-5), optional note & 0-3 songs.' },
    { title: '4. Atomic Save', desc: 'POST request invokes RPC function; checkin & songs saved atomically.' },
    { title: '5. Vibe Update', desc: 'Vibe engine recalculates score; dashboard, chart & playlist refresh.' },
  ];

  steps.forEach((st, idx) => {
    const xPos = 0.8 + idx * 2.4;
    slide.addShape(pptx.ShapeType.rect, {
      x: xPos,
      y: 1.8,
      w: 2.2,
      h: 2.2,
      fill: { color: SURFACE_DARK },
      line: { color: BORDER_COLOR, width: 1.5 },
    });

    slide.addText(`STEP 0${idx + 1}`, {
      x: xPos + 0.15,
      y: 2.0,
      w: 1.9,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: LIME_ACCENT,
      fontFace: 'Arial',
    });

    slide.addText(st.title, {
      x: xPos + 0.15,
      y: 2.3,
      w: 1.9,
      h: 0.4,
      fontSize: 13,
      bold: true,
      color: TEXT_WHITE,
      fontFace: 'Arial',
    });

    slide.addText(st.desc, {
      x: xPos + 0.15,
      y: 2.75,
      w: 1.9,
      h: 1.1,
      fontSize: 11,
      color: TEXT_MUTED,
      fontFace: 'Arial',
    });
  });

  // Table summary below
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 4.3,
    w: 11.7,
    h: 2.4,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1 },
  });

  slide.addText('Transactional Guarantees & Constraints', {
    x: 1.1,
    y: 4.5,
    w: 8.0,
    h: 0.3,
    fontSize: 13,
    bold: true,
    color: VIOLET_ACCENT,
    fontFace: 'Arial',
  });

  slide.addText([
    { text: '• Rolling 24-Hour Scope: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Only the single latest check-in per member within the last 24 hours counts towards the score.\n', options: { color: TEXT_MUTED } },
    { text: '• All-or-Nothing Integrity: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'The Postgres RPC ensures check-ins and songs cannot be partially inserted; failures rollback cleanly.\n', options: { color: TEXT_MUTED } },
    { text: '• Immediate Client Feedback: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'The check-in endpoint returns the fresh vibe score payload, allowing instant UI updates without reload.', options: { color: TEXT_MUTED } },
  ], {
    x: 1.1,
    y: 4.9,
    w: 11.0,
    h: 1.6,
    fontSize: 11,
    fontFace: 'Arial',
  });
}

// ==========================================
// SLIDE 6: DATA FLOW DIAGRAMS (DFD)
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '5. Data Flow Diagrams (DFD Hierarchy)');
  addFooter(slide);

  // Level 0 Card
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.7,
    w: 3.7,
    h: 5.0,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1 },
  });

  slide.addText('DFD Level 0 (Context)', {
    x: 1.0,
    y: 1.9,
    w: 3.3,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: LIME_ACCENT,
    fontFace: 'Arial',
  });

  slide.addText([
    { text: '• External Entities:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: '1. Member\n2. Room Admin\n\n', options: { color: CYAN_ACCENT } },
    { text: '• Inputs from Member:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Auth details, room create/join, mood check-in & songs.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Inputs from Admin:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Moderation actions, code regeneration, close room.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Outputs to User:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Vibe score, dominant mood, mood-mix chart & shared playlist.', options: { color: TEXT_MUTED } },
  ], {
    x: 1.0,
    y: 2.4,
    w: 3.3,
    h: 4.0,
    fontSize: 11,
    fontFace: 'Arial',
  });

  // Level 1 Card
  slide.addShape(pptx.ShapeType.rect, {
    x: 4.8,
    y: 1.7,
    w: 3.7,
    h: 5.0,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1 },
  });

  slide.addText('DFD Level 1 (Subsystems)', {
    x: 5.0,
    y: 1.9,
    w: 3.3,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: VIOLET_ACCENT,
    fontFace: 'Arial',
  });

  slide.addText([
    { text: '• 1.0 Authentication:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Registers/logs in users; writes to D1 Profiles.\n\n', options: { color: TEXT_MUTED } },
    { text: '• 2.0 Room Management:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Generates codes & links members; stores in D2.\n\n', options: { color: TEXT_MUTED } },
    { text: '• 3.0 Check-in & Songs:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Validates & writes records to D3 & D4.\n\n', options: { color: TEXT_MUTED } },
    { text: '• 4.0 Vibe Calculation:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Aggregates checkins to compute score & mix.\n\n', options: { color: TEXT_MUTED } },
    { text: '• 5.0 Admin Moderation:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Manages memberships and room lifecycle.', options: { color: TEXT_MUTED } },
  ], {
    x: 5.0,
    y: 2.4,
    w: 3.3,
    h: 4.0,
    fontSize: 11,
    fontFace: 'Arial',
  });

  // Level 2 Card
  slide.addShape(pptx.ShapeType.rect, {
    x: 8.8,
    y: 1.7,
    w: 3.7,
    h: 5.0,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1 },
  });

  slide.addText('DFD Level 2 (Check-in)', {
    x: 9.0,
    y: 1.9,
    w: 3.3,
    h: 0.4,
    fontSize: 14,
    bold: true,
    color: PINK_ACCENT,
    fontFace: 'Arial',
  });

  slide.addText([
    { text: '• 3.1 Session & Membership:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Verifies bearer JWT & active room membership.\n\n', options: { color: TEXT_MUTED } },
    { text: '• 3.2 Schema Validation:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Checks mood enum, energy range (1-5), ≤80 chars note, and ≤3 songs.\n\n', options: { color: TEXT_MUTED } },
    { text: '• 3.3 / 3.4 Atomic Insertion:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Inserts 1 checkin row and up to 3 song rows.\n\n', options: { color: TEXT_MUTED } },
    { text: '• 3.5 Recalculate Vibe Score:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Re-evaluates 24h score & triggers UI refresh.', options: { color: TEXT_MUTED } },
  ], {
    x: 9.0,
    y: 2.4,
    w: 3.3,
    h: 4.0,
    fontSize: 11,
    fontFace: 'Arial',
  });
}

// ==========================================
// SLIDE 7: ENTITY RELATIONSHIP DIAGRAM (ERD)
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '6. Entity Relationship Diagram (ERD & 3NF)');
  addFooter(slide);

  const tables = [
    { name: 'profiles', keys: 'PK: id (UUID)', cols: 'display_name, email, avatar_color, created_at' },
    { name: 'rooms', keys: 'PK: id | FK: created_by', cols: 'name, room_code (UK), is_active, created_at' },
    { name: 'room_members', keys: 'PK: id | FK: room_id, user_id', cols: 'role (admin/member), joined_at' },
    { name: 'mood_checkins', keys: 'PK: id | FK: room_id, user_id', cols: 'mood (enum), energy (1-5), note (max 80), created_at' },
    { name: 'songs', keys: 'PK: id | FK: checkin_id', cols: 'title, artist, link_url, position (1-3)' },
  ];

  tables.forEach((tbl, idx) => {
    const yPos = 1.7 + idx * 0.98;
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: yPos,
      w: 11.7,
      h: 0.85,
      fill: { color: SURFACE_DARK },
      line: { color: BORDER_COLOR, width: 1 },
    });

    slide.addText(tbl.name, {
      x: 1.1,
      y: yPos + 0.15,
      w: 2.2,
      h: 0.35,
      fontSize: 14,
      bold: true,
      color: LIME_ACCENT,
      fontFace: 'Arial',
    });

    slide.addText(tbl.keys, {
      x: 3.4,
      y: yPos + 0.15,
      w: 3.2,
      h: 0.35,
      fontSize: 11,
      bold: true,
      color: CYAN_ACCENT,
      fontFace: 'Arial',
    });

    slide.addText(tbl.cols, {
      x: 6.8,
      y: yPos + 0.15,
      w: 5.5,
      h: 0.5,
      fontSize: 11,
      color: TEXT_MUTED,
      fontFace: 'Arial',
    });
  });

  // Note on 3NF
  slide.addText('Third Normal Form (3NF) Certified: Resolves M:N user-room relationship via junction table room_members. Zero redundant columns. Cascading deletes on foreign keys.', {
    x: 0.8,
    y: 6.7,
    w: 11.7,
    h: 0.3,
    fontSize: 10,
    color: TEXT_MUTED,
    italic: true,
    fontFace: 'Arial',
  });
}

// ==========================================
// SLIDE 8: CORE ALGORITHM & WORKED EXAMPLE
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '7. Vibe Score Algorithm & Mathematical Proof');
  addFooter(slide);

  // Formula Card
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.7,
    w: 11.7,
    h: 1.5,
    fill: { color: SURFACE_DARK },
    line: { color: LIME_ACCENT, width: 1.5 },
  });

  slide.addText('Mathematical Formula (Rolling 24-Hour Scope)', {
    x: 1.1,
    y: 1.9,
    w: 8.0,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: LIME_ACCENT,
    fontFace: 'Arial',
  });

  slide.addText('Group Vibe Score = round( sum(Mood Scores of Active Members) / Number of Active Members )', {
    x: 1.1,
    y: 2.25,
    w: 11.0,
    h: 0.45,
    fontSize: 15,
    bold: true,
    color: TEXT_WHITE,
    fontFace: 'Courier New',
  });

  slide.addText('Dominant Mood: Highest frequency mood among active members. Tie-breaker: most recent submission timestamp.', {
    x: 1.1,
    y: 2.75,
    w: 11.0,
    h: 0.3,
    fontSize: 11,
    color: TEXT_MUTED,
    fontFace: 'Arial',
  });

  // Worked Example Table Card
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 3.4,
    w: 11.7,
    h: 3.3,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1 },
  });

  slide.addText('Worked Example Test Case: Room "Late Night Crew"', {
    x: 1.1,
    y: 3.6,
    w: 8.0,
    h: 0.3,
    fontSize: 13,
    bold: true,
    color: VIOLET_ACCENT,
    fontFace: 'Arial',
  });

  const memberData = [
    { name: 'Rahul', mood: 'Chill (🌊)', score: '70', energy: '3 / 5', contribution: '70' },
    { name: 'Aman', mood: 'Hyped (⚡)', score: '85', energy: '5 / 5', contribution: '85' },
    { name: 'Rohit', mood: 'Happy (😊)', score: '90', energy: '4 / 5', contribution: '90' },
    { name: 'Gaurav', mood: 'Chill (🌊)', score: '70', energy: '3 / 5', contribution: '70' },
  ];

  memberData.forEach((m, idx) => {
    const yPos = 4.0 + idx * 0.45;
    slide.addText(`${m.name}: ${m.mood} • Score: ${m.score} • Energy: ${m.energy}`, {
      x: 1.1,
      y: yPos,
      w: 6.5,
      h: 0.35,
      fontSize: 11,
      color: TEXT_WHITE,
      fontFace: 'Arial',
    });
  });

  // Result summary box
  slide.addShape(pptx.ShapeType.rect, {
    x: 7.8,
    y: 3.9,
    w: 4.3,
    h: 2.5,
    fill: { color: SURFACE_2 },
    line: { color: LIME_ACCENT, width: 1 },
  });

  slide.addText([
    { text: 'CALCULATED OUTPUT:\n\n', options: { bold: true, color: LIME_ACCENT, fontSize: 11 } },
    { text: '• Total Mood Score: 315\n', options: { color: TEXT_WHITE, fontSize: 12 } },
    { text: '• Active Members: 4\n', options: { color: TEXT_WHITE, fontSize: 12 } },
    { text: '• Calculation: 315 / 4 = 78.75\n', options: { color: TEXT_WHITE, fontSize: 12 } },
    { text: '• Final Score: 79 (Good vibes)\n', options: { bold: true, color: LIME_ACCENT, fontSize: 13 } },
    { text: '• Dominant Mood: Chill (2 of 4)\n', options: { color: CYAN_ACCENT, fontSize: 12 } },
    { text: '• Average Energy: 3.8 / 5', options: { color: AMBER_ACCENT, fontSize: 12 } },
  ], {
    x: 8.0,
    y: 4.1,
    w: 3.9,
    h: 2.2,
    fontFace: 'Arial',
  });
}

// ==========================================
// SLIDE 9: FRONTEND UI & FEATURES
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '8. User Interface Design & Key Pages');
  addFooter(slide);

  const pages = [
    { title: '1. Landing / Home Page', desc: 'Hero headline "What’s the vibe today?", room code entry, how-it-works cards, and interactive demo preview.' },
    { title: '2. Login & Sign-up Modal', desc: 'Instant authentication, inline validation, and 1-click fast-track demo login for examiners.' },
    { title: '3. Room Dashboard', desc: 'Hero VibeMeter (0-100), 8-mood checkin form, energy selector, mood-mix chart, and shared playlist.' },
    { title: '4. Admin Moderation Panel', desc: 'Room statistics, member removal, 6-character code regeneration, check-in deletion, and room archiving.' },
    { title: '5. Room History Page', desc: 'Chronological archive of past check-ins, member notes, and attached songs with timestamp tracking.' },
  ];

  pages.forEach((p, idx) => {
    const yPos = 1.7 + idx * 0.98;
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: yPos,
      w: 11.7,
      h: 0.85,
      fill: { color: SURFACE_DARK },
      line: { color: BORDER_COLOR, width: 1 },
    });

    slide.addText(p.title, {
      x: 1.1,
      y: yPos + 0.15,
      w: 3.5,
      h: 0.4,
      fontSize: 13,
      bold: true,
      color: LIME_ACCENT,
      fontFace: 'Arial',
    });

    slide.addText(p.desc, {
      x: 4.8,
      y: yPos + 0.15,
      w: 7.4,
      h: 0.55,
      fontSize: 11,
      color: TEXT_MUTED,
      fontFace: 'Arial',
    });
  });
}

// ==========================================
// SLIDE 10: ADMIN MODERATION SYSTEM
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '9. Role-Based Moderation & Admin System');
  addFooter(slide);

  const adminFeatures = [
    { title: 'Server-Enforced RBAC', desc: 'Routes /api/rooms/:id/stats and moderation endpoints strictly verify role in room_members table. Non-admins receive HTTP 403 Forbidden.' },
    { title: 'Live Statistics Telemetry', desc: 'Instant visibility over total members, check-ins, shared playlist tracks, and members active in the last 24 hours.' },
    { title: 'Cascading Member Removal', desc: 'Removing a member deletes their check-ins and songs, preventing orphan records and preserving clean vibe scores.' },
    { title: 'Invite Code Invalidation', desc: 'One-click code regeneration instantly terminates compromised or old room codes and creates a fresh 6-character token.' },
    { title: 'Room Archival (Danger Zone)', desc: 'Admins can close the room. Closed rooms prevent new member joins and disable check-in posting permanently.' },
  ];

  adminFeatures.forEach((af, idx) => {
    const yPos = 1.7 + idx * 0.98;
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.8,
      y: yPos,
      w: 11.7,
      h: 0.85,
      fill: { color: SURFACE_DARK },
      line: { color: BORDER_COLOR, width: 1 },
    });

    slide.addText(af.title, {
      x: 1.1,
      y: yPos + 0.15,
      w: 3.5,
      h: 0.4,
      fontSize: 13,
      bold: true,
      color: PINK_ACCENT,
      fontFace: 'Arial',
    });

    slide.addText(af.desc, {
      x: 4.8,
      y: yPos + 0.15,
      w: 7.4,
      h: 0.55,
      fontSize: 11,
      color: TEXT_MUTED,
      fontFace: 'Arial',
    });
  });
}

// ==========================================
// SLIDE 11: HARDWARE & SOFTWARE SPECIFICATIONS
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '10. Technical Requirements & Deployment Stack');
  addFooter(slide);

  // Left: Software Stack
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.7,
    w: 5.6,
    h: 5.0,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1 },
  });

  slide.addText('Software & Development Stack', {
    x: 1.1,
    y: 1.9,
    w: 5.0,
    h: 0.4,
    fontSize: 15,
    bold: true,
    color: CYAN_ACCENT,
    fontFace: 'Arial',
  });

  slide.addText([
    { text: '• Operating System: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Windows 10/11 / Linux (Ubuntu 22.04)\n\n', options: { color: TEXT_MUTED } },
    { text: '• Runtime & Backend: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Node.js 20/24 LTS, Express 5, TypeScript\n\n', options: { color: TEXT_MUTED } },
    { text: '• Frontend: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'React 19, Vite, Tailwind CSS v4, Lucide Icons\n\n', options: { color: TEXT_MUTED } },
    { text: '• Database & Auth: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Supabase PostgreSQL, Supabase Auth (JWT)\n\n', options: { color: TEXT_MUTED } },
    { text: '• Testing & Tools: ', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Vitest, Supertest, VS Code, Git & GitHub', options: { color: TEXT_MUTED } },
  ], {
    x: 1.1,
    y: 2.5,
    w: 5.0,
    h: 3.9,
    fontSize: 12,
    fontFace: 'Arial',
  });

  // Right: Cloud Deployment & Budget
  slide.addShape(pptx.ShapeType.rect, {
    x: 6.8,
    y: 1.7,
    w: 5.7,
    h: 5.0,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1 },
  });

  slide.addText('Cloud Infrastructure (Rs. 0 Cost)', {
    x: 7.1,
    y: 1.9,
    w: 5.0,
    h: 0.4,
    fontSize: 15,
    bold: true,
    color: LIME_ACCENT,
    fontFace: 'Arial',
  });

  slide.addText([
    { text: '• Frontend Hosting: Vercel Hobby\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Global edge deployment with automatic SSL.\nCost: Rs. 0\n\n', options: { color: TEXT_MUTED } },
    { text: '• API Hosting: Render Free Tier\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Node.js container with health checks (/api/health).\nCost: Rs. 0\n\n', options: { color: TEXT_MUTED } },
    { text: '• Managed Database: Supabase Cloud\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'PostgreSQL instance with automated backups.\nCost: Rs. 0\n\n', options: { color: TEXT_MUTED } },
    { text: 'TOTAL INFRASTRUCTURE EXPENSE: Rs. 0', options: { bold: true, color: LIME_ACCENT, fontSize: 13 } },
  ], {
    x: 7.1,
    y: 2.5,
    w: 5.1,
    h: 3.9,
    fontSize: 12,
    fontFace: 'Arial',
  });
}

// ==========================================
// SLIDE 12: LIMITATIONS & FUTURE SCOPE
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '11. Limitations & Future Scope');
  addFooter(slide);

  // Left: Limitations
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.7,
    w: 5.6,
    h: 5.0,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1 },
  });

  slide.addText('Current Project Limitations', {
    x: 1.1,
    y: 1.9,
    w: 5.0,
    h: 0.4,
    fontSize: 15,
    bold: true,
    color: PINK_ACCENT,
    fontFace: 'Arial',
  });

  slide.addText([
    { text: '• Free-Tier Spin Down:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Render free services sleep after 15 min idle; cold start takes ~50 seconds.\n\n', options: { color: TEXT_MUTED } },
    { text: '• Manual Music Linking:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Songs are stored as metadata and links; no embedded streaming player.\n\n', options: { color: TEXT_MUTED } },
    { text: '• 20-Second Polling:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Near real-time refresh rather than WebSocket push streams.', options: { color: TEXT_MUTED } },
  ], {
    x: 1.1,
    y: 2.5,
    w: 5.0,
    h: 3.9,
    fontSize: 12,
    fontFace: 'Arial',
  });

  // Right: Future Scope
  slide.addShape(pptx.ShapeType.rect, {
    x: 6.8,
    y: 1.7,
    w: 5.7,
    h: 5.0,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1 },
  });

  slide.addText('Future Roadmap & Enhancements', {
    x: 7.1,
    y: 1.9,
    w: 5.0,
    h: 0.4,
    fontSize: 15,
    bold: true,
    color: LIME_ACCENT,
    fontFace: 'Arial',
  });

  slide.addText([
    { text: '• Spotify Web API Integration:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Search track catalog, display album art, and play 30s previews directly.\n\n', options: { color: TEXT_MUTED } },
    { text: '• WebSockets / Supabase Realtime:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Instant bi-directional vibe updates with zero polling latency.\n\n', options: { color: TEXT_MUTED } },
    { text: '• AI Mood Insights & Weekly Recaps:\n', options: { bold: true, color: TEXT_WHITE } },
    { text: 'Analyze trends over time (e.g. "Your room is happiest on Fridays!").', options: { color: TEXT_MUTED } },
  ], {
    x: 7.1,
    y: 2.5,
    w: 5.1,
    h: 3.9,
    fontSize: 12,
    fontFace: 'Arial',
  });
}

// ==========================================
// SLIDE 13: LIVE DEMO & EXAMINER FAST-TRACK
// ==========================================
{
  const slide = pptx.addSlide();
  addHeader(slide, '12. Live Demonstration & Verification');
  addFooter(slide);

  // Big Demo Credentials Box
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 1.7,
    w: 11.7,
    h: 5.0,
    fill: { color: SURFACE_DARK },
    line: { color: LIME_ACCENT, width: 2 },
  });

  slide.addText('Examiner Fast-Track Review Credentials', {
    x: 1.1,
    y: 2.0,
    w: 11.0,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: LIME_ACCENT,
    fontFace: 'Arial',
  });

  slide.addText([
    { text: '• Seeded Demo Room: ', options: { bold: true, color: TEXT_WHITE, fontSize: 13 } },
    { text: '“Late Night Crew”\n', options: { bold: true, color: CYAN_ACCENT, fontSize: 13 } },
    { text: '• Room Invite Code: ', options: { bold: true, color: TEXT_WHITE, fontSize: 13 } },
    { text: 'K7P2QX\n\n', options: { bold: true, color: LIME_ACCENT, fontSize: 15 } },

    { text: '• Member Walkthrough: ', options: { bold: true, color: TEXT_WHITE, fontSize: 13 } },
    { text: 'Click "Demo Member (Rahul)" on the login modal to view the room, see the 79 Good vibes score, post a new check-in with songs, and inspect the shared playlist.\n\n', options: { color: TEXT_MUTED, fontSize: 12 } },

    { text: '• Admin Walkthrough: ', options: { bold: true, color: TEXT_WHITE, fontSize: 13 } },
    { text: 'Click "Demo Admin (Gaurav)" to open the Admin Panel, view room statistics (42 check-ins, 96 songs), regenerate the room code, delete spam, or close the room.\n\n', options: { color: TEXT_MUTED, fontSize: 12 } },

    { text: '• Automated Unit Tests: ', options: { bold: true, color: TEXT_WHITE, fontSize: 13 } },
    { text: 'Run `npm test` in the server directory to verify the 315/4 = 79 worked example unit tests pass cleanly.', options: { color: TEXT_MUTED, fontSize: 12 } },
  ], {
    x: 1.1,
    y: 2.6,
    w: 11.0,
    h: 3.8,
    fontFace: 'Arial',
  });
}

// ==========================================
// SLIDE 14: CONCLUSION & THANK YOU
// ==========================================
{
  const slide = pptx.addSlide();
  slide.background = { color: BG_DARK };

  slide.addText('THANK YOU!', {
    x: 1.0,
    y: 1.8,
    w: 11.3,
    h: 1.0,
    fontSize: 44,
    bold: true,
    color: LIME_ACCENT,
    align: 'center',
    fontFace: 'Arial',
  });

  slide.addText('Questions & Answers', {
    x: 1.0,
    y: 2.8,
    w: 11.3,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: TEXT_WHITE,
    align: 'center',
    fontFace: 'Arial',
  });

  // Candidate Details Card
  slide.addShape(pptx.ShapeType.rect, {
    x: 2.5,
    y: 3.7,
    w: 8.3,
    h: 2.5,
    fill: { color: SURFACE_DARK },
    line: { color: BORDER_COLOR, width: 1.5 },
  });

  slide.addText([
    { text: 'GAURAV SINGH\n', options: { bold: true, color: TEXT_WHITE, fontSize: 18 } },
    { text: 'University Roll No.: 240919106084\n', options: { bold: true, color: CYAN_ACCENT, fontSize: 13 } },
    { text: 'Email: gauravsingh.bcr24079@imsnoida.com • Mobile: +91 7289860248\n\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: 'Bachelor of Computer Application (BCA 5th Sem, Batch 2024–27)\n', options: { color: TEXT_WHITE, fontSize: 12 } },
    { text: 'School of Information Technology, Institute of Management Studies, Noida\n', options: { color: TEXT_MUTED, fontSize: 11 } },
    { text: 'Chaudhary Charan Singh University (CCSU), Meerut', options: { color: LIME_ACCENT, fontSize: 11, bold: true } },
  ], {
    x: 2.8,
    y: 4.0,
    w: 7.7,
    h: 2.0,
    align: 'center',
    fontFace: 'Arial',
  });
}

// Save presentation file
const outputPath = path.resolve('C:/Users/DELL/Desktop/VibeCheck/VibeCheck_Rooms_Minor_Project_Presentation.pptx');

pptx.writeFile({ fileName: outputPath })
  .then((fileName) => {
    console.log(`[PPTX] Presentation generated successfully: ${fileName}`);
  })
  .catch((err) => {
    console.error(`[PPTX] Error generating presentation:`, err);
    process.exit(1);
  });
