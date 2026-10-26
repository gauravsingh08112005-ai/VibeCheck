// client/src/components/LatestMoods.tsx
import React from 'react';
import { MOODS } from '../lib/moods';
import { Users } from 'lucide-react';

export interface LatestMoodItem {
  userId: string;
  displayName: string;
  avatarColor: string;
  mood: string | null;
  energy?: number;
  note?: string | null;
  createdAt?: string;
}

interface LatestMoodsProps {
  members: LatestMoodItem[];
}

function getRelativeTime(isoString?: string): string {
  if (!isoString) return '';
  const diffMs = new Date().getTime() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export const LatestMoods: React.FC<LatestMoodsProps> = ({ members }) => {
  return (
    <div className="rounded-3xl bg-surface border border-border p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-base text-text-main flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan" />
          <span>Latest Moods</span>
        </h3>
        <span className="text-xs text-text-muted">{members.length} members</span>
      </div>

      <div className="space-y-3">
        {members.map((m) => {
          const meta = m.mood ? MOODS[m.mood] : null;

          return (
            <div
              key={m.userId}
              className="flex items-center justify-between p-3 rounded-2xl bg-surface-2 border border-border/60 hover:border-border transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-bg uppercase shadow-sm"
                  style={{ backgroundColor: m.avatarColor || '#8B5CF6' }}
                >
                  {m.displayName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-text-main">{m.displayName}</span>
                    {m.createdAt && (
                      <span className="text-[10px] text-text-muted">
                        {getRelativeTime(m.createdAt)}
                      </span>
                    )}
                  </div>
                  {m.note && (
                    <p className="text-[11px] text-text-muted/80 truncate max-w-[160px] sm:max-w-xs">
                      “{m.note}”
                    </p>
                  )}
                </div>
              </div>

              {meta ? (
                <div
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                  style={{
                    backgroundColor: `${meta.color}20`,
                    color: meta.color,
                    border: `1px solid ${meta.color}40`,
                  }}
                >
                  <span>{meta.emoji}</span>
                  <span className="capitalize">{meta.label}</span>
                </div>
              ) : (
                <span className="text-xs text-text-muted/60 italic">No check-in yet</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
