// server/src/lib/roomCode.ts
// Generates random 6-character room code excluding confusing characters (0, O, 1, I)

import crypto from 'crypto';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateRoomCode(): string {
  let result = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = crypto.randomInt(0, CODE_CHARS.length);
    result += CODE_CHARS[randomIndex];
  }
  return result;
}
