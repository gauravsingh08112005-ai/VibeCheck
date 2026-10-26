// client/src/App.tsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ScoreExplainerModal } from './components/ScoreExplainerModal';
import { LandingPage } from './pages/LandingPage';
import { RoomsPage } from './pages/RoomsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { HistoryPage } from './pages/HistoryPage';
import { ApiUser, getStoredUser, setStoredUser, setStoredToken } from './lib/api';

export const App: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);

  useEffect(() => {
    // Load persisted session or seed default demo user
    const existing = getStoredUser();
    if (existing) {
      setUser(existing);
    } else {
      // Seed default user for smooth presentation walkthrough
      const defaultUser: ApiUser = {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'rahul@vibecheck.demo',
        displayName: 'Rahul',
        avatarColor: '#22D3EE',
        role: 'member',
      };
      setStoredUser(defaultUser);
      setStoredToken('demo-member-token');
      setUser(defaultUser);
    }
  }, []);

  const handleLogout = () => {
    setStoredUser(null);
    setStoredToken(null);
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-bg text-text-main flex flex-col font-sans selection:bg-lime selection:text-bg">
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenExplainer={() => setIsExplainerOpen(true)}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                user={user}
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenExplainer={() => setIsExplainerOpen(true)}
              />
            }
          />
          <Route
            path="/rooms"
            element={<RoomsPage user={user} onOpenAuth={() => setIsAuthOpen(true)} />}
          />
          <Route
            path="/room/:id"
            element={<DashboardPage user={user} onOpenAuth={() => setIsAuthOpen(true)} />}
          />
          <Route
            path="/room/:id/admin"
            element={<AdminPage user={user} onOpenAuth={() => setIsAuthOpen(true)} />}
          />
          <Route
            path="/room/:id/history"
            element={<HistoryPage user={user} onOpenAuth={() => setIsAuthOpen(true)} />}
          />
          <Route
            path="*"
            element={
              <div className="text-center py-24 space-y-4">
                <h1 className="font-heading font-extrabold text-4xl text-pink">404</h1>
                <p className="text-xs text-text-muted">The page you were looking for doesn't exist.</p>
              </div>
            }
          />
        </Routes>
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u) => setUser(u)}
      />

      <ScoreExplainerModal
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
      />
    </div>
  );
};
