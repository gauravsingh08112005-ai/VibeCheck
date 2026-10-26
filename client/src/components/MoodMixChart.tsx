// client/src/components/MoodMixChart.tsx
import React from 'react';
import { MOODS } from '../lib/moods';
import { BarChart3 } from 'lucide-react';

interface MoodMixChartProps {
  moodMix: Record<string, number>;
  totalCounted: number;
}

export const MoodMixChart: React.FC<MoodMixChartProps> = ({ moodMix, totalCounted }) => {
  const entries = Object.entries(moodMix);

  return (
    <div className="rounded-3xl bg-surface border border-border p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-base text-text-main flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-violet" />
          <span>Room Mood-Mix</span>
        </h3>
        <span className="text-xs text-text-muted">
          {totalCounted} active {totalCounted === 1 ? 'member' : 'members'}
        </span>
      </div>

      {entries.length > 0 ? (
        <div className="space-y-3">
          {entries.map(([moodKey, count]) => {
            const meta = MOODS[moodKey] || { label: moodKey, emoji: '✨', color: '#C6FF3D' };
            const percentage = Math.round((count / (totalCounted || 1)) * 100);

            return (
              <div key={moodKey} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-text-main capitalize">
                    <span>{meta.emoji}</span>
                    <span>{meta.label}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-text-muted">{count}</span>
                    <span className="font-mono font-bold text-[11px]" style={{ color: meta.color }}>
                      {percentage}%
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full h-2.5 rounded-full bg-surface-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: meta.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-text-muted">
          No mood distribution data available yet.
        </div>
      )}
    </div>
  );
};
