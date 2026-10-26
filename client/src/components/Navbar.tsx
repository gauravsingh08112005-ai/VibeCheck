// client/src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, LogOut, Shield, User, HelpCircle } from 'lucide-react';
import { ApiUser } from '../lib/api';

interface NavbarProps {
  user: ApiUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenExplainer: () => void;
  currentRoom?: { id: string; name: string; role?: string; roomCode?: string };
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onOpenExplainer,
  currentRoom,
}) => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 bg-[#0B0B10]/90 backdrop-blur-md border-b border-[#2A2A38] px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink to-lime flex items-center justify-center font-bold text-bg text-lg shadow-md group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-text-main group-hover:text-lime transition-colors">
              vibecheck
            </span>
            <span className="ml-1 text-xs px-1.5 py-0.5 rounded bg-surface-2 text-text-muted border border-border">
              rooms
            </span>
          </div>
        </Link>

        {/* Center: Current Room Indicator if in dashboard */}
        {currentRoom && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse"></span>
            <span className="font-medium text-sm text-text-main">{currentRoom.name}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-surface-2 font-mono text-lime border border-border">
              {currentRoom.roomCode}
            </span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenExplainer}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-main px-2.5 py-1.5 rounded-full hover:bg-surface-2 transition-colors"
            title="How the Vibe Score works"
          >
            <HelpCircle className="w-4 h-4 text-violet" />
            <span className="hidden sm:inline">How it works</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {currentRoom?.role === 'admin' && (
                <Link
                  to={`/room/${currentRoom.id}/admin`}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-pink/10 text-pink border border-pink/30 hover:bg-pink/20 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              <Link
                to="/rooms"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-surface-2 text-text-main border border-border hover:border-lime transition-colors"
              >
                <span>My Rooms</span>
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-bg uppercase border border-white/20"
                  style={{ backgroundColor: user.avatarColor || '#C6FF3D' }}
                  title={user.displayName}
                >
                  {user.displayName?.charAt(0) || 'U'}
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-text-muted hover:text-pink hover:bg-surface-2 rounded-full transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="text-xs font-semibold text-text-main hover:text-lime px-3 py-1.5 rounded-full hover:bg-surface-2 transition-colors"
              >
                Log in
              </button>
              <button
                onClick={onOpenAuth}
                className="text-xs font-bold bg-lime text-bg px-4 py-2 rounded-full hover:bg-[#d6ff66] transition-colors shadow-sm"
              >
                Get started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
