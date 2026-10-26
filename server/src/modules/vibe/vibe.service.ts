// server/src/modules/vibe/vibe.service.ts
import { dataStore } from '../../lib/store.js';
import { computeVibe, filterCountedCheckins, VibeResult } from './vibe.js';

export interface LatestMoodEntry {
  userId: string;
  displayName: string;
  avatarColor: string;
  mood: string | null;
  energy?: number;
  note?: string | null;
  createdAt?: string;
}

export interface RoomVibeResponse extends VibeResult {
  totalMembers: number;
  latestMoods: LatestMoodEntry[];
}

export function getRoomVibeData(roomId: string): RoomVibeResponse {
  // 1. Get current members
  const memberRows = dataStore.members.filter((m) => m.roomId === roomId);
  const memberUserIds = new Set(memberRows.map((m) => m.userId));

  // 2. Get checkins for these members
  const roomCheckins = dataStore.checkins.filter(
    (c) => c.roomId === roomId && memberUserIds.has(c.userId)
  );

  // 3. Counted checkins (latest within 24h)
  const countedInputs = filterCountedCheckins(
    roomCheckins.map((c) => ({
      userId: c.userId,
      mood: c.mood,
      energy: c.energy,
      createdAt: c.createdAt,
    }))
  );

  const vibeResult = computeVibe(countedInputs);

  // 4. Build Latest Moods list for all members
  const latestMoods: LatestMoodEntry[] = memberRows.map((m) => {
    const profile = dataStore.profiles.get(m.userId) || {
      displayName: 'Member',
      avatarColor: '#8B5CF6',
    };

    // Find latest checkin for this user in last 24h
    const latestCheckin = roomCheckins
      .filter((c) => c.userId === m.userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    // Check if within 24h
    const isWithin24h =
      latestCheckin &&
      new Date().getTime() - new Date(latestCheckin.createdAt).getTime() <= 24 * 3600000;

    if (latestCheckin && isWithin24h) {
      return {
        userId: m.userId,
        displayName: profile.displayName,
        avatarColor: profile.avatarColor,
        mood: latestCheckin.mood,
        energy: latestCheckin.energy,
        note: latestCheckin.note,
        createdAt: latestCheckin.createdAt,
      };
    }

    return {
      userId: m.userId,
      displayName: profile.displayName,
      avatarColor: profile.avatarColor,
      mood: null,
    };
  });

  return {
    ...vibeResult,
    totalMembers: memberRows.length,
    latestMoods,
  };
}
