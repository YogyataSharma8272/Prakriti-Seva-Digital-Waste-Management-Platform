import React, { useState, Suspense, useEffect, useCallback, useRef } from 'react';
import { Home } from './components/Home';
import { WasteCollection } from './components/WasteCollection';
import { Awareness } from './components/Awareness';
import { Dashboard } from './components/Dashboard';
import { Leaderboard } from './components/Leaderboard';
import { FloatingPickupButton } from './components/FloatingPickupButton';
import { AdminPanel } from './components/AdminPanel';
import { AuthPage } from './components/AuthPage';
import { ProfilePage } from './components/ProfilePage';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Button } from './components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { Toaster } from './components/ui/sonner';
import apiService from './services/api';
import { 
  Home as HomeIcon, 
  Trash2, 
  BookOpen, 
  User, 
  Trophy,
  Menu,
  X,
  Shield,
  Sparkles,
  Bell,
  Truck,
  MapPin,
  CheckCircle,
  Volume2
} from 'lucide-react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  temple?: string;
  points?: number;
  contributions?: number;
  authProvider?: string;
  lastLoginAt?: string;
  profileImage?: string;
  avatarColor?: string;
}

interface PickupNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  type: 'approved' | 'in-transit' | 'completed' | 'tracking' | 'pending';
  snapshot: string;
}

interface PickupUpdate {
  _id: string;
  temple: string;
  status: string;
  estimatedArrival?: string;
  currentLocation?: string;
  trackingNote?: string;
  vehicleNumber?: string;
  createdAt: string;
}

type Screen = 'home' | 'waste-collection' | 'awareness' | 'dashboard' | 'leaderboard' | 'store' | 'admin' | 'auth' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [notifications, setNotifications] = useState<PickupNotification[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const unreadCountRef = useRef(0);

  const notificationStorageKey = currentUser?.email ? `pickup_notifications_seen_${currentUser.email}` : null;

  const buildPickupNotifications = useCallback((pickups: PickupUpdate[]) => {
    const seenMap = notificationStorageKey ? JSON.parse(localStorage.getItem(notificationStorageKey) || '{}') : {};

    return pickups
      .filter((pickup) => pickup.status !== 'Pending')
      .map((pickup) => {
        const snapshot = `${pickup.status}|${pickup.estimatedArrival || ''}|${pickup.currentLocation || ''}|${pickup.trackingNote || ''}|${pickup.vehicleNumber || ''}`;
        let type: PickupNotification['type'] = 'tracking';
        let title = `Tracking updated for ${pickup.temple}`;
        let description = pickup.trackingNote || 'Your pickup team has shared a new update.';

        if (pickup.status === 'Approved') {
          type = 'approved';
          title = `Pickup approved for ${pickup.temple}`;
          description = pickup.estimatedArrival ? `Estimated arrival: ${pickup.estimatedArrival}` : 'Your request has been approved by admin.';
        } else if (pickup.status === 'InTransit') {
          type = 'in-transit';
          title = `Pickup team is on the way`;
          description = pickup.currentLocation || pickup.vehicleNumber || pickup.trackingNote || 'Your sacred waste pickup is in progress.';
        } else if (pickup.status === 'Completed') {
          type = 'completed';
          title = `Pickup completed for ${pickup.temple}`;
          description = 'Your pickup has been successfully completed.';
        }

        return {
          id: pickup._id,
          title,
          description,
          timestamp: pickup.createdAt,
          unread: seenMap[pickup._id] !== snapshot,
          type,
          snapshot,
        };
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [notificationStorageKey]);

  const buildAdminNotifications = useCallback((pickups: PickupUpdate[]) => {
    const seenMap = notificationStorageKey ? JSON.parse(localStorage.getItem(notificationStorageKey) || '{}') : {};

    return pickups
      .map((pickup) => {
        const snapshot = `${pickup.status}|${pickup.createdAt}|${pickup.temple}`;
        const isPending = pickup.status === 'Pending';
        return {
          id: pickup._id,
          title: isPending ? `New pickup request: ${pickup.temple}` : `Pickup updated: ${pickup.temple}`,
          description: isPending ? 'Admin action required for approval.' : `Current status: ${pickup.status}`,
          timestamp: pickup.createdAt,
          unread: seenMap[pickup._id] !== snapshot,
          type: isPending ? 'pending' as const : 'tracking' as const,
          snapshot,
        };
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [notificationStorageKey]);

  const fetchPickupNotifications = useCallback(async () => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    try {
      if (currentUser.role === 'admin') {
        const pickups = await apiService.getAllWasteCollections();
        setNotifications(buildAdminNotifications(Array.isArray(pickups) ? pickups : []));
      } else {
        const pickups = await apiService.getMyWasteCollections();
        setNotifications(buildPickupNotifications(Array.isArray(pickups) ? pickups : []));
      }
    } catch {
      setNotifications([]);
    }
  }, [buildAdminNotifications, buildPickupNotifications, currentUser]);

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

  useEffect(() => {
    fetchPickupNotifications();
    if (!currentUser || currentUser.role === 'admin') return;

    const intervalId = window.setInterval(() => {
      fetchPickupNotifications();
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [currentUser, fetchPickupNotifications]);

  const isAdmin = currentUser?.role === 'admin';
  const unreadCount = notifications.filter((item) => item.unread).length;

  const playNotificationSound = useCallback(() => {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    gain.gain.setValueAtTime(0.001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.06, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.18);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  }, []);

  useEffect(() => {
    if (unreadCount > unreadCountRef.current && unreadCountRef.current > 0) {
      playNotificationSound();
    }
    unreadCountRef.current = unreadCount;
  }, [playNotificationSound, unreadCount]);

  const markNotificationsRead = () => {
    if (!notificationStorageKey) return;
    const seenMap = notifications.reduce<Record<string, string>>((acc, item) => {
      acc[item.id] = item.snapshot;
      return acc;
    }, {});
    localStorage.setItem(notificationStorageKey, JSON.stringify(seenMap));
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  const markNotificationRead = (id: string) => {
    if (!notificationStorageKey) return;
    const item = notifications.find((entry) => entry.id === id);
    if (!item) return;
    const currentMap = JSON.parse(localStorage.getItem(notificationStorageKey) || '{}');
    currentMap[id] = item.snapshot;
    localStorage.setItem(notificationStorageKey, JSON.stringify(currentMap));
    setNotifications((prev) => prev.map((entry) => (entry.id === id ? { ...entry, unread: false } : entry)));
  };

  const openNotifications = (open: boolean) => {
    setNotificationOpen(open);
    if (open) markNotificationsRead();
  };

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
    setCurrentScreen('home');
    window.dispatchEvent(new Event('auth-changed'));
  };

  const handleUserUpdate = (user: AuthUser) => {
    apiService.setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userData', JSON.stringify(user));
    setCurrentUser(user);
    window.dispatchEvent(new Event('auth-changed'));
  };

  const navigationItems = [
    { id: 'home' as Screen, label: 'Home', icon: HomeIcon },
    { id: 'waste-collection' as Screen, label: 'Waste Collection', icon: Trash2 },
    { id: 'awareness' as Screen, label: 'Awareness', icon: BookOpen },
    { id: 'dashboard' as Screen, label: 'My Dashboard', icon: User },
    { id: 'leaderboard' as Screen, label: 'Leaderboard', icon: Trophy },
    { id: 'store' as Screen, label: 'Store', icon: HomeIcon },
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home onNavigate={setCurrentScreen} />;
      case 'waste-collection':
        return <WasteCollection />;
      case 'awareness':
        return <Awareness />;
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return currentUser ? <ProfilePage user={currentUser} onUserUpdate={handleUserUpdate} onLogout={handleLogout} /> : <AuthPage onSuccess={handleAuthSuccess} onBack={() => setCurrentScreen('home')} />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'store': {
        // Lazy load the Store component
        const LazyStore = React.lazy(() => import('./components/Store'));
        return (
          <Suspense fallback={<div className="p-6">Loading store...</div>}>
            <LazyStore />
          </Suspense>
        );
      }
      case 'admin':
        return isAdmin ? <AdminPanel headerExtras={adminNotificationBell} /> : <Home onNavigate={setCurrentScreen} />;
      case 'auth':
        return <AuthPage onSuccess={handleAuthSuccess} onBack={() => setCurrentScreen('home')} />;
      default:
        return <Home onNavigate={setCurrentScreen} />;
    }
  };

  const getNotificationIcon = (type: PickupNotification['type']) => {
    switch (type) {
      case 'pending':
        return <Bell className="h-4 w-4 text-red-600" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-transit':
        return <Truck className="h-4 w-4 text-indigo-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <MapPin className="h-4 w-4 text-orange-600" />;
    }
  };

  const adminNotificationBell = isAdmin ? (
    <Popover open={notificationOpen} onOpenChange={openNotifications}>
      <PopoverTrigger asChild>
        <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-green-100 bg-white hover:bg-green-50 transition-colors">
          <Bell className="h-5 w-5" style={{ color: 'var(--nature-green)' }} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 rounded-2xl border border-green-100 p-0 shadow-xl">
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-800">Admin Notifications</h3>
              <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1"><Volume2 className="h-3 w-3" /> Sound on new updates</p>
            </div>
            {notifications.length > 0 && (
              <button className="text-xs font-medium text-gray-500 hover:text-green-700" onClick={markNotificationsRead}>
                Mark all read
              </button>
            )}
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No pickup updates yet.</div>
          ) : (
            notifications.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  markNotificationRead(item.id);
                  setCurrentScreen('admin');
                  setNotificationOpen(false);
                }}
                className={`mb-2 flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors ${item.unread ? 'bg-green-50' : 'hover:bg-gray-50'}`}
              >
                <div className="mt-0.5">{getNotificationIcon(item.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.description}</p>
                </div>
                {item.unread && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500" />}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b-2 border-saffron/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-saffron to-nature-green p-2 rounded-full">
                <div className="h-6 w-6 rounded-full bg-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--nature-green)' }}>Prakriti Seva - The Eco Dharmik Platform</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentScreen === item.id ? "default" : "ghost"}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 ${
                    currentScreen === item.id 
                      ? 'text-white hover:opacity-90' 
                      : 'hover:opacity-80'
                  }`}
                  style={currentScreen === item.id 
                    ? { backgroundColor: 'var(--nature-green)' }
                    : { color: 'var(--nature-green)' }
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {currentUser ? (
                <>
                  <button className="flex items-center gap-3 rounded-2xl px-3 py-2 hover:bg-green-50 transition-colors" onClick={() => setCurrentScreen('profile')}>
                    <Avatar className="h-10 w-10 border border-green-100">
                      {currentUser.profileImage ? <AvatarImage src={currentUser.profileImage} alt={currentUser.name} /> : null}
                      <AvatarFallback style={{ backgroundColor: currentUser.avatarColor || 'var(--nature-green)', color: 'white' }}>
                        {(currentUser.name || 'U').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-right">
                      <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.role === 'admin' ? 'Administrator' : 'Community Member'}</p>
                    </span>
                  </button>
                </>
              ) : (
                <Button
                  onClick={() => setCurrentScreen('auth')}
                  className="h-11 rounded-full px-5 text-white shadow-lg hover:opacity-95"
                  style={{ background: 'linear-gradient(90deg, var(--nature-green), var(--saffron))' }}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Join / Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden"
              style={{ color: 'var(--nature-green)' }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t" style={{ borderColor: 'var(--saffron-light)' }}>
              <nav className="flex flex-col space-y-2">
                {!currentUser && (
                  <Button
                    variant="default"
                    onClick={() => {
                      setCurrentScreen('auth');
                      setIsMobileMenuOpen(false);
                    }}
                    className="justify-start text-white"
                    style={{ background: 'linear-gradient(90deg, var(--nature-green), var(--saffron))' }}
                  >
                    Join / Sign In
                  </Button>
                )}
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentScreen === item.id ? "default" : "ghost"}
                    onClick={() => {
                      setCurrentScreen(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 justify-start px-4 py-2 ${
                      currentScreen === item.id 
                        ? 'text-white' 
                        : 'hover:opacity-80'
                    }`}
                    style={currentScreen === item.id 
                      ? { backgroundColor: 'var(--nature-green)' }
                      : { color: 'var(--nature-green)' }
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                ))}
                {currentUser && isAdmin && currentScreen === 'admin' && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCurrentScreen('admin');
                      setIsMobileMenuOpen(false);
                    }}
                    className="justify-start"
                  >
                    Notifications {unreadCount > 0 ? `(${unreadCount})` : ''}
                  </Button>
                )}
                {currentUser && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCurrentScreen('profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="justify-start"
                  >
                    My Profile
                  </Button>
                )}
                {currentUser && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="justify-start text-red-600"
                  >
                    Logout
                  </Button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {renderScreen()}
      </main>

      {/* Floating Pickup Button */}
      {currentScreen !== 'waste-collection' && currentScreen !== 'auth' && currentScreen !== 'profile' && (
        <FloatingPickupButton onRequestPickup={() => setCurrentScreen('waste-collection')} />
      )}

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}