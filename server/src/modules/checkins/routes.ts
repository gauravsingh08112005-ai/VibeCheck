// server/src/modules/checkins/routes.ts
import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { requireRoomMember } from '../../middleware/roomAuth.js';
import { checkinInputSchema } from './schemas.js';
import { dataStore, MoodCheckin, SongItem } from '../../lib/store.js';
import { getRoomVibeData } from '../vibe/vibe.service.js';
import { AppError } from '../../lib/errors.js';
import crypto from 'crypto';

export const checkinsRouter = Router();

// POST /api/rooms/:id/checkins: Submit mood checkin + songs
checkinsRouter.post('/rooms/:id/checkins', requireAuth, requireRoomMember, (req, res, next) => {
  try {
    const roomId = String(req.params.id);
    const user = req.user!;
    const membership = req.membership!;

    if (!membership.isActive) {
      return next(new AppError(409, 'ROOM_CLOSED', 'This room is closed. No new check-ins can be posted.'));
    }

    const body = checkinInputSchema.parse(req.body);
    const now = new Date().toISOString();
    const checkinId = crypto.randomUUID();

    const songs: SongItem[] = body.songs.map((s, idx) => ({
      id: crypto.randomUUID(),
      checkinId,
      title: s.title,
      artist: s.artist,
      linkUrl: s.link || null,
      position: idx + 1,
      addedBy: {
        userId: user.id,
        displayName: user.displayName,
        avatarColor: user.avatarColor,
      },
      createdAt: now,
    }));

    const checkin: MoodCheckin = {
      id: checkinId,
      roomId,
      userId: user.id,
      displayName: user.displayName,
      avatarColor: user.avatarColor,
      mood: body.mood,
      energy: body.energy,
      note: body.note || null,
      songs,
      createdAt: now,
    };

    dataStore.checkins.unshift(checkin);

    // Compute fresh vibe
    const vibe = getRoomVibeData(roomId);

    res.status(201).json({
      checkin: {
        id: checkin.id,
        mood: checkin.mood,
        energy: checkin.energy,
        note: checkin.note,
        createdAt: checkin.createdAt,
        songs: checkin.songs,
      },
      vibe,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/rooms/:id/checkins: Paginated check-in history
checkinsRouter.get('/rooms/:id/checkins', requireAuth, requireRoomMember, (req, res) => {
  const roomId = String(req.params.id);
  const limit = Math.min(Number(req.query.limit) || 20, 50);

  const roomCheckins = dataStore.checkins
    .filter((c) => c.roomId === roomId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  res.status(200).json({
    total: roomCheckins.length,
    checkins: roomCheckins,
  });
});

// DELETE /api/checkins/:id: Delete check-in (owner or admin)
checkinsRouter.delete('/checkins/:id', requireAuth, (req, res, next) => {
  const checkinId = String(req.params.id);
  const user = req.user!;

  const checkinIndex = dataStore.checkins.findIndex((c) => c.id === checkinId);
  if (checkinIndex === -1) {
    return next(new AppError(404, 'NOT_FOUND', 'Check-in not found.'));
  }

  const checkin = dataStore.checkins[checkinIndex];
  const membership = dataStore.members.find(
    (m) => m.roomId === checkin.roomId && m.userId === user.id
  );

  const isOwner = checkin.userId === user.id;
  const isAdmin = membership?.role === 'admin';

  if (!isOwner && !isAdmin) {
    return next(new AppError(403, 'FORBIDDEN', 'You do not have permission to delete this check-in.'));
  }

  // Delete checkin (songs cascade automatically)
  dataStore.checkins.splice(checkinIndex, 1);

  res.status(204).send();
});
