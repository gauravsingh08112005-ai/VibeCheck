// client/src/lib/api.ts
// Handles API requests with authentication and transparent fallback

const API_BASE = import.meta.env.VITE_API_URL || '';

export interface ApiUser {
  id: string;
  email: string;
  displayName: string;
  avatarColor: string;
  role?: 'admin' | 'member';
}

export function getStoredUser(): ApiUser | null {
  const data = localStorage.getItem('vibecheck_user');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setStoredUser(user: ApiUser | null) {
  if (user) {
    localStorage.setItem('vibecheck_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('vibecheck_user');
    localStorage.removeItem('vibecheck_token');
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem('vibecheck_token');
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem('vibecheck_token', token);
  } else {
    localStorage.removeItem('vibecheck_token');
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE}${endpoint}`;

  try {
    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Request failed with status ${res.status}`);
    }

    if (res.status === 204) {
      return {} as T;
    }

    return await res.json();
  } catch (err: any) {
    // If backend is not reached, provide fallback for demo testing
    console.warn(`[API] Fallback for ${endpoint}:`, err.message);
    throw err;
  }
}
