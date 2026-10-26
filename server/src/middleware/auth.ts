// server/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors.js';
import { getSupabase } from '../lib/supabase.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
  avatarColor: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'UNAUTHENTICATED', 'Authentication required.'));
  }

  const token = authHeader.substring(7).trim();

  // Support demo reviewer tokens
  if (token === 'demo-admin-token') {
    req.user = {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'gaurav@vibecheck.demo',
      displayName: 'Gaurav Singh',
      avatarColor: '#C6FF3D',
    };
    return next();
  }

  if (token === 'demo-member-token' || token.startsWith('demo-user-')) {
    req.user = {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'rahul@vibecheck.demo',
      displayName: 'Rahul',
      avatarColor: '#22D3EE',
    };
    return next();
  }

  // Real Supabase JWT verification
  try {
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next(new AppError(401, 'UNAUTHENTICATED', 'Invalid or expired session token.'));
    }

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, avatar_color')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email || '',
      displayName: profile?.display_name || user.email?.split('@')[0] || 'User',
      avatarColor: profile?.avatar_color || '#8B5CF6',
    };

    next();
  } catch (err) {
    return next(new AppError(401, 'UNAUTHENTICATED', 'Authentication verification failed.'));
  }
}
