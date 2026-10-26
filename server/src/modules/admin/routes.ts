// server/src/modules/admin/routes.ts
import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { requireRoomMember, requireAdmin } from '../../middleware/roomAuth.js';
import { dataStore } from '../../lib/store.js';
import { generateRoomCode } from '../../lib/roomCode.js';
import { AppError } from '../../lib/errors.js';

export const adminRouter = Router();

// GET /api/rooms/:id/stats: Admin statistics
adminRouter.get('/:id/stats', requireAuth, requireRoomMember, requireAdmin, (req, res) => {
  const roomId = String(req.params.id);
  const room = dataStore.rooms.get(roomId)!;

  const roomMembers = dataStore.members.filter((m) => m.roomId === roomId);
  const roomCheckins = dataStore.checkins.filter((c) => c.roomId === roomId);

  let songCount = 0;
  for (const c of roomCheckins) {
    songCount += c.songs?.length || 0;
  }

  const now = new Date().getTime();
  const activeToday = new Set(
    roomCheckins
      .filter((c) => now - new Date(c.createdAt).getTime() <= 24 * 3600000)
      .map((c) => c.userId)
  ).size;

  const memberRows = roomMembers.map((m) => {
    const profile = dataStore.profiles.get(m.userId) || {
      displayName: 'Member',
      avatarColor: '#8B5CF6',
    };
    const userCheckinCount = roomCheckins.filter((c) => c.userId === m.userId).length;
    return {
      userId: m.userId,
      displayName: profile.displayName,
      role: m.role,
      joinedAt: m.joinedAt,
      avatarColor: profile.avatarColor,
      checkinCount: userCheckinCount,
    };
  });

  const recentCheckins = roomCheckins
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
    .map((c) => ({
      id: c.id,
      displayName: c.displayName,
      mood: c.mood,
      createdAt: c.createdAt,
    }));

  res.status(200).json({
    members: roomMembers.length,
    checkins: roomCheckins.length,
    songs: songCount,
    activeToday,
    memberRows,
    recentCheckins,
    roomCode: room.roomCode,
    isActive: room.isActive,
  });
});

// DELETE /api/rooms/:id/members/:userId: Remove member
adminRouter.delete('/:id/members/:userId', requireAuth, requireRoomMember, requireAdmin, (req, res, next) => {
  const roomId = String(req.params.id);
  const targetUserId = String(req.params.userId);
  const user = req.user!;

  if (targetUserId === user.id) {
    return next(new AppError(400, 'VALIDATION_ERROR', 'The admin cannot remove themselves from the room.'));
  }

  const memberIdx = dataStore.members.findIndex(
    (m) => m.roomId === roomId && m.userId === targetUserId
  );

  if (memberIdx === -1) {
    return next(new AppError(404, 'NOT_FOUND', 'Member not found in this room.'));
  }

  // Remove membership
  dataStore.members.splice(memberIdx, 1);

  // Cascade delete all checkins and songs by this member in this room (PRD Decision D7)
  dataStore.checkins = dataStore.checkins.filter(
    (c) => !(c.roomId === roomId && c.userId === targetUserId)
  );

  res.status(204).send();
});

// POST /api/rooms/:id/regenerate-code: Regenerate invite code
adminRouter.post('/:id/regenerate-code', requireAuth, requireRoomMember, requireAdmin, (req, res) => {
  const roomId = String(req.params.id);
  const room = dataStore.rooms.get(roomId)!;

  const newCode = generateRoomCode();
  room.roomCode = newCode;

  res.status(200).json({
    roomCode: newCode,
    message: 'Room code updated successfully.',
  });
});

// PATCH /api/rooms/:id/close: Close/archive room
adminRouter.patch('/:id/close', requireAuth, requireRoomMember, requireAdmin, (req, res) => {
  const roomId = String(req.params.id);
  const room = dataStore.rooms.get(roomId)!;

  room.isActive = false;

  res.status(200).json({
    isActive: false,
    message: 'Room has been closed. No new check-ins will be accepted.',
  });
});
