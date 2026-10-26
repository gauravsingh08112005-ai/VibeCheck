// client/src/lib/roomStore.ts
// Client-side persistent store for rooms (enables full functionality on static hosts like GitHub Pages)

export interface StoredRoom {
  id: string;
  name: string;
  roomCode: string;
  role: 'admin' | 'member';
  memberCount: number;
  isActive: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'vibecheck_custom_rooms';

export const DEFAULT_DEMO_ROOM: StoredRoom = {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  name: 'Late Night Crew',
  roomCode: 'K7P2QX',
  role: 'member',
  memberCount: 5,
  isActive: true,
  createdAt: '2026-10-20T00:00:00.000Z',
};

export function getStoredRooms(): StoredRoom[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const custom: StoredRoom[] = raw ? JSON.parse(raw) : [];
    if (!custom.some((r) => r.id === DEFAULT_DEMO_ROOM.id)) {
      return [DEFAULT_DEMO_ROOM, ...custom];
    }
    return custom;
  } catch {
    return [DEFAULT_DEMO_ROOM];
  }
}

export function saveStoredRoom(room: StoredRoom): void {
  try {
    const current = getStoredRooms().filter((r) => r.id !== room.id);
    const updated = [room, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save room to localStorage', e);
  }
}

export function findRoomByCode(code: string): StoredRoom | null {
  const norm = code.trim().toUpperCase();
  const rooms = getStoredRooms();
  return rooms.find((r) => r.roomCode.toUpperCase() === norm) || null;
}

export function findRoomById(id: string): StoredRoom | null {
  const rooms = getStoredRooms();
  return rooms.find((r) => r.id === id) || null;
}

export function createLocalRoom(name: string, role: 'admin' | 'member' = 'admin', customCode?: string): StoredRoom {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = customCode ? customCode.trim().toUpperCase() : '';
  if (!code) {
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  const room: StoredRoom = {
    id: 'room-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    name: name.trim(),
    roomCode: code,
    role,
    memberCount: role === 'admin' ? 1 : 4,
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  saveStoredRoom(room);
  return room;
}
