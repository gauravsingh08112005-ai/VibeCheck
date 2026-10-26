// client/src/components/VibeMeter.tsx
import React from 'react';
import { MOODS, getLabelColor } from '../lib/moods';
import { HelpCircle, RefreshCw, Zap } from 'lucide-react';

interface VibeMeterProps {
  score: number | null;
  label: string | null;
  dominantMood: string | null;
  averageEnergy: number | null;
  countedMembers: number;
  totalMembers: number;
  onRefresh: () => void;
  onOpenExplainer: () => void;
  isRefreshing?: boolean;
}

export const VibeMeter: React.FC<VibeMeterProps> = ({
  score,
  label,
  dominantMood,
  averageEnergy,
  countedMembers,
  totalMembers,
  onRefresh,
  onOpenExplainer,
  isRefreshing = false,
}) => {
  const domMeta = dominantMood ? MOODS[dominantMood] : null;
  const labelColor = getLabelColor(label);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-surface border border-border p-6 md:p-8 shadow-xl">
      {/* Background glow circle */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: domMeta ? domMeta.color : '#C6FF3D' }}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Group Vibe Score (Last 24h)
          </span>
          <button
            onClick={onOpenExplainer}
            className="text-text-muted hover:text-violet transition-colors"
            title="Formula & details"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-main px-2.5 py-1 rounded-full bg-surface-2 border border-border hover:border-text-muted transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-lime' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {score !== null ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Big Score Display */}
          <div className="md:col-span-5 flex items-baseline gap-3">
            <span
              className="font-heading font-extrabold text-7xl md:text-8xl tracking-tight leading-none"
              style={{ color: labelColor }}
            >
              {score}
            </span>
            <div>
              <span className="text-xl md:text-2xl font-bold text-text-muted">/100</span>
              <div
                className="mt-1 px-3 py-1 rounded-full text-xs font-extrabold inline-block"
                style={{ backgroundColor: `${labelColor}20`, color: labelColor, border: `1px solid ${labelColor}40` }}
              >
                {label}
              </div>
            </div>
          </div>

          {/* Key Metrics Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Dominant Mood */}
            <div className="p-3.5 rounded-2xl bg-surface-2 border border-border">
              <span className="text-xs text-text-muted block mb-1">Dominant Mood</span>
              {domMeta ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl">{domMeta.emoji}</span>
                  <span className="font-heading font-bold text-base capitalize" style={{ color: domMeta.color }}>
                    {domMeta.label}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-medium text-text-muted">None</span>
              )}
            </div>

            {/* Average Energy */}
            <div className="p-3.5 rounded-2xl bg-surface-2 border border-border">
              <span className="text-xs text-text-muted block mb-1">Average Energy</span>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber fill-amber" />
                <span className="font-heading font-bold text-base text-text-main">
                  {averageEnergy !== null ? `${averageEnergy} / 5` : '—'}
                </span>
              </div>
            </div>

            {/* Checked In Count */}
            <div className="p-3.5 rounded-2xl bg-surface-2 border border-border col-span-2 sm:col-span-1">
              <span className="text-xs text-text-muted block mb-1">Active Members</span>
              <div className="flex items-baseline gap-1">
                <span className="font-heading font-bold text-base text-lime">
                  {countedMembers}
                </span>
                <span className="text-xs text-text-muted font-medium">of {totalMembers} checked in</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🌊</div>
          <h3 className="text-lg font-heading font-bold text-text-main">No check-ins yet today</h3>
          <p className="text-sm text-text-muted max-w-sm mx-auto mt-1 mb-4">
            Be the first friend to drop your mood and songs to kick off the group vibe score!
          </p>
        </div>
      )}
    </div>
  );
};
