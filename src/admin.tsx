import React, { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Shield, LogOut, Home } from 'lucide-react';
import { AdminPanel } from './components/AdminPanel';
import { AuthPage } from './components/AuthPage';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import apiService from './services/api';
import './index.css';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

function AdminApp() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const syncAuthState = useCallback(() => {
    try {
      const stored = localStorage.getItem('user') || localStorage.getItem('userData') || '{}';
      const user = JSON.parse(stored);
      const token = localStorage.getItem('authToken');
      setCurrentUser(user?.email && token ? user : null);
    } catch {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    syncAuthState();
    window.addEventListener('storage', syncAuthState);
    window.addEventListener('auth-changed', syncAuthState);
    return () => {
      window.removeEventListener('storage', syncAuthState);
      window.removeEventListener('auth-changed', syncAuthState);
    };
  }, [syncAuthState]);

  const handleAuthSuccess = (user: AuthUser, token: string) => {
    apiService.setToken(token);
    apiService.setUser(user);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userData', JSON.stringify(user));
    setCurrentUser(user);
    window.dispatchEvent(new Event('auth-changed'));
  };

  const handleLogout = () => {
    apiService.clearToken();
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    setCurrentUser(null);
    window.dispatchEvent(new Event('auth-changed'));
  };

  if (!currentUser) {
    return (
      <>
        <AuthPage onSuccess={handleAuthSuccess} onBack={() => { window.location.href = '/'; }} />
        <Toaster />
      </>
    );
  }

  if (currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full rounded-3xl bg-white shadow-xl border border-red-100 p-8 text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin access required</h1>
            <p className="mt-2 text-sm text-gray-500">Ye page sirf admin accounts ke liye hai. User website alag se open hogi.</p>
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => { window.location.href = '/'; }}>
              <Home className="mr-2 h-4 w-4" /> User Site
            </Button>
            <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <header className="sticky top-0 z-40 border-b border-green-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-green-700 to-orange-500 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-700">Separate Admin</p>
              <h1 className="text-lg font-bold text-gray-900">Prakriti Seva Admin Panel</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => { window.location.href = '/'; }}>
              <Home className="mr-2 h-4 w-4" /> User Site
            </Button>
            <Button onClick={handleLogout} className="bg-green-700 hover:bg-green-800 text-white">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AdminPanel />
      </main>
      <Toaster />
    </div>
  );
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')!).render(
  googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AdminApp />
    </GoogleOAuthProvider>
  ) : (
    <AdminApp />
  )
);