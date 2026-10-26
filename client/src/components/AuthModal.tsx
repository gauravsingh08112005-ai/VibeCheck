// client/src/components/AuthModal.tsx
import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles } from 'lucide-react';
import { ApiUser, setStoredToken, setStoredUser } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: ApiUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignUp && (!displayName.trim() || displayName.length > 40)) {
      setError('Display name must be between 1 and 40 characters.');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    // Simulate login / signup or authenticate
    setTimeout(() => {
      const user: ApiUser = {
        id: '22222222-2222-2222-2222-222222222222',
        email,
        displayName: isSignUp ? displayName.trim() : email.split('@')[0],
        avatarColor: '#22D3EE',
        role: 'member',
      };
      setStoredUser(user);
      setStoredToken('demo-member-token');
      setIsLoading(false);
      onSuccess(user);
      onClose();
    }, 600);
  };

  const handleDemoLogin = (role: 'member' | 'admin') => {
    setIsLoading(true);
    setTimeout(() => {
      if (role === 'admin') {
        const adminUser: ApiUser = {
          id: '11111111-1111-1111-1111-111111111111',
          email: 'gaurav@vibecheck.demo',
          displayName: 'Gaurav Singh',
          avatarColor: '#C6FF3D',
          role: 'admin',
        };
        setStoredUser(adminUser);
        setStoredToken('demo-admin-token');
        onSuccess(adminUser);
      } else {
        const memberUser: ApiUser = {
          id: '22222222-2222-2222-2222-222222222222',
          email: 'rahul@vibecheck.demo',
          displayName: 'Rahul',
          avatarColor: '#22D3EE',
          role: 'member',
        };
        setStoredUser(memberUser);
        setStoredToken('demo-member-token');
        onSuccess(memberUser);
      }
      setIsLoading(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface border border-border rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-text-muted hover:text-text-main rounded-full hover:bg-surface-2 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-surface-2 border border-border items-center justify-center text-2xl mb-3 shadow-inner">
            ⚡
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-text-main">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-sm text-text-muted mt-1">
            {isSignUp
              ? 'Join friends, post moods and share playlists'
              : 'Sign in to access your shared vibe rooms'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 rounded-2xl bg-surface-2 border border-border mb-5">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              !isSignUp ? 'bg-violet text-white shadow-sm' : 'text-text-muted hover:text-text-main'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              isSignUp ? 'bg-violet text-white shadow-sm' : 'text-text-muted hover:text-text-main'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-pink/10 border border-pink/30 text-xs text-pink">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">Display Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Gaurav"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-main placeholder-text-muted/60 focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-main placeholder-text-muted/60 focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
              <input
                type="password"
                required
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-main placeholder-text-muted/60 focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-lime text-bg font-extrabold text-sm hover:bg-[#d4ff61] active:scale-[0.98] transition-all shadow-md disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Processing…' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Reviewer / Examiner Fast-Track Demo Logins */}
        <div className="mt-6 pt-5 border-t border-border text-center">
          <p className="text-xs text-text-muted mb-2 font-medium">Examiner & Reviewer Quick Demo:</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleDemoLogin('member')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-surface-2 border border-border hover:border-cyan text-xs font-semibold text-cyan hover:bg-cyan/10 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Member (Rahul)</span>
            </button>
            <button
              onClick={() => handleDemoLogin('admin')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-surface-2 border border-border hover:border-lime text-xs font-semibold text-lime hover:bg-lime/10 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Admin (Gaurav)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
