// client/src/pages/HistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Calendar, Music } from 'lucide-react';
import { ApiUser, apiFetch } from '../lib/api';
import { MOODS } from '../lib/moods';

interface HistoryItem {
  id: string;
  userId: string;
  displayName: string;
  avatarColor: string;
  mood: string;
  energy: number;
  note: string | null;
  songs?: {
    id: string;
    title: string;
    artist: string;
  }[];
  createdAt: string;
}

interface HistoryPageProps {
  user: ApiUser | null;
  onOpenAuth: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ user, onOpenAuth }) => {
  const { id: roomId } = useParams<{ id: string }>();
  const [checkins, setCheckins] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [roomId]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<{ checkins: HistoryItem[] }>(`/api/rooms/${roomId}/checkins`);
      setCheckins(data.checkins || []);
    } catch {
      // Offline fallback
      setCheckins([
        {
          id: 'c1',
          userId: '2',
          displayName: 'Rahul',
          avatarColor: '#22D3EE',
          mood: 'chill',
          energy: 3,
          note: 'Late night coding vibes',
          songs: [{ id: 's1', title: 'Blinding Lights', artist: 'The Weeknd' }],
          createdAt: new Date(Date.now() - 18 * 60000).toISOString(),
        },
        {
          id: 'c2',
          userId: '3',
          displayName: 'Aman',
          avatarColor: '#FF4D8D',
          mood: 'hyped',
          energy: 5,
          note: 'Submission grind mode!',
          songs: [{ id: 's2', title: 'Starboy', artist: 'The Weeknd' }],
          createdAt: new Date(Date.now() - 32 * 60000).toISOString(),
        },
        {
          id: 'c3',
          userId: '4',
          displayName: 'Rohit',
          avatarColor: '#FFB020',
          mood: 'happy',
          energy: 4,
          note: 'Weekend energy is here',
          songs: [{ id: 's3', title: 'Heat Waves', artist: 'Glass Animals' }],
          createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
        },
        {
          id: 'c4',
          userId: '1',
          displayName: 'Gaurav Singh',
          avatarColor: '#C6FF3D',
          mood: 'chill',
          energy: 3,
          note: 'Admin check-in: vibes looking solid',
          songs: [{ id: 's4', title: 'Tum Hi Ho', artist: 'Arijit Singh' }],
          createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (checkinId: string) => {
    if (!confirm('Are you sure you want to delete this check-in?')) return;

    try {
      await apiFetch(`/api/checkins/${checkinId}`, { method: 'DELETE' });
      setCheckins((prev) => prev.filter((c) => c.id !== checkinId));
    } catch {
      setCheckins((prev) => prev.filter((c) => c.id !== checkinId));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <Link
          to={`/room/${roomId}`}
          className="p-2 rounded-xl bg-surface-2 border border-border text-text-muted hover:text-text-main transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-text-main">
            Room Check-in History
          </h1>
          <p className="text-xs text-text-muted">
            Chronological archive of all member moods, notes, and music submissions.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-xs text-text-muted">Loading history…</div>
      ) : checkins.length > 0 ? (
        <div className="space-y-4">
          {checkins.map((item) => {
            const meta = MOODS[item.mood] || { label: item.mood, emoji: '✨', color: '#C6FF3D' };
            const isOwner = user?.id === item.userId;
            const isAdmin = user?.role === 'admin';

            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-surface border border-border hover:border-violet/40 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-bg uppercase"
                      style={{ backgroundColor: item.avatarColor || '#8B5CF6' }}
                    >
                      {item.displayName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-text-main block">
                        {item.displayName}
                      </span>
                      <span className="text-[10px] text-text-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.createdAt).toLocaleString()}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: `${meta.color}20`,
                        color: meta.color,
                        border: `1px solid ${meta.color}40`,
                      }}
                    >
                      <span>{meta.emoji}</span>
                      <span className="capitalize">{meta.label}</span>
                      <span className="text-[10px] opacity-75">({item.energy}/5)</span>
                    </div>

                    {(isOwner || isAdmin) && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-text-muted hover:text-pink transition-colors rounded-lg hover:bg-surface-2"
                        title="Delete check-in"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {item.note && (
                  <p className="text-xs text-text-muted bg-surface-2 p-3 rounded-2xl border border-border/50">
                    “{item.note}”
                  </p>
                )}

                {item.songs && item.songs.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.songs.map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-[11px] text-text-main"
                      >
                        <Music className="w-3 h-3 text-pink" />
                        <span>{s.title} • {s.artist}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 rounded-3xl bg-surface border border-border text-xs text-text-muted">
          No check-ins recorded in history yet.
        </div>
      )}
    </div>
  );
};
