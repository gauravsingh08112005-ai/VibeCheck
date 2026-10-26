// server/src/modules/playlist/routes.ts
import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { requireRoomMember } from '../../middleware/roomAuth.js';
import { dataStore, SongItem } from '../../lib/store.js';

export const playlistRouter = Router();

// GET /api/rooms/:id/playlist
playlistRouter.get('/:id/playlist', requireAuth, requireRoomMember, (req, res) => {
  const roomId = String(req.params.id);
  const limit = Math.min(Number(req.query.limit) || 50, 100);
  const offset = Number(req.query.offset) || 0;

  // Collect all songs from checkins belonging to this room
  const roomCheckins = dataStore.checkins.filter((c) => c.roomId === roomId);

  const allSongs: SongItem[] = [];
  for (const c of roomCheckins) {
    if (c.songs && c.songs.length > 0) {
      allSongs.push(...c.songs);
    }
  }

  // Sort newest first
  allSongs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const paginatedSongs = allSongs.slice(offset, offset + limit);

  res.status(200).json({
    total: allSongs.length,
    songs: paginatedSongs.map((s) => ({
      id: s.id,
      title: s.title,
      artist: s.artist,
      link: s.linkUrl,
      addedBy: s.addedBy,
      createdAt: s.createdAt,
    })),
  });
});
