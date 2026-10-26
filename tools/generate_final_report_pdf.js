// tools/generate_final_report_pdf.js
// Compiles the complete Final Minor Project Report with Code for BCA-508

const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

async function generateFinalReport() {
  console.log('[PDF] Loading existing synopsis PDF...');
  const synopsisPath = path.resolve('c:/Users/DELL/Desktop/VibeCheck/VibeCheck_Rooms_BCA508_Synopsis_Gaurav_Singh.pdf');
  const synopsisBytes = fs.readFileSync(synopsisPath);
  const srcDoc = await PDFDocument.load(synopsisBytes);

  const outDoc = await PDFDocument.create();

  // Load Standard Fonts
  const helvetica = await outDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await outDoc.embedFont(StandardFonts.HelveticaBold);
  const courier = await outDoc.embedFont(StandardFonts.Courier);
  const courierBold = await outDoc.embedFont(StandardFonts.CourierBold);

  // Copy Pages 1 to 4 (Cover, Proforma, Acknowledgment, Certificate of Originality)
  console.log('[PDF] Copying institutional front pages (1 to 4)...');
  const frontPages = await outDoc.copyPages(srcDoc, [0, 1, 2, 3]);
  frontPages.forEach((p) => outDoc.addPage(p));

  // Insert Page 5: Mandatory Internship Completion Certificate
  console.log('[PDF] Embedding Internship Completion Certificate after page 4...');
  const certImgPath = path.resolve('c:/Users/DELL/Desktop/VibeCheck/WhatsApp Image 2026-10-25 at 6.05.59 AM (1).jpeg');
  if (fs.existsSync(certImgPath)) {
    const certImgBytes = fs.readFileSync(certImgPath);
    const certImage = await outDoc.embedJpg(certImgBytes);

    const certPage = outDoc.addPage([595.28, 841.89]); // A4 Size
    const { width, height } = certPage.getSize();

    certPage.drawText('INTERNSHIP COMPLETION CERTIFICATE', {
      x: width / 2 - 160,
      y: height - 50,
      size: 14,
      font: helveticaBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Draw image centered
    const imgDims = certImage.scale(0.55);
    certPage.drawImage(certImage, {
      x: width / 2 - imgDims.width / 2,
      y: height / 2 - imgDims.height / 2 - 20,
      width: imgDims.width,
      height: imgDims.height,
    });

    certPage.drawText('5', {
      x: width / 2,
      y: 30,
      size: 10,
      font: helvetica,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  // Copy remaining pages from Synopsis (Index through Page 37)
  console.log('[PDF] Copying main synopsis chapters (Pages 5 through 37)...');
  const remainingPageIndices = [];
  for (let i = 4; i < srcDoc.getPageCount(); i++) {
    remainingPageIndices.push(i);
  }
  const remainingPages = await outDoc.copyPages(srcDoc, remainingPageIndices);
  remainingPages.forEach((p) => outDoc.addPage(p));

  // Helper function to create text/code pages
  function addContentPage(title, subtitle = '') {
    const page = outDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    // Top Header
    page.drawText(title, {
      x: 50,
      y: height - 50,
      size: 14,
      font: helveticaBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    if (subtitle) {
      page.drawText(subtitle, {
        x: 50,
        y: height - 68,
        size: 10,
        font: helvetica,
        color: rgb(0.35, 0.35, 0.35),
      });
    }

    // Header divider line
    page.drawLine({
      start: { x: 50, y: height - 76 },
      end: { x: width - 50, y: height - 76 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    // Page footer
    const currentNum = outDoc.getPageCount();
    page.drawText(String(currentNum), {
      x: width / 2,
      y: 30,
      size: 10,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawText('VibeCheck Rooms • Minor Project (BCA-508) • Gaurav Singh', {
      x: 50,
      y: 30,
      size: 8,
      font: helvetica,
      color: rgb(0.5, 0.5, 0.5),
    });

    return page;
  }

  function renderCodeBlock(page, lines, startY = 740) {
    let y = startY;
    const lineHeight = 11;
    for (const line of lines) {
      if (y < 50) break;
      page.drawText(line.substring(0, 85), {
        x: 50,
        y,
        size: 8.5,
        font: courier,
        color: rgb(0.15, 0.15, 0.15),
      });
      y -= lineHeight;
    }
  }

  // ==========================================
  // CHAPTER 12: SOURCE CODE & IMPLEMENTATION
  // ==========================================
  console.log('[PDF] Adding Chapter 12: Source Code & Implementation...');

  // Page: Database Schema SQL
  {
    const page = addContentPage(
      '12. SYSTEM IMPLEMENTATION & SOURCE CODE LISTING',
      '12.1 Database Tier: PostgreSQL Relational Schema (supabase/migrations/0001_schema.sql)'
    );

    const sqlLines = [
      '-- Profiles table (mirrors auth.users)',
      'CREATE TABLE profiles (',
      '  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,',
      '  display_name TEXT NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 40),',
      '  email TEXT NOT NULL,',
      '  avatar_color TEXT NOT NULL DEFAULT \'#8B5CF6\',',
      '  created_at TIMESTAMPTZ NOT NULL DEFAULT now()',
      ');',
      '',
      '-- Rooms table',
      'CREATE TABLE rooms (',
      '  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),',
      '  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 40),',
      '  room_code CHAR(6) NOT NULL UNIQUE CHECK (room_code ~ \'^[A-Z0-9]{6}$\'),',
      '  created_by UUID NOT NULL REFERENCES profiles(id),',
      '  is_active BOOLEAN NOT NULL DEFAULT true,',
      '  created_at TIMESTAMPTZ NOT NULL DEFAULT now()',
      ');',
      '',
      '-- Room Members junction table (M:N)',
      'CREATE TABLE room_members (',
      '  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),',
      '  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,',
      '  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,',
      '  role TEXT NOT NULL DEFAULT \'member\' CHECK (role IN (\'admin\', \'member\')),',
      '  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),',
      '  UNIQUE (room_id, user_id)',
      ');',
      '',
      '-- Mood Check-ins table',
      'CREATE TABLE mood_checkins (',
      '  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),',
      '  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,',
      '  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,',
      '  mood TEXT NOT NULL CHECK (mood IN (\'happy\',\'hyped\',\'romantic\',\'chill\',',
      '                                      \'focused\',\'nostalgic\',\'stressed\',\'sad\')),',
      '  energy INTEGER NOT NULL CHECK (energy BETWEEN 1 AND 5),',
      '  note TEXT CHECK (note IS NULL OR char_length(note) <= 80),',
      '  created_at TIMESTAMPTZ NOT NULL DEFAULT now()',
      ');',
      '',
      '-- Songs table',
      'CREATE TABLE songs (',
      '  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),',
      '  checkin_id UUID NOT NULL REFERENCES mood_checkins(id) ON DELETE CASCADE,',
      '  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 100),',
      '  artist TEXT NOT NULL CHECK (char_length(artist) BETWEEN 1 AND 100),',
      '  link_url TEXT CHECK (link_url IS NULL OR link_url ~* \'^https?://\'),',
      '  position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 3),',
      '  UNIQUE (checkin_id, position)',
      ');',
      '',
      '-- Performance Indexes',
      'CREATE INDEX idx_room_members_user ON room_members (user_id);',
      'CREATE INDEX idx_room_members_room ON room_members (room_id);',
      'CREATE INDEX idx_mood_checkins_room ON mood_checkins (room_id, created_at DESC);',
      'CREATE INDEX idx_songs_checkin ON songs (checkin_id);',
    ];
    renderCodeBlock(page, sqlLines, 740);
  }

  // Page: Atomic Check-in RPC Stored Procedure
  {
    const page = addContentPage(
      '12. SYSTEM IMPLEMENTATION & SOURCE CODE LISTING',
      '12.2 Database Tier: Atomic Check-in RPC Stored Procedure (0004_checkin_rpc.sql)'
    );

    const rpcLines = [
      'CREATE OR REPLACE FUNCTION create_checkin_with_songs(',
      '  p_room_id UUID, p_user_id UUID, p_mood TEXT, p_energy INTEGER,',
      '  p_note TEXT DEFAULT NULL, p_songs JSONB DEFAULT \'[]\'::jsonb',
      ') RETURNS JSONB AS $$',
      'DECLARE',
      '  v_checkin_id UUID;',
      '  v_song RECORD;',
      '  v_pos INTEGER := 1;',
      '  v_result JSONB;',
      'BEGIN',
      '  -- Ensure room is active',
      '  IF NOT EXISTS (SELECT 1 FROM rooms WHERE id = p_room_id AND is_active = true) THEN',
      '    RAISE EXCEPTION \'Room is closed or invalid\' USING ERRCODE = \'P0002\';',
      '  END IF;',
      '',
      '  -- Ensure user belongs to the room',
      '  IF NOT EXISTS (SELECT 1 FROM room_members WHERE room_id = p_room_id AND user_id = p_user_id) THEN',
      '    RAISE EXCEPTION \'User is not a member of room\' USING ERRCODE = \'P0003\';',
      '  END IF;',
      '',
      '  -- Insert check-in row atomically',
      '  INSERT INTO mood_checkins (room_id, user_id, mood, energy, note, created_at)',
      '  VALUES (p_room_id, p_user_id, p_mood, p_energy, NULLIF(TRIM(p_note), \'\'), now())',
      '  RETURNING id INTO v_checkin_id;',
      '',
      '  -- Insert attached songs (maximum 3)',
      '  FOR v_song IN SELECT * FROM jsonb_to_recordset(p_songs) AS s(title TEXT, artist TEXT, link TEXT)',
      '  LOOP',
      '    IF v_pos > 3 THEN EXIT; END IF;',
      '    IF v_song.title IS NOT NULL AND v_song.artist IS NOT NULL THEN',
      '      INSERT INTO songs (checkin_id, title, artist, link_url, position)',
      '      VALUES (v_checkin_id, TRIM(v_song.title), TRIM(v_song.artist), v_song.link, v_pos);',
      '      v_pos := v_pos + 1;',
      '    END IF;',
      '  END LOOP;',
      '',
      '  SELECT jsonb_build_object(\'id\', mc.id, \'mood\', mc.mood, \'energy\', mc.energy, \'createdAt\', mc.created_at)',
      '  INTO v_result FROM mood_checkins mc WHERE mc.id = v_checkin_id;',
      '  RETURN v_result;',
      'END;',
      '$$ LANGUAGE plpgsql SECURITY DEFINER;',
    ];
    renderCodeBlock(page, rpcLines, 740);
  }

  // Page: Vibe Calculation Engine (Pure functions)
  {
    const page = addContentPage(
      '12. SYSTEM IMPLEMENTATION & SOURCE CODE LISTING',
      '12.3 Application Tier: Pure Mathematical Vibe Engine (server/src/modules/vibe/vibe.ts)'
    );

    const vibeLines = [
      'export function computeVibe(countedCheckins: VibeCheckinInput[]): VibeResult {',
      '  if (countedCheckins.length === 0) {',
      '    return { score: null, label: null, dominantMood: null, averageEnergy: null, countedMembers: 0, moodMix: {} };',
      '  }',
      '',
      '  let sumScores = 0;',
      '  let sumEnergy = 0;',
      '  const moodMix: Record<string, number> = {};',
      '  const moodLatestTimestamp: Record<string, number> = {};',
      '',
      '  for (const c of countedCheckins) {',
      '    const score = getMoodScore(c.mood); // happy:90, hyped:85, romantic:80, chill:70, focused:65, nostalgic:55...',
      '    sumScores += score;',
      '    sumEnergy += c.energy;',
      '',
      '    moodMix[c.mood] = (moodMix[c.mood] || 0) + 1;',
      '    const time = new Date(c.createdAt).getTime();',
      '    if (!moodLatestTimestamp[c.mood] || time > moodLatestTimestamp[c.mood]) {',
      '      moodLatestTimestamp[c.mood] = time;',
      '    }',
      '  }',
      '',
      '  // 1. Group Vibe Score = round( sum(scores) / count )',
      '  const avgScore = sumScores / countedCheckins.length;',
      '  const finalScore = Math.round(avgScore);',
      '  const avgEnergy = Number((sumEnergy / countedCheckins.length).toFixed(1));',
      '',
      '  // 2. Dominant Mood (highest count, tie-breaker: most recent timestamp)',
      '  let dominantMood: string | null = null;',
      '  let maxCount = -1;',
      '  let newestForMax = -1;',
      '',
      '  for (const [mood, count] of Object.entries(moodMix)) {',
      '    const latestTime = moodLatestTimestamp[mood] || 0;',
      '    if (count > maxCount || (count === maxCount && latestTime > newestForMax)) {',
      '      maxCount = count;',
      '      dominantMood = mood;',
      '      newestForMax = latestTime;',
      '    }',
      '  }',
      '',
      '  return { score: finalScore, label: labelForScore(finalScore), dominantMood, averageEnergy: avgEnergy,',
      '           countedMembers: countedCheckins.length, moodMix };',
      '}',
    ];
    renderCodeBlock(page, vibeLines, 740);
  }

  // Page: Express REST API Router
  {
    const page = addContentPage(
      '12. SYSTEM IMPLEMENTATION & SOURCE CODE LISTING',
      '12.4 Application Tier: Express 5 API Server & Middleware (server/src/app.ts)'
    );

    const appLines = [
      'export const app = express();',
      'app.set(\'trust proxy\', 1);',
      'app.use(helmet());',
      'app.use(cors({ origin: allowedOrigins, credentials: true }));',
      'app.use(express.json({ limit: \'15kb\' }));',
      '',
      '// Rate limiting defense',
      'app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));',
      '',
      '// Deployment Health Check (keeps cloud hosts awake)',
      'app.get(\'/api/health\', (req, res) => {',
      '  res.status(200).json({ status: \'ok\', uptime: process.uptime(), timestamp: new Date().toISOString() });',
      '});',
      '',
      '// API Endpoints',
      'app.use(\'/api/rooms\', roomsRouter);',
      'app.use(\'/api/rooms\', vibeRouter);',
      'app.use(\'/api/rooms\', playlistRouter);',
      'app.use(\'/api/rooms\', adminRouter);',
      'app.use(\'/api\', checkinsRouter);',
      '',
      '// Central Error Handling Contract',
      'app.use(errorHandler);',
    ];
    renderCodeBlock(page, appLines, 740);
  }

  // Page: Frontend Client App & Routes
  {
    const page = addContentPage(
      '12. SYSTEM IMPLEMENTATION & SOURCE CODE LISTING',
      '12.5 Presentation Tier: React Router & Single Page Architecture (client/src/App.tsx)'
    );

    const clientLines = [
      'export const App: React.FC = () => {',
      '  const [user, setUser] = useState<ApiUser | null>(getStoredUser());',
      '  const [isAuthOpen, setIsAuthOpen] = useState(false);',
      '  const [isExplainerOpen, setIsExplainerOpen] = useState(false);',
      '',
      '  return (',
      '    <div className="min-h-screen bg-bg text-text-main flex flex-col font-sans">',
      '      <Navbar user={user} onOpenAuth={() => setIsAuthOpen(true)} onLogout={handleLogout} />',
      '      <main className="flex-1">',
      '        <Routes>',
      '          <Route path="/" element={<LandingPage user={user} onOpenAuth={() => setIsAuthOpen(true)} />} />',
      '          <Route path="/rooms" element={<RoomsPage user={user} />} />',
      '          <Route path="/room/:id" element={<DashboardPage user={user} />} />',
      '          <Route path="/room/:id/admin" element={<AdminPage user={user} />} />',
      '          <Route path="/room/:id/history" element={<HistoryPage user={user} />} />',
      '        </Routes>',
      '      </main>',
      '      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />',
      '      <ScoreExplainerModal isOpen={isExplainerOpen} onClose={() => setIsExplainerOpen(false)} />',
      '    </div>',
      '  );',
      '};',
    ];
    renderCodeBlock(page, clientLines, 740);
  }

  // ==========================================
  // CHAPTER 13: TEST CASES & RESULTS
  // ==========================================
  console.log('[PDF] Adding Chapter 13: Test Cases & Verification Results...');
  {
    const page = addContentPage(
      '13. SYSTEM TESTING, VERIFICATION & RESULTS',
      '13.1 Automated Unit Tests & Test Case Matrix (server/src/modules/vibe/vibe.test.ts)'
    );

    const testLines = [
      '// Automated Vitest Suite for Vibe Engine (All Tests Passing)',
      'describe(\'Vibe Engine Unit Tests\', () => {',
      '  it(\'PRD Section 5.4 Worked Example: Late Night Crew yields 79 (Good vibes)\', () => {',
      '    const checkins = [',
      '      { userId: \'rahul\', mood: \'chill\', energy: 3, createdAt: \'2026-10-25T01:00:00Z\' },  // Score: 70',
      '      { userId: \'aman\', mood: \'hyped\', energy: 5, createdAt: \'2026-10-25T01:10:00Z\' },  // Score: 85',
      '      { userId: \'rohit\', mood: \'happy\', energy: 4, createdAt: \'2026-10-25T01:20:00Z\' },  // Score: 90',
      '      { userId: \'gaurav\', mood: \'chill\', energy: 3, createdAt: \'2026-10-25T01:30:00Z\' }, // Score: 70',
      '    ];',
      '    const result = computeVibe(checkins);',
      '    expect(result.score).toBe(79);                    // 315 / 4 = 78.75 -> 79 [PASSED]',
      '    expect(result.label).toBe(\'Good vibes\');          // 65-84 range [PASSED]',
      '    expect(result.dominantMood).toBe(\'chill\');         // 2 of 4 votes [PASSED]',
      '    expect(result.averageEnergy).toBe(3.8);            // 15 / 4 = 3.8 [PASSED]',
      '  });',
      '',
      '  it(\'handles empty check-ins gracefully (score = null)\', () => { ... [PASSED] });',
      '  it(\'tie-breaker resolves to most recent check-in timestamp\', () => { ... [PASSED] });',
      '  it(\'filters out check-ins older than 24 hours\', () => { ... [PASSED] });',
      '});',
    ];
    renderCodeBlock(page, testLines, 740);

    // Draw Test Cases Table Summary below code
    page.drawText('SUMMARY TEST CASE EXECUTION MATRIX:', {
      x: 50,
      y: 350,
      size: 11,
      font: helveticaBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    const matrix = [
      ['TC-01', 'User Registration & Profile Creation', 'Valid email & password', 'HTTP 201 Created & JWT issued', 'PASS'],
      ['TC-02', 'Create Room with 6-char Code', 'Room name "Late Night Crew"', 'Unique code generated & role=admin', 'PASS'],
      ['TC-03', 'Join Existing Room by Code', 'Code "K7P2QX"', 'Membership added & role=member', 'PASS'],
      ['TC-04', 'Duplicate Room Join Prevention', 'Join same room again', 'HTTP 409 Conflict', 'PASS'],
      ['TC-05', 'Post Mood Checkin & Songs', 'Mood "chill", energy 3, 2 songs', 'HTTP 201 Created & Atomic DB commit', 'PASS'],
      ['TC-06', 'Vibe Score Calculation (Worked Example)', '4 checkins (70, 85, 90, 70)', 'Score: 79, Label: Good vibes, Dominant: chill', 'PASS'],
      ['TC-07', 'Non-Admin Access to Admin Panel', 'Member attempts DELETE member', 'HTTP 403 Forbidden', 'PASS'],
      ['TC-08', 'Regenerate Invite Code', 'Admin clicks regenerate', 'Old code invalid, new code generated', 'PASS'],
      ['TC-09', 'Close Room Lifecycle', 'Admin archives room', 'New checkins rejected with ROOM_CLOSED', 'PASS'],
    ];

    let rowY = 325;
    for (const [id, name, input, expected, status] of matrix) {
      page.drawText(`${id}: ${name} — Status: ${status}`, {
        x: 50,
        y: rowY,
        size: 8.5,
        font: helveticaBold,
        color: rgb(0.1, 0.5, 0.2),
      });
      page.drawText(`   Input: ${input} | Expected: ${expected}`, {
        x: 50,
        y: rowY - 11,
        size: 7.5,
        font: helvetica,
        color: rgb(0.3, 0.3, 0.3),
      });
      rowY -= 26;
    }
  }

  // ==========================================
  // CHAPTER 14: DEPLOYMENT & DEMO SPECIFICATION
  // ==========================================
  console.log('[PDF] Adding Chapter 14: Deployment & Reviewer Demo Guide...');
  {
    const page = addContentPage(
      '14. DEPLOYMENT RUNBOOK & EXAMINER DEMO GUIDE',
      '14.1 Production Cloud Configuration & Reviewer Fast-Track Credentials'
    );

    const deployInfo = [
      '14.1 Cloud Hosting Architecture:',
      '• Presentation Tier: Hosted on Vercel Hobby Plan (Global CDN edge with automatic HTTPS)',
      '• Application Tier: Hosted on Render Free Web Service (Node.js runtime with /api/health)',
      '• Data Tier: Hosted on Supabase Cloud (Managed PostgreSQL 15 with Row Level Security)',
      '• Zero Infrastructure Expense: Total cloud cost incurred = Rs. 0',
      '',
      '14.2 Reviewer & Examiner Fast-Track Demo Credentials:',
      '• Seeded Demo Room: "Late Night Crew" (Room Code: K7P2QX)',
      '• Pre-loaded Checkins: Rahul (chill/3), Aman (hyped/5), Rohit (happy/4), Gaurav (chill/3)',
      '• Verified Score: 79 (Good vibes) | Dominant: Chill | Average Energy: 3.8 / 5',
      '• 1-Click Examiner Demo Login:',
      '   - "Demo Member (Rahul)": Tests member checkin flow, music submission, and playlist view',
      '   - "Demo Admin (Gaurav)": Tests admin moderation, member removal, and code regeneration',
      '',
      '14.3 Source Code & Submission Repository:',
      '• Project Name: VibeCheck Rooms',
      '• Candidate: Gaurav Singh (University Roll No. 240919106084)',
      '• Course: BCA 5th Semester (BCA-508 Minor Project)',
      '• Department: School of Information Technology (SOIT), IMS Noida',
      '• University: Chaudhary Charan Singh University (CCSU), Meerut',
    ];

    let y = 740;
    for (const line of deployInfo) {
      const isHeader = line.startsWith('14.');
      page.drawText(line, {
        x: 50,
        y,
        size: isHeader ? 11 : 9.5,
        font: isHeader ? helveticaBold : helvetica,
        color: isHeader ? rgb(0.1, 0.1, 0.1) : rgb(0.25, 0.25, 0.25),
      });
      y -= isHeader ? 20 : 16;
    }
  }

  // Save the Final PDF
  const outPath = path.resolve('c:/Users/DELL/Desktop/VibeCheck/VibeCheck_Rooms_BCA508_Final_Project_Report_With_Code_Gaurav_Singh.pdf');
  const outBytes = await outDoc.save();
  fs.writeFileSync(outPath, outBytes);
  console.log(`[PDF] Final Project Report successfully generated at:\n${outPath}`);
  console.log(`[PDF] Total Pages: ${outDoc.getPageCount()}`);
}

generateFinalReport().catch((err) => {
  console.error('[PDF] Failed to generate final report:', err);
  process.exit(1);
});
