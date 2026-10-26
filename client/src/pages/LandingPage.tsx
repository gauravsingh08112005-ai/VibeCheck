// client/src/pages/LandingPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Music, Users, Shield, Copy, Check } from 'lucide-react';
import { ApiUser } from '../lib/api';

interface LandingPageProps {
  user: ApiUser | null;
  onOpenAuth: () => void;
  onOpenExplainer: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ user, onOpenAuth, onOpenExplainer }) => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCreateRoom = () => {
    if (!user) {
      onOpenAuth();
    } else {
      navigate('/rooms');
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
    } else if (joinCode.trim().length === 6) {
      navigate(`/rooms?join=${joinCode.trim().toUpperCase()}`);
    }
  };

  const copyDemoCode = () => {
    navigator.clipboard.writeText('K7P2QX');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col justify-between">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border text-xs font-semibold text-lime shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-lime" />
              <span>BCA-508 Minor Project • IMS Noida / CCSU</span>
            </div>

            <h1 className="font-heading font-extrabold text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] text-text-main">
              What's the vibe <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime via-cyan to-pink">
                today?
              </span>
            </h1>

            <p className="text-base sm:text-lg text-text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              A private room where friends post a daily mood, an energy level, and up to three
              songs. Instantly see your group’s combined vibe score and a collaborative shared
              playlist.
            </p>

            {/* Actions & Code input */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button
                onClick={handleCreateRoom}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-lime text-bg font-extrabold text-sm sm:text-base hover:bg-[#d5ff5e] transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <span>Create a room</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <form onSubmit={handleJoinSubmit} className="w-full sm:w-auto flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-char code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-36 bg-surface-2 border border-border rounded-full px-4 py-3 text-sm text-center font-mono font-bold tracking-widest text-lime placeholder-text-muted/50 focus:outline-none focus:border-lime"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-full bg-surface-2 border border-border hover:border-lime text-text-main font-bold text-sm transition-colors"
                >
                  Join
                </button>
              </form>
            </div>

            {/* Demo Room Shortcut for Examiners */}
            <div className="pt-4 flex items-center gap-2 justify-center lg:justify-start text-xs text-text-muted">
              <span>Seeded Reviewer Demo Code:</span>
              <button
                onClick={copyDemoCode}
                className="flex items-center gap-1 font-mono font-bold text-lime hover:underline px-2 py-0.5 rounded bg-surface border border-border"
              >
                <span>K7P2QX</span>
                {copiedCode ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
              </button>
              <button
                onClick={() => navigate('/room/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')}
                className="text-violet font-semibold hover:underline ml-1"
              >
                (Open Demo Room)
              </button>
            </div>
          </div>

          {/* Right Column: Hero Preview Mockup Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-surface border border-border p-6 shadow-2xl overflow-hidden hover:border-violet/40 transition-colors">
              {/* Glow Accent */}
              <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-lime/15 blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-5">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-text-main">
                    Late Night Crew
                  </h3>
                  <span className="text-[11px] text-text-muted">5 members • 4 checked in</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-surface-2 text-xs font-mono font-bold text-lime border border-border">
                  K7P2QX
                </span>
              </div>

              {/* Vibe Score Display */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-heading font-extrabold text-7xl text-lime leading-none">
                  79
                </span>
                <div>
                  <span className="text-xl font-bold text-text-muted">/100</span>
                  <div className="mt-1 px-2.5 py-0.5 rounded-full bg-lime/10 text-lime border border-lime/30 text-xs font-bold">
                    Good vibes
                  </div>
                  <span className="text-[11px] text-text-muted block mt-1">
                    Dominant: <strong>Chill 🌊</strong> • Energy: <strong>3.8/5</strong>
                  </span>
                </div>
              </div>

              {/* Sample Mood Chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40">
                  🌊 Chill (2)
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF4D8D]/20 text-[#FF4D8D] border border-[#FF4D8D]/40">
                  ⚡ Hyped (1)
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFB020]/20 text-[#FFB020] border border-[#FFB020]/40">
                  😊 Happy (1)
                </span>
              </div>

              {/* Playlist Sample */}
              <div className="p-3 rounded-2xl bg-surface-2 border border-border space-y-2">
                <div className="flex justify-between items-center text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  <span>Recent Playlist Tracks</span>
                  <span>12 total</span>
                </div>
                <div className="text-xs flex items-center justify-between text-text-main">
                  <span>1. Blinding Lights • The Weeknd</span>
                  <span className="text-[10px] text-text-muted">by Rahul</span>
                </div>
                <div className="text-xs flex items-center justify-between text-text-main">
                  <span>2. Kesariya • Arijit Singh</span>
                  <span className="text-[10px] text-text-muted">by Aman</span>
                </div>
                <div className="text-xs flex items-center justify-between text-text-main">
                  <span>3. Heat Waves • Glass Animals</span>
                  <span className="text-[10px] text-text-muted">by Rohit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Steps: How It Works Section */}
        <div className="mt-20 pt-12 border-t border-border">
          <div className="text-center mb-10">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-main">
              Built for friend groups in three simple steps
            </h2>
            <p className="text-xs text-text-muted mt-1">
              Zero complicated onboarding. Create or join in under 15 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-surface border border-border text-center space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-lime/10 border border-lime/30 text-lime font-extrabold text-lg flex items-center justify-center mx-auto">
                1
              </div>
              <h4 className="font-heading font-bold text-base text-text-main">Create a room</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Start a private room and get a unique 6-character code to share with your group chat
                or roommates.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface border border-border text-center space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan/10 border border-cyan/30 text-cyan font-extrabold text-lg flex items-center justify-center mx-auto">
                2
              </div>
              <h4 className="font-heading font-bold text-base text-text-main">Drop your mood</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Pick 1 of 8 moods, select your energy from 1 to 5, write an optional note, and drop up
                to three songs.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface border border-border text-center space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-pink/10 border border-pink/30 text-pink font-extrabold text-lg flex items-center justify-center mx-auto">
                3
              </div>
              <h4 className="font-heading font-bold text-base text-text-main">See the vibe</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Watch the group vibe score calculate automatically, see who checked in, and listen to
                the shared playlist.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Academic Disclaimer */}
      <footer className="border-t border-border py-6 px-4 text-center text-xs text-text-muted">
        <p>
          VibeCheck Rooms • Minor Project (BCA-508) • Institute of Management Studies, Noida • CCS
          University
        </p>
        <p className="text-[11px] text-text-muted/70 mt-1">
          Designed and developed by <strong>Gaurav Singh</strong> (Roll No. 240919106084). Vibe score
          is an entertainment metric.
        </p>
      </footer>
    </div>
  );
};
