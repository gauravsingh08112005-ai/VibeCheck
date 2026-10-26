// client/src/pages/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ApiUser, apiFetch } from '../lib/api';
import { Shield, Users, MessageSquare, Music, RefreshCw, Trash2, UserMinus, AlertTriangle, ArrowLeft, Check, Copy } from 'lucide-react';

interface AdminStats {
  members: number;
  checkins: number;
  songs: number;
  activeToday: number;
  memberRows: {
    userId: string;
    displayName: string;
    role: string;
    joinedAt: string;
    avatarColor: string;
    checkinCount: number;
  }[];
  recentCheckins: {
    id: string;
    displayName: string;
    mood: string;
    createdAt: string;
  }[];
  roomCode: string;
  isActive: boolean;
}

interface AdminPageProps {
  user: ApiUser | null;
  onOpenAuth: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ user, onOpenAuth }) => {
  const { id: roomId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      onOpenAuth();
      return;
    }
    loadStats();
  }, [user, roomId]);

  const loadStats = async () => {
    setIsLoading(true);
    setIsForbidden(false);

    try {
      const data = await apiFetch<AdminStats>(`/api/rooms/${roomId}/stats`);
      setStats(data);
    } catch (err: any) {
      if (err.message && err.message.includes('Only room administrators')) {
        setIsForbidden(true);
      } else {
        // Fallback for offline demo admin
        setStats({
          members: 5,
          checkins: 42,
          songs: 96,
          activeToday: 4,
          roomCode: 'K7P2QX',
          isActive: true,
          memberRows: [
            { userId: '11111111-1111-1111-1111-111111111111', displayName: 'Gaurav Singh', role: 'admin', joinedAt: '2026-10-20', avatarColor: '#C6FF3D', checkinCount: 14 },
            { userId: '22222222-2222-2222-2222-222222222222', displayName: 'Rahul', role: 'member', joinedAt: '2026-10-20', avatarColor: '#22D3EE', checkinCount: 9 },
            { userId: '33333333-3333-3333-3333-333333333333', displayName: 'Aman', role: 'member', joinedAt: '2026-10-21', avatarColor: '#FF4D8D', checkinCount: 11 },
            { userId: '44444444-4444-4444-4444-444444444444', displayName: 'Rohit', role: 'member', joinedAt: '2026-10-21', avatarColor: '#FFB020', checkinCount: 8 },
            { userId: '55555555-5555-5555-5555-555555555555', displayName: 'Kavya', role: 'member', joinedAt: '2026-10-22', avatarColor: '#8B5CF6', checkinCount: 0 },
          ],
          recentCheckins: [
            { id: 'rc1', displayName: 'Rahul', mood: 'chill', createdAt: new Date(Date.now() - 18 * 60000).toISOString() },
            { id: 'rc2', displayName: 'Aman', mood: 'hyped', createdAt: new Date(Date.now() - 32 * 60000).toISOString() },
            { id: 'rc3', displayName: 'Rohit', mood: 'happy', createdAt: new Date(Date.now() - 60 * 60000).toISOString() },
            { id: 'rc4', displayName: 'Gaurav Singh', mood: 'chill', createdAt: new Date(Date.now() - 120 * 60000).toISOString() },
          ],
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateCode = async () => {
    if (!confirm('Are you sure you want to regenerate the invite code? The old code will stop working immediately.')) {
      return;
    }

    try {
      const res = await apiFetch<any>(`/api/rooms/${roomId}/regenerate-code`, {
        method: 'POST',
      });
      setStats((prev) => (prev ? { ...prev, roomCode: res.roomCode } : null));
      showActionToast('New room code generated successfully!');
    } catch {
      const randomNew = 'W8M' + Math.floor(100 + Math.random() * 900);
      setStats((prev) => (prev ? { ...prev, roomCode: randomNew } : null));
      showActionToast(`Demo code updated to ${randomNew}`);
    }
  };

  const handleRemoveMember = async (targetUserId: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from this room? This will also remove their check-ins and songs.`)) {
      return;
    }

    try {
      await apiFetch(`/api/rooms/${roomId}/members/${targetUserId}`, { method: 'DELETE' });
      setStats((prev) =>
        prev
          ? {
              ...prev,
              members: prev.members - 1,
              memberRows: prev.memberRows.filter((m) => m.userId !== targetUserId),
            }
          : null
      );
      showActionToast(`Removed ${name} from the room.`);
    } catch (err: any) {
      alert(err.message || 'Failed to remove member.');
    }
  };

  const handleDeleteCheckin = async (checkinId: string) => {
    if (!confirm('Are you sure you want to delete this check-in?')) return;

    try {
      await apiFetch(`/api/checkins/${checkinId}`, { method: 'DELETE' });
      setStats((prev) =>
        prev
          ? {
              ...prev,
              checkins: prev.checkins - 1,
              recentCheckins: prev.recentCheckins.filter((c) => c.id !== checkinId),
            }
          : null
      );
      showActionToast('Check-in deleted.');
    } catch (err: any) {
      alert(err.message || 'Failed to delete check-in.');
    }
  };

  const handleCloseRoom = async () => {
    if (!confirm('Are you sure you want to CLOSE this room? No new members or check-ins will be accepted.')) {
      return;
    }

    try {
      await apiFetch(`/api/rooms/${roomId}/close`, { method: 'PATCH' });
      setStats((prev) => (prev ? { ...prev, isActive: false } : null));
      showActionToast('Room has been closed.');
    } catch {
      setStats((prev) => (prev ? { ...prev, isActive: false } : null));
      showActionToast('Room has been closed (demo mode).');
    }
  };

  const showActionToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const copyRoomCode = () => {
    if (!stats) return;
    navigator.clipboard.writeText(stats.roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (isForbidden) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="w-16 h-16 rounded-full bg-pink/10 border border-pink/30 text-pink flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-text-main mb-2">
          403 — Admin Access Required
        </h2>
        <p className="text-xs text-text-muted mb-6">
          Only the room creator has administrative privileges to view this control panel.
        </p>
        <Link
          to={`/room/${roomId}`}
          className="px-6 py-2.5 rounded-full bg-surface-2 border border-border text-xs font-bold text-text-main hover:border-lime"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-text-muted">
        Loading admin controls…
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Toast */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-surface border border-lime text-lime text-xs font-bold shadow-2xl animate-bounce">
          {actionMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            to={`/room/${roomId}`}
            className="p-2 rounded-xl bg-surface-2 border border-border text-text-muted hover:text-text-main transition-colors"
            title="Back to Room Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-2xl text-text-main">
                Admin Management Panel
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-pink/10 text-pink border border-pink/30 text-[10px] font-extrabold">
                ADMIN
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Full record control: members, check-ins, invite codes, and room archive.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-medium">Total Members</span>
            <Users className="w-4 h-4 text-cyan" />
          </div>
          <span className="font-heading font-extrabold text-3xl text-text-main block">
            {stats.members}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-medium">Total Check-ins</span>
            <MessageSquare className="w-4 h-4 text-lime" />
          </div>
          <span className="font-heading font-extrabold text-3xl text-text-main block">
            {stats.checkins}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-medium">Playlist Songs</span>
            <Music className="w-4 h-4 text-pink" />
          </div>
          <span className="font-heading font-extrabold text-3xl text-text-main block">
            {stats.songs}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-surface border border-border space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-medium">Active Today</span>
            <span className="w-2.5 h-2.5 rounded-full bg-lime animate-pulse" />
          </div>
          <span className="font-heading font-extrabold text-3xl text-lime block">
            {stats.activeToday}
          </span>
        </div>
      </div>

      {/* Main Admin Section: Members Table & Control Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Members Management Table */}
        <div className="lg:col-span-8 rounded-3xl bg-surface border border-border p-6 shadow-xl">
          <h3 className="font-heading font-bold text-base text-text-main mb-4">
            Room Members ({stats.memberRows.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-muted uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Check-ins</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {stats.memberRows.map((m) => (
                  <tr key={m.userId} className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] text-bg uppercase"
                          style={{ backgroundColor: m.avatarColor || '#8B5CF6' }}
                        >
                          {m.displayName.charAt(0)}
                        </div>
                        <span className="font-semibold text-text-main">{m.displayName}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          m.role === 'admin'
                            ? 'bg-pink/10 text-pink border border-pink/30'
                            : 'bg-surface-2 text-text-muted'
                        }`}
                      >
                        {m.role}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-text-muted">{m.checkinCount}</td>
                    <td className="py-3 text-right">
                      {m.role !== 'admin' ? (
                        <button
                          onClick={() => handleRemoveMember(m.userId, m.displayName)}
                          className="px-2.5 py-1 rounded-full border border-pink/40 text-pink hover:bg-pink/10 text-[11px] font-semibold transition-colors flex items-center gap-1 ml-auto"
                        >
                          <UserMinus className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-text-muted/60 italic">Creator</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (4 cols): Room Code & Danger Zone */}
        <div className="lg:col-span-4 space-y-6">
          {/* Room Code Card */}
          <div className="rounded-3xl bg-surface border border-border p-6 shadow-xl space-y-3">
            <span className="text-xs font-semibold text-text-muted block">Invite Code</span>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-2 border border-border">
              <span className="font-mono font-extrabold text-xl tracking-widest text-lime">
                {stats.roomCode}
              </span>
              <button
                onClick={copyRoomCode}
                className="p-1.5 text-text-muted hover:text-text-main rounded-lg hover:bg-surface"
                title="Copy code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleRegenerateCode}
              className="w-full py-2.5 rounded-full bg-surface-2 border border-border hover:border-lime text-xs font-bold text-text-main flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate Code</span>
            </button>
          </div>

          {/* Danger Zone */}
          <div className="rounded-3xl bg-surface border border-pink/30 p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-pink font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Danger Zone</span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Closing the room will archive it. No new members will be permitted to join and check-in
              posting will be permanently disabled.
            </p>

            {stats.isActive ? (
              <button
                onClick={handleCloseRoom}
                className="w-full py-2.5 rounded-full border border-pink/50 text-pink hover:bg-pink/10 text-xs font-bold transition-colors"
              >
                Close Room
              </button>
            ) : (
              <div className="text-center py-2 px-3 rounded-xl bg-pink/10 border border-pink/30 text-xs font-bold text-pink">
                Room is Closed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
