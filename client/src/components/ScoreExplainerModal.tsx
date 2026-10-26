// client/src/components/ScoreExplainerModal.tsx
import React from 'react';
import { X, HelpCircle, AlertCircle } from 'lucide-react';
import { MOOD_LIST } from '../lib/moods';

interface ScoreExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScoreExplainerModal: React.FC<ScoreExplainerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-text-muted hover:text-text-main rounded-full hover:bg-surface-2 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-6 h-6 text-violet" />
          <h2 className="text-xl font-heading font-extrabold text-text-main">
            How the Vibe Score Works
          </h2>
        </div>

        <p className="text-xs text-text-muted leading-relaxed mb-4">
          The Group Vibe Score is computed mathematically from the single latest check-in of every
          room member who submitted a mood within the rolling last 24 hours.
        </p>

        {/* Formula Card */}
        <div className="p-4 rounded-2xl bg-surface-2 border border-border mb-4 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-lime block">
            Mathematical Formula
          </span>
          <code className="text-xs text-violet font-mono block bg-bg p-2 rounded-lg border border-border">
            Group Vibe Score = round( sum(Mood Scores) / Count of Active Members )
          </code>
          <p className="text-[11px] text-text-muted">
            • <strong>Dominant Mood:</strong> The mood chosen by the highest number of members. Tied moods are resolved by the most recently submitted check-in.
          </p>
        </div>

        {/* Fixed Mood Scores Table */}
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
          Fixed Mood Weights (0 - 100)
        </h4>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {MOOD_LIST.map((m) => {
            const scoreMap: Record<string, number> = {
              happy: 90,
              hyped: 85,
              romantic: 80,
              chill: 70,
              focused: 65,
              nostalgic: 55,
              stressed: 30,
              sad: 20,
            };
            return (
              <div
                key={m.key}
                className="flex items-center justify-between p-2 rounded-xl bg-surface-2 border border-border text-xs"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <span>{m.emoji}</span>
                  <span className="capitalize">{m.label}</span>
                </span>
                <span className="font-mono font-bold" style={{ color: m.color }}>
                  {scoreMap[m.key]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Worked Example */}
        <div className="p-3.5 rounded-2xl bg-surface-2 border border-border mb-4 text-xs">
          <span className="font-bold text-text-main block mb-1">
            Worked Example ("Late Night Crew"):
          </span>
          <p className="text-text-muted leading-relaxed text-[11px]">
            Rahul (Chill: 70) + Aman (Hyped: 85) + Rohit (Happy: 90) + Gaurav (Chill: 70) = <strong>315 total</strong>.<br />
            315 / 4 members = <strong>78.75 → 79 (Good vibes)</strong>.<br />
            Dominant Mood: <strong>Chill</strong> (2 of 4 members). Average Energy: <strong>3.8 / 5</strong>.
          </p>
        </div>

        {/* Academic / Social Disclaimer */}
        <div className="p-3 rounded-2xl bg-amber/10 border border-amber/30 flex items-start gap-2.5 text-[11px] text-amber">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Academic Project Notice:</strong> VibeCheck Rooms is a social and entertainment platform.
            The vibe score is a fun, self-reported indicator, not a medical or psychological diagnosis.
          </span>
        </div>
      </div>
    </div>
  );
};
