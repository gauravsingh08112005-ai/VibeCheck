// client/src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ApiUser, apiFetch } from '../lib/api';
import { findRoomById } from '../lib/roomStore';
import { VibeMeter } from '../components/VibeMeter';
import { CheckInForm } from '../components/CheckInForm';
import { MoodMixChart } from '../components/MoodMixChart';
import { LatestMoods, LatestMoodItem } from '../components/LatestMoods';
import { SharedPlaylist, PlaylistSong } from '../components/SharedPlaylist';
import { ScoreExplainerModal } from '../components/ScoreExplainerModal';
import { History, Shield, Users, AlertCircle } from 'lucide-react';

interface RoomDetails {
  id: string;
  name: string;
  roomCode: string;
  isActive: boolean;
  currentUserRole: 'admin' | 'member';
  members: {
    userId: string;
    displayName: string;
    role: string;
    joinedAt: string;
    avatarColor: string;
  }[];
}

interface VibeData {
  score: number | null;
  label: string | null;
  dominantMood: string | null;
  averageEnergy: number | null;
  countedMembers: number;
  totalMembers: number;
  moodMix: Record<string, number>;
  latestMoods: LatestMoodItem[];
}

interface DashboardPageProps {
  user: ApiUser | null;
  onOpenAuth: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user, onOpenAuth }) => {
  const { id: roomId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [vibe, setVibe] = useState<VibeData | null>(null);
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [totalSongs, setTotalSongs] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSubmittingCheckin, setIsSubmittingCheckin] = useState<boolean>(false);
  const [showExplainer, setShowExplainer] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;
    loadDashboardData();

    // 20-second automatic polling (PRD FR-V5)
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshVibeAndPlaylist();
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [roomId, user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Fetch Room Details
      const roomData = await apiFetch<RoomDetails>(`/api/rooms/${roomId}`);
      setRoom(roomData);

      // 2. Fetch Vibe Data
      const vibeData = await apiFetch<VibeData>(`/api/rooms/${roomId}/vibe`);
      setVibe(vibeData);

      // 3. Fetch Playlist
      const playlistData = await apiFetch<{ total: number; songs: PlaylistSong[] }>(
        `/api/rooms/${roomId}/playlist`
      );
      setSongs(playlistData.songs || []);
      setTotalSongs(playlistData.total || 0);
    } catch {
      // Default to demo or locally created room data if running offline
      const customRoom = roomId ? findRoomById(roomId) : null;
      const demoRoom: RoomDetails = {
        id: roomId || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        name: customRoom?.name || 'Late Night Crew',
        roomCode: customRoom?.roomCode || 'K7P2QX',
        isActive: customRoom ? customRoom.isActive : true,
        currentUserRole: customRoom?.role || (user?.role === 'admin' ? 'admin' : 'member'),
        members: [
          { userId: '11111111-1111-1111-1111-111111111111', displayName: user?.displayName || 'Gaurav Singh', role: customRoom?.role || 'admin', joinedAt: '2026-10-20', avatarColor: user?.avatarColor || '#C6FF3D' },
          { userId: '22222222-2222-2222-2222-222222222222', displayName: 'Rahul', role: 'member', joinedAt: '2026-10-20', avatarColor: '#22D3EE' },
          { userId: '33333333-3333-3333-3333-333333333333', displayName: 'Aman', role: 'member', joinedAt: '2026-10-21', avatarColor: '#FF4D8D' },
          { userId: '44444444-4444-4444-4444-444444444444', displayName: 'Rohit', role: 'member', joinedAt: '2026-10-21', avatarColor: '#FFB020' },
          { userId: '55555555-5555-5555-5555-555555555555', displayName: 'Kavya', role: 'member', joinedAt: '2026-10-22', avatarColor: '#8B5CF6' },
        ],
      };
      setRoom(demoRoom);

      // Worked example 315/4 = 79
      setVibe({
        score: 79,
        label: 'Good vibes',
        dominantMood: 'chill',
        averageEnergy: 3.8,
        countedMembers: 4,
        totalMembers: 5,
        moodMix: { chill: 2, hyped: 1, happy: 1 },
        latestMoods: [
          { userId: '22222222-2222-2222-2222-222222222222', displayName: 'Rahul', avatarColor: '#22D3EE', mood: 'chill', energy: 3, note: 'Late night coding vibes', createdAt: new Date(Date.now() - 18 * 60000).toISOString() },
          { userId: '33333333-3333-3333-3333-333333333333', displayName: 'Aman', avatarColor: '#FF4D8D', mood: 'hyped', energy: 5, note: 'Submission grind mode!', createdAt: new Date(Date.now() - 32 * 60000).toISOString() },
          { userId: '44444444-4444-4444-4444-444444444444', displayName: 'Rohit', avatarColor: '#FFB020', mood: 'happy', energy: 4, note: 'Weekend energy is here', createdAt: new Date(Date.now() - 60 * 60000).toISOString() },
          { userId: '11111111-1111-1111-1111-111111111111', displayName: 'Gaurav Singh', avatarColor: '#C6FF3D', mood: 'chill', energy: 3, note: 'Admin check-in: vibes looking solid', createdAt: new Date(Date.now() - 120 * 60000).toISOString() },
          { userId: '55555555-5555-5555-5555-555555555555', displayName: 'Kavya', avatarColor: '#8B5CF6', mood: null },
        ],
      });

      setSongs([
        { id: 's1', title: 'Blinding Lights', artist: 'The Weeknd', link: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b', addedBy: { userId: '2', displayName: 'Rahul', avatarColor: '#22D3EE' }, createdAt: new Date(Date.now() - 18 * 60000).toISOString() },
        { id: 's2', title: 'Starboy', artist: 'The Weeknd', link: 'https://open.spotify.com/track/7MXVkk9YM5IZxh0WSlVIh0', addedBy: { userId: '3', displayName: 'Aman', avatarColor: '#FF4D8D' }, createdAt: new Date(Date.now() - 32 * 60000).toISOString() },
        { id: 's3', title: 'Kesariya', artist: 'Arijit Singh', link: 'https://open.spotify.com/track/6WzRpRjhq4bsp5vT4m2b8Q', addedBy: { userId: '3', displayName: 'Aman', avatarColor: '#FF4D8D' }, createdAt: new Date(Date.now() - 32 * 60000).toISOString() },
        { id: 's4', title: 'Heat Waves', artist: 'Glass Animals', link: 'https://open.spotify.com/track/02MWAaffLxlfxAUY7c5dvx', addedBy: { userId: '4', displayName: 'Rohit', avatarColor: '#FFB020' }, createdAt: new Date(Date.now() - 60 * 60000).toISOString() },
        { id: 's5', title: 'Tum Hi Ho', artist: 'Arijit Singh', link: 'https://open.spotify.com/track/56zZ48jdyY2oDXhvV2QgEt', addedBy: { userId: '1', displayName: 'Gaurav Singh', avatarColor: '#C6FF3D' }, createdAt: new Date(Date.now() - 120 * 60000).toISOString() },
      ]);
      setTotalSongs(5);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshVibeAndPlaylist = async () => {
    if (!roomId) return;
    setIsRefreshing(true);
    try {
      const [freshVibe, freshPlaylist] = await Promise.all([
        apiFetch<VibeData>(`/api/rooms/${roomId}/vibe`),
        apiFetch<{ total: number; songs: PlaylistSong[] }>(`/api/rooms/${roomId}/playlist`),
      ]);
      setVibe(freshVibe);
      setSongs(freshPlaylist.songs || []);
      setTotalSongs(freshPlaylist.total || 0);
    } catch {
      // Ignore background refresh errors
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePostCheckin = async (data: {
    mood: string;
    energy: number;
    note: string;
    songs: { title: string; artist: string; link?: string }[];
  }) => {
    if (!user) {
      onOpenAuth();
      return;
    }

    setIsSubmittingCheckin(true);
    try {
      const response = await apiFetch<any>(`/api/rooms/${roomId}/checkins`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response?.vibe) {
        setVibe(response.vibe);
      }
      refreshVibeAndPlaylist();
    } catch {
      // Local demo fallback: update state immediately so user sees instant reaction
      const newSongItems: PlaylistSong[] = data.songs.map((s, idx) => ({
        id: `local-s-${Date.now()}-${idx}`,
        title: s.title,
        artist: s.artist,
        link: s.link || null,
        addedBy: {
          userId: user.id,
          displayName: user.displayName,
          avatarColor: user.avatarColor,
        },
        createdAt: new Date().toISOString(),
      }));

      setSongs((prev) => [...newSongItems, ...prev]);
      setTotalSongs((prev) => prev + newSongItems.length);
    } finally {
      setIsSubmittingCheckin(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-lime border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-text-muted">Loading room dashboard…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Room Sub-Header Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-text-main">
              {room?.name || 'Room Dashboard'}
            </h1>
            {!room?.isActive && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink/20 text-pink border border-pink/40">
                Closed
              </span>
            )}
          </div>
          <p className="text-xs text-text-muted mt-1">
            Hi, <strong>{user?.displayName || 'Friend'}</strong>! Share your mood and listen together.
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          <Link
            to={`/room/${roomId}/history`}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-surface-2 border border-border hover:border-text-muted text-text-main transition-colors"
          >
            <History className="w-3.5 h-3.5 text-cyan" />
            <span>History</span>
          </Link>

          {room?.currentUserRole === 'admin' && (
            <Link
              to={`/room/${roomId}/admin`}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full bg-pink/10 border border-pink/30 hover:bg-pink/20 text-pink transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>
      </div>

      {/* Hero Vibe Score Card */}
      <VibeMeter
        score={vibe?.score ?? null}
        label={vibe?.label ?? null}
        dominantMood={vibe?.dominantMood ?? null}
        averageEnergy={vibe?.averageEnergy ?? null}
        countedMembers={vibe?.countedMembers ?? 0}
        totalMembers={vibe?.totalMembers ?? room?.members?.length ?? 0}
        onRefresh={refreshVibeAndPlaylist}
        onOpenExplainer={() => setShowExplainer(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Grid: Check-in, Mood-Mix, Latest Moods, Playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 cols): Checkin Form + MoodMix Chart */}
        <div className="lg:col-span-5 space-y-8">
          <CheckInForm onSubmit={handlePostCheckin} isSubmitting={isSubmittingCheckin} />
          <MoodMixChart
            moodMix={vibe?.moodMix || {}}
            totalCounted={vibe?.countedMembers || 0}
          />
        </div>

        {/* Right Column (7 cols): Latest Moods + Shared Playlist */}
        <div className="lg:col-span-7 space-y-8">
          <LatestMoods members={vibe?.latestMoods || []} />
          <SharedPlaylist songs={songs} total={totalSongs} />
        </div>
      </div>

      {/* Score Explainer Modal */}
      <ScoreExplainerModal isOpen={showExplainer} onClose={() => setShowExplainer(false)} />
    </div>
  );
};
