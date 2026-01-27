import React, { useState, Suspense } from 'react';
import { Home } from './components/Home';
import { WasteCollection } from './components/WasteCollection';
import { Awareness } from './components/Awareness';
import { Dashboard } from './components/Dashboard';
import { Leaderboard } from './components/Leaderboard';
import { FloatingPickupButton } from './components/FloatingPickupButton';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { 
  Home as HomeIcon, 
  Trash2, 
  BookOpen, 
  User, 
  Trophy,
  Menu,
  X
} from 'lucide-react';
import logoUrl from './assets/logo.svg'

type Screen = 'home' | 'waste-collection' | 'awareness' | 'dashboard' | 'leaderboard' | 'store';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      case 'leaderboard':
        return <Leaderboard />;
      case 'store':
        // Lazy load the Store component
        const LazyStore = React.lazy(() => import('./components/Store'));
        return (
          <Suspense fallback={<div className="p-6">Loading store...</div>}>
            <LazyStore />
          </Suspense>
        );
      default:
        return <Home onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b-2 border-saffron/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-saffron to-nature-green p-2 rounded-full">
                <img src={logoUrl} alt="Prakriti Seva - The Eco Dharmik Platform" className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--nature-green)' }}>Prakriti Seva - The Eco Dharmik Platform</h1>
                <p className="text-xs" style={{ color: 'var(--saffron)' }}>Sacred Waste Management</p>
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
      {currentScreen !== 'waste-collection' && (
        <FloatingPickupButton onRequestPickup={() => setCurrentScreen('waste-collection')} />
      )}

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}