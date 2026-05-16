import React, { useMemo, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Leaf, Loader, ShieldCheck, Sparkles } from 'lucide-react';
import apiService from '@/services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any, token: string) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const googleEnabled = useMemo(() => Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID), []);

  // Login state
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Register state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!loginData.email || !loginData.password) {
        throw new Error('Email and password are required');
      }

      const response = await apiService.login(loginData.email, loginData.password);
      
      if (response.success) {
        apiService.setToken(response.token);
        apiService.setUser(response.user);
        onSuccess(response.user, response.token);
        onClose();
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!registerData.name || !registerData.email || !registerData.phone || !registerData.password) {
      setError('All fields are required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.register({
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password
      });

      if (response.success) {
        apiService.setToken(response.token);
        apiService.setUser(response.user);
        onSuccess(response.user, response.token);
        onClose();
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential?: string) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiService.googleLogin(credential);
      apiService.setToken(response.token);
      apiService.setUser(response.user);
      onSuccess(response.user, response.token);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] overflow-hidden border-0 p-0 rounded-3xl shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 px-6 py-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                <Leaf className="h-3.5 w-3.5" />
                Join the eco-dharmic community
              </div>
              <DialogTitle className="text-left text-2xl font-bold">Welcome to Prakriti Seva</DialogTitle>
              <p className="mt-2 text-sm text-green-50/90">
                Sign in to track pickups, join the platform, and manage your sacred environmental impact.
              </p>
            </div>
            <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Sparkles className="h-7 w-7" />
            </div>
          </div>
        </DialogHeader>

        <div className="bg-white px-6 py-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="mb-5 rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-orange-50 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Fast and secure access
            </div>
            {googleEnabled ? (
              <div className="flex justify-center rounded-xl bg-white p-3 shadow-sm">
                <GoogleLogin
                  onSuccess={(credentialResponse) => handleGoogleSuccess(credentialResponse.credential)}
                  onError={() => setError('Google sign-in failed')}
                  shape="pill"
                  text="continue_with"
                  width="300"
                />
              </div>
            ) : (
              <p className="text-center text-xs text-amber-700 rounded-xl border border-amber-200 bg-amber-50 p-3">
                Add `VITE_GOOGLE_CLIENT_ID` to enable Google sign-in.
              </p>
            )}
          </div>

          <div className="relative mb-5 text-center text-xs text-gray-500">
            <span className="relative z-10 bg-white px-3">or use email</span>
            <div className="absolute inset-x-0 top-1/2 border-t border-gray-200"></div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => { setError(''); setActiveTab(value); }} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-gray-100 p-1">
            <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign In</TabsTrigger>
            <TabsTrigger value="register" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm">Create Account</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4 pt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  disabled={isLoading}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  disabled={isLoading}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500"
                />
              </div>

              <Button 
                type="submit" 
                className="h-11 w-full rounded-xl text-base font-semibold shadow-md" 
                disabled={isLoading}
                style={{ backgroundColor: 'var(--nature-green)' }}
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500">
              New here?{' '}
              <button type="button" onClick={() => setActiveTab('register')} className="font-semibold text-green-700 hover:text-green-800">
                Create your account
              </button>
            </p>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register" className="space-y-4 pt-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  disabled={isLoading}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="your@email.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  disabled={isLoading}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  disabled={isLoading}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  disabled={isLoading}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  disabled={isLoading}
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500"
                />
              </div>
              </div>

              <Button 
                type="submit" 
                className="h-11 w-full rounded-xl text-base font-semibold shadow-md" 
                disabled={isLoading}
                style={{ backgroundColor: 'var(--nature-green)' }}
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <button type="button" onClick={() => setActiveTab('login')} className="font-semibold text-green-700 hover:text-green-800">
                Sign in
              </button>
            </p>
          </TabsContent>
        </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
