// server/src/modules/vibe/routes.ts
import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { requireRoomMember } from '../../middleware/roomAuth.js';
import { getRoomVibeData } from './vibe.service.js';

export const vibeRouter = Router();

// GET /api/rooms/:id/vibe
vibeRouter.get('/:id/vibe', requireAuth, requireRoomMember, (req, res) => {
  const roomId = String(req.params.id);
  const vibeData = getRoomVibeData(roomId);
  res.status(200).json(vibeData);
});
