// client/src/pages/RoomsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, LogIn, Users, Shield, Copy, Check, ArrowRight } from 'lucide-react';
import { ApiUser, apiFetch } from '../lib/api';

interface RoomSummary {
  id: string;
  name: string;
  roomCode: string;
  role: 'admin' | 'member';
  memberCount: number;
  isActive: boolean;
}

interface RoomsPageProps {
  user: ApiUser | null;
  onOpenAuth: () => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({ user, onOpenAuth }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newRoomName, setNewRoomName] = useState('');
  const [joinCode, setJoinCode] = useState(searchParams.get('join') || '');
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      onOpenAuth();
      return;
    }
    loadRooms();
  }, [user]);

  const loadRooms = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<{ rooms: RoomSummary[] }>('/api/rooms/me');
      setRooms(data.rooms || []);
    } catch {
      // Default demo room if API offline
      setRooms([
        {
          id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          name: 'Late Night Crew',
          roomCode: 'K7P2QX',
          role: user?.role === 'admin' ? 'admin' : 'member',
          memberCount: 5,
          isActive: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    setError(null);

    try {
      const created = await apiFetch<any>('/api/rooms', {
        method: 'POST',
        body: JSON.stringify({ name: newRoomName.trim() }),
      });
      navigate(`/room/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create room.');
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setError(null);

    try {
      const joined = await apiFetch<any>('/api/rooms/join', {
        method: 'POST',
        body: JSON.stringify({ roomCode: joinCode.trim().toUpperCase() }),
      });
      navigate(`/room/${joined.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to join room.');
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading font-extrabold text-3xl text-text-main">Your Vibe Rooms</h1>
        <p className="text-xs text-text-muted mt-1">
          Create a private space or join an existing room with your friends' 6-digit code.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-pink/10 border border-pink/30 text-xs text-pink">
          {error}
        </div>
      )}

      {/* Action Row: Create & Join Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Create Room Card */}
        <div className="rounded-3xl bg-surface border border-border p-6 shadow-xl">
          <h3 className="font-heading font-bold text-base text-text-main flex items-center gap-2 mb-2">
            <Plus className="w-4 h-4 text-lime" />
            <span>Create a New Room</span>
          </h3>
          <p className="text-xs text-text-muted mb-4">
            You'll become the Room Admin and get a code to invite friends.
          </p>

          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              required
              maxLength={40}
              placeholder="e.g. Study Sprint, Hostel Wing 4"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="flex-1 bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-xs text-text-main placeholder-text-muted/50 focus:outline-none focus:border-lime"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-lime text-bg font-extrabold text-xs hover:bg-[#d5ff5e] transition-colors"
            >
              Create
            </button>
          </form>
        </div>

        {/* Join Room Card */}
        <div className="rounded-3xl bg-surface border border-border p-6 shadow-xl">
          <h3 className="font-heading font-bold text-base text-text-main flex items-center gap-2 mb-2">
            <LogIn className="w-4 h-4 text-cyan" />
            <span>Join with Code</span>
          </h3>
          <p className="text-xs text-text-muted mb-4">
            Enter the 6-character room invite code shared by your friend.
          </p>

          <form onSubmit={handleJoin} className="flex gap-2">
            <input
              type="text"
              required
              maxLength={6}
              placeholder="e.g. K7P2QX"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="w-36 bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-xs text-center font-mono font-bold tracking-widest text-cyan placeholder-text-muted/50 focus:outline-none focus:border-cyan"
            />
            <button
              type="submit"
              className="flex-1 px-5 py-2.5 rounded-xl bg-cyan text-bg font-extrabold text-xs hover:bg-[#5ae0f4] transition-colors"
            >
              Join Room
            </button>
          </form>
        </div>
      </div>

      {/* Room List */}
      <div>
        <h2 className="font-heading font-bold text-lg text-text-main mb-4">Rooms you belong to</h2>

        {isLoading ? (
          <div className="text-center py-8 text-xs text-text-muted">Loading rooms…</div>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((r) => (
              <div
                key={r.id}
                className="rounded-3xl bg-surface border border-border p-5 hover:border-violet/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        r.role === 'admin'
                          ? 'bg-pink/10 text-pink border-pink/30'
                          : 'bg-surface-2 text-text-muted border-border'
                      }`}
                    >
                      {r.role === 'admin' ? 'Room Admin' : 'Member'}
                    </span>
                    <button
                      onClick={() => copyCode(r.roomCode, r.id)}
                      className="flex items-center gap-1 text-[11px] font-mono text-lime hover:underline"
                      title="Copy room code"
                    >
                      <span>{r.roomCode}</span>
                      {copiedId === r.id ? (
                        <Check className="w-3 h-3 text-success" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-heading font-bold text-base text-text-main truncate">
                    {r.name}
                  </h3>
                  <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{r.memberCount} members</span>
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/room/${r.id}`)}
                    className="flex items-center gap-1 text-xs font-bold text-lime hover:underline"
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {r.role === 'admin' && (
                    <button
                      onClick={() => navigate(`/room/${r.id}/admin`)}
                      className="text-xs text-text-muted hover:text-pink transition-colors font-semibold"
                    >
                      Manage
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl bg-surface border border-border">
            <p className="text-xs text-text-muted">You are not in any rooms yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
