// server/src/lib/errors.ts
// Standard Error Contract (PRD Section 6)

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'ALREADY_MEMBER'
  | 'ROOM_CLOSED'
  | 'RATE_LIMITED'
  | 'INTERNAL';

export class AppError extends Error {
  public statusCode: number;
  public code: ErrorCode;
  public fields?: Record<string, string>;

  constructor(statusCode: number, code: ErrorCode, message: string, fields?: Record<string, string>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.fields = fields;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
