// server/src/modules/rooms/schemas.ts
import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().trim().min(1, 'Room name is required.').max(40, 'Room name must be 40 characters or fewer.'),
}).strict();

export const joinRoomSchema = z.object({
  roomCode: z.string().trim().length(6, 'Room code must be exactly 6 characters.'),
}).strict();
