// server/src/lib/store.ts
// In-Memory Data Store for offline development, automated testing, and zero-config demo mode.

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatarColor: string;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  roomCode: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
}

export interface RoomMember {
  id: string;
  roomId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface SongItem {
  id: string;
  checkinId: string;
  title: string;
  artist: string;
  linkUrl: string | null;
  position: number;
  addedBy: {
    userId: string;
    displayName: string;
    avatarColor: string;
  };
  createdAt: string;
}

export interface MoodCheckin {
  id: string;
  roomId: string;
  userId: string;
  displayName: string;
  avatarColor: string;
  mood: string;
  energy: number;
  note: string | null;
  songs: SongItem[];
  createdAt: string;
}

class InMemoryDataStore {
  public profiles: Map<string, UserProfile> = new Map();
  public rooms: Map<string, Room> = new Map();
  public members: RoomMember[] = [];
  public checkins: MoodCheckin[] = [];

  constructor() {
    this.seedDefaults();
  }

  public seedDefaults() {
    this.profiles.clear();
    this.rooms.clear();
    this.members = [];
    this.checkins = [];

    const now = new Date();

    // 1. Seed Profiles
    const gaurav: UserProfile = {
      id: '11111111-1111-1111-1111-111111111111',
      displayName: 'Gaurav Singh',
      email: 'gaurav@vibecheck.demo',
      avatarColor: '#C6FF3D',
      createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
    };
    const rahul: UserProfile = {
      id: '22222222-2222-2222-2222-222222222222',
      displayName: 'Rahul',
      email: 'rahul@vibecheck.demo',
      avatarColor: '#22D3EE',
      createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
    };
    const aman: UserProfile = {
      id: '33333333-3333-3333-3333-333333333333',
      displayName: 'Aman',
      email: 'aman@vibecheck.demo',
      avatarColor: '#FF4D8D',
      createdAt: new Date(now.getTime() - 4 * 86400000).toISOString(),
    };
    const rohit: UserProfile = {
      id: '44444444-4444-4444-4444-444444444444',
      displayName: 'Rohit',
      email: 'rohit@vibecheck.demo',
      avatarColor: '#FFB020',
      createdAt: new Date(now.getTime() - 4 * 86400000).toISOString(),
    };
    const kavya: UserProfile = {
      id: '55555555-5555-5555-5555-555555555555',
      displayName: 'Kavya',
      email: 'kavya@vibecheck.demo',
      avatarColor: '#8B5CF6',
      createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
    };

    [gaurav, rahul, aman, rohit, kavya].forEach((p) => this.profiles.set(p.id, p));

    // 2. Seed Room: Late Night Crew (K7P2QX)
    const roomId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    const demoRoom: Room = {
      id: roomId,
      name: 'Late Night Crew',
      roomCode: 'K7P2QX',
      createdBy: gaurav.id,
      isActive: true,
      createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
    };
    this.rooms.set(roomId, demoRoom);

    // 3. Seed Members
    this.members = [
      { id: 'm1', roomId, userId: gaurav.id, role: 'admin', joinedAt: new Date(now.getTime() - 5 * 86400000).toISOString() },
      { id: 'm2', roomId, userId: rahul.id, role: 'member', joinedAt: new Date(now.getTime() - 5 * 86400000).toISOString() },
      { id: 'm3', roomId, userId: aman.id, role: 'member', joinedAt: new Date(now.getTime() - 4 * 86400000).toISOString() },
      { id: 'm4', roomId, userId: rohit.id, role: 'member', joinedAt: new Date(now.getTime() - 4 * 86400000).toISOString() },
      { id: 'm5', roomId, userId: kavya.id, role: 'member', joinedAt: new Date(now.getTime() - 3 * 86400000).toISOString() },
    ];

    // 4. Seed Checkins (PRD Section 5.4 Worked Example)
    // Rahul: chill, energy 3 (18 min ago)
    const c1Id = 'c1111111-1111-1111-1111-111111111111';
    const c1: MoodCheckin = {
      id: c1Id,
      roomId,
      userId: rahul.id,
      displayName: rahul.displayName,
      avatarColor: rahul.avatarColor,
      mood: 'chill',
      energy: 3,
      note: 'Late night coding vibes',
      createdAt: new Date(now.getTime() - 18 * 60000).toISOString(),
      songs: [
        {
          id: 's1',
          checkinId: c1Id,
          title: 'Blinding Lights',
          artist: 'The Weeknd',
          linkUrl: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
          position: 1,
          addedBy: { userId: rahul.id, displayName: rahul.displayName, avatarColor: rahul.avatarColor },
          createdAt: new Date(now.getTime() - 18 * 60000).toISOString(),
        },
        {
          id: 's2',
          checkinId: c1Id,
          title: 'Midnight City',
          artist: 'M83',
          linkUrl: 'https://open.spotify.com/track/6GyFP1nfCDB87D2YQI5CrJ',
          position: 2,
          addedBy: { userId: rahul.id, displayName: rahul.displayName, avatarColor: rahul.avatarColor },
          createdAt: new Date(now.getTime() - 18 * 60000).toISOString(),
        },
      ],
    };

    // Aman: hyped, energy 5 (32 min ago)
    const c2Id = 'c2222222-2222-2222-2222-222222222222';
    const c2: MoodCheckin = {
      id: c2Id,
      roomId,
      userId: aman.id,
      displayName: aman.displayName,
      avatarColor: aman.avatarColor,
      mood: 'hyped',
      energy: 5,
      note: 'Submission grind mode!',
      createdAt: new Date(now.getTime() - 32 * 60000).toISOString(),
      songs: [
        {
          id: 's3',
          checkinId: c2Id,
          title: 'Starboy',
          artist: 'The Weeknd',
          linkUrl: 'https://open.spotify.com/track/7MXVkk9YM5IZxh0WSlVIh0',
          position: 1,
          addedBy: { userId: aman.id, displayName: aman.displayName, avatarColor: aman.avatarColor },
          createdAt: new Date(now.getTime() - 32 * 60000).toISOString(),
        },
        {
          id: 's4',
          checkinId: c2Id,
          title: 'Kesariya',
          artist: 'Arijit Singh',
          linkUrl: 'https://open.spotify.com/track/6WzRpRjhq4bsp5vT4m2b8Q',
          position: 2,
          addedBy: { userId: aman.id, displayName: aman.displayName, avatarColor: aman.avatarColor },
          createdAt: new Date(now.getTime() - 32 * 60000).toISOString(),
        },
        {
          id: 's5',
          checkinId: c2Id,
          title: 'Levitating',
          artist: 'Dua Lipa',
          linkUrl: 'https://open.spotify.com/track/463CkQjx2Zk1yXoBu1egbh',
          position: 3,
          addedBy: { userId: aman.id, displayName: aman.displayName, avatarColor: aman.avatarColor },
          createdAt: new Date(now.getTime() - 32 * 60000).toISOString(),
        },
      ],
    };

    // Rohit: happy, energy 4 (1 hour ago)
    const c3Id = 'c3333333-3333-3333-3333-333333333333';
    const c3: MoodCheckin = {
      id: c3Id,
      roomId,
      userId: rohit.id,
      displayName: rohit.displayName,
      avatarColor: rohit.avatarColor,
      mood: 'happy',
      energy: 4,
      note: 'Weekend energy is here',
      createdAt: new Date(now.getTime() - 60 * 60000).toISOString(),
      songs: [
        {
          id: 's6',
          checkinId: c3Id,
          title: 'Heat Waves',
          artist: 'Glass Animals',
          linkUrl: 'https://open.spotify.com/track/02MWAaffLxlfxAUY7c5dvx',
          position: 1,
          addedBy: { userId: rohit.id, displayName: rohit.displayName, avatarColor: rohit.avatarColor },
          createdAt: new Date(now.getTime() - 60 * 60000).toISOString(),
        },
        {
          id: 's7',
          checkinId: c3Id,
          title: 'Sunflower',
          artist: 'Post Malone',
          linkUrl: 'https://open.spotify.com/track/3KkXRQHbMCARz0aVfEt68P',
          position: 2,
          addedBy: { userId: rohit.id, displayName: rohit.displayName, avatarColor: rohit.avatarColor },
          createdAt: new Date(now.getTime() - 60 * 60000).toISOString(),
        },
      ],
    };

    // Gaurav: chill, energy 3 (2 hours ago)
    const c4Id = 'c4444444-4444-4444-4444-444444444444';
    const c4: MoodCheckin = {
      id: c4Id,
      roomId,
      userId: gaurav.id,
      displayName: gaurav.displayName,
      avatarColor: gaurav.avatarColor,
      mood: 'chill',
      energy: 3,
      note: 'Admin check-in: vibes looking solid',
      createdAt: new Date(now.getTime() - 120 * 60000).toISOString(),
      songs: [
        {
          id: 's8',
          checkinId: c4Id,
          title: 'Tum Hi Ho',
          artist: 'Arijit Singh',
          linkUrl: 'https://open.spotify.com/track/56zZ48jdyY2oDXhvV2QgEt',
          position: 1,
          addedBy: { userId: gaurav.id, displayName: gaurav.displayName, avatarColor: gaurav.avatarColor },
          createdAt: new Date(now.getTime() - 120 * 60000).toISOString(),
        },
        {
          id: 's9',
          checkinId: c4Id,
          title: 'Yellow',
          artist: 'Coldplay',
          linkUrl: 'https://open.spotify.com/track/3AJwUDP919kvQ9QcozQPxg',
          position: 2,
          addedBy: { userId: gaurav.id, displayName: gaurav.displayName, avatarColor: gaurav.avatarColor },
          createdAt: new Date(now.getTime() - 120 * 60000).toISOString(),
        },
      ],
    };

    // Older history row: 48h ago
    const cHistId = 'chist-1111-1111-1111-111111111111';
    const cHist: MoodCheckin = {
      id: cHistId,
      roomId,
      userId: kavya.id,
      displayName: kavya.displayName,
      avatarColor: kavya.avatarColor,
      mood: 'nostalgic',
      energy: 3,
      note: 'Old memories playlist',
      createdAt: new Date(now.getTime() - 48 * 3600000).toISOString(),
      songs: [
        {
          id: 's10',
          checkinId: cHistId,
          title: 'Apna Bana Le',
          artist: 'Arijit Singh',
          linkUrl: 'https://open.spotify.com/track/0WbMK4wrZ1wFStV9Fwa992',
          position: 1,
          addedBy: { userId: kavya.id, displayName: kavya.displayName, avatarColor: kavya.avatarColor },
          createdAt: new Date(now.getTime() - 48 * 3600000).toISOString(),
        },
      ],
    };

    this.checkins = [c1, c2, c3, c4, cHist];
  }
}

export const dataStore = new InMemoryDataStore();
