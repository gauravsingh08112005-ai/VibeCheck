// server/src/modules/rooms/routes.ts
import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { requireRoomMember } from '../../middleware/roomAuth.js';
import { createRoomSchema, joinRoomSchema } from './schemas.js';
import { dataStore, Room, RoomMember } from '../../lib/store.js';
import { generateRoomCode } from '../../lib/roomCode.js';
import { AppError } from '../../lib/errors.js';
import crypto from 'crypto';

export const roomsRouter = Router();

// POST /api/rooms: Create a new room
roomsRouter.post('/', requireAuth, (req, res, next) => {
  try {
    const user = req.user!;
    const body = createRoomSchema.parse(req.body);

    const roomId = crypto.randomUUID();
    const code = generateRoomCode();
    const now = new Date().toISOString();

    const room: Room = {
      id: roomId,
      name: body.name,
      roomCode: code,
      createdBy: user.id,
      isActive: true,
      createdAt: now,
    };

    dataStore.rooms.set(roomId, room);

    // Creator is admin
    const member: RoomMember = {
      id: crypto.randomUUID(),
      roomId,
      userId: user.id,
      role: 'admin',
      joinedAt: now,
    };
    dataStore.members.push(member);

    res.status(201).json({
      id: room.id,
      name: room.name,
      roomCode: room.roomCode,
      role: 'admin',
      isActive: room.isActive,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/rooms/join: Join by room code
roomsRouter.post('/join', requireAuth, (req, res, next) => {
  try {
    const user = req.user!;
    const body = joinRoomSchema.parse(req.body);
    const upperCode = body.roomCode.toUpperCase();

    const room = Array.from(dataStore.rooms.values()).find(
      (r) => r.roomCode.toUpperCase() === upperCode && r.isActive
    );

    if (!room) {
      return next(new AppError(404, 'NOT_FOUND', 'Room not found or code is invalid.'));
    }

    const alreadyMember = dataStore.members.some(
      (m) => m.roomId === room.id && m.userId === user.id
    );

    if (alreadyMember) {
      return next(new AppError(409, 'ALREADY_MEMBER', 'You are already a member of this room.'));
    }

    const now = new Date().toISOString();
    const newMember: RoomMember = {
      id: crypto.randomUUID(),
      roomId: room.id,
      userId: user.id,
      role: 'member',
      joinedAt: now,
    };
    dataStore.members.push(newMember);

    res.status(200).json({
      id: room.id,
      name: room.name,
      role: 'member',
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/rooms/me: List rooms for the logged-in user
roomsRouter.get('/me', requireAuth, (req, res) => {
  const user = req.user!;

  const userMemberships = dataStore.members.filter((m) => m.userId === user.id);
  const roomsList = userMemberships
    .map((m) => {
      const room = dataStore.rooms.get(m.roomId);
      if (!room || !room.isActive) return null;
      const count = dataStore.members.filter((mem) => mem.roomId === room.id).length;
      return {
        id: room.id,
        name: room.name,
        roomCode: room.roomCode,
        role: m.role,
        memberCount: count,
        isActive: room.isActive,
      };
    })
    .filter(Boolean);

  res.status(200).json({ rooms: roomsList });
});

// GET /api/rooms/:id: Room details and member list
roomsRouter.get('/:id', requireAuth, requireRoomMember, (req, res) => {
  const roomId = String(req.params.id);
  const room = dataStore.rooms.get(roomId)!;

  const members = dataStore.members
    .filter((m) => m.roomId === roomId)
    .map((m) => {
      const profile = dataStore.profiles.get(m.userId) || {
        displayName: 'Member',
        avatarColor: '#8B5CF6',
      };
      return {
        userId: m.userId,
        displayName: profile.displayName,
        role: m.role,
        joinedAt: m.joinedAt,
        avatarColor: profile.avatarColor,
      };
    });

  res.status(200).json({
    id: room.id,
    name: room.name,
    roomCode: room.roomCode,
    isActive: room.isActive,
    currentUserRole: req.membership!.role,
    members,
  });
});
