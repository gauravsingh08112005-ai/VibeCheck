// server/src/middleware/roomAuth.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors.js';
import { dataStore } from '../lib/store.js';

export interface RoomMembership {
  role: 'admin' | 'member';
  roomId: string;
  roomName: string;
  isActive: boolean;
}

declare global {
  namespace Express {
    interface Request {
      membership?: RoomMembership;
    }
  }
}

export function requireRoomMember(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const roomId = String(req.params.id);
  const user = req.user!;

  if (!user) {
    return next(new AppError(401, 'UNAUTHENTICATED', 'Authentication required.'));
  }

  const room = dataStore.rooms.get(roomId);
  if (!room) {
    return next(new AppError(404, 'NOT_FOUND', 'Room not found.'));
  }

  const member = dataStore.members.find(
    (m) => m.roomId === roomId && m.userId === user.id
  );

  if (!member) {
    return next(new AppError(403, 'FORBIDDEN', 'You do not belong to this room.'));
  }

  req.membership = {
    role: member.role,
    roomId: room.id,
    roomName: room.name,
    isActive: room.isActive,
  };

  next();
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.membership || req.membership.role !== 'admin') {
    return next(new AppError(403, 'FORBIDDEN', 'Only room administrators can perform this action.'));
  }
  next();
}
