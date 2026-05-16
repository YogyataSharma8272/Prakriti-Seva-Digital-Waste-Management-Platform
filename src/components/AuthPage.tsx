import React, { useMemo, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, KeyRound, Leaf, Loader, LockKeyhole, Mail, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import apiService from '@/services/api';

function PasswordField({
  id,
  value,
  onChange,
  placeholder,
  show,
  toggleShow,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  show: boolean;
  toggleShow: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-11 rounded-xl border-gray-200 pr-11 focus-visible:ring-green-500"
        disabled={disabled}
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

interface AuthPageProps {
  onSuccess: (user: any, token: string) => void;
  onBack: () => void;
}

export function AuthPage({ onSuccess, onBack }: AuthPageProps) {
  const googleEnabled = useMemo(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    return Boolean(clientId) && !String(clientId).includes('your_google_oauth_client_id');
  }, []);
  const [activeTab, setActiveTab] = useState('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [otpLoginData, setOtpLoginData] = useState({ email: '', otp: '' });
  const [resetData, setResetData] = useState({ email: '', otp: '', newPassword: '' });

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const persistAuth = (response: any) => {
    apiService.setToken(response.token);
    apiService.setUser(response.user);
    onSuccess(response.user, response.token);
  };

  const handleGoogleSuccess = async (credential?: string) => {
    try {
      clearMessages();
      setIsLoading(true);
      const response = await apiService.googleLogin(credential);
      persistAuth(response);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      clearMessages();
      setIsLoading(true);
      const response = await apiService.login(loginData.email, loginData.password);
      persistAuth(response);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.name.trim() || !registerData.email.trim() || !registerData.phone.trim()) {
      setError('Please fill all required fields');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      clearMessages();
      setIsLoading(true);
      const response = await apiService.register(registerData);
      persistAuth(response);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      clearMessages();
      setIsLoading(true);
      const response = await apiService.sendLoginOtp(otpLoginData.email);
      setSuccess(response.message || 'OTP sent successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      clearMessages();
      setIsLoading(true);
      const response = await apiService.verifyLoginOtp(otpLoginData.email, otpLoginData.otp);
      persistAuth(response);
    } catch (err: any) {
      setError(err.message || 'OTP login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetOtp = async () => {
    try {
      clearMessages();
      setIsLoading(true);
      const response = await apiService.forgotPassword(resetData.email);
      setSuccess(response.message || 'Reset OTP sent successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      clearMessages();
      setIsLoading(true);
      const response = await apiService.resetPassword(resetData.email, resetData.otp, resetData.newPassword);
      setSuccess(response.message || 'Password reset successful');
      setActiveTab('signin');
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-orange-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <button onClick={onBack} className="rounded-full border border-white/25 px-4 py-2 text-sm backdrop-blur-sm hover:bg-white/10">
              ← Back to home
            </button>
          </div>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              <Leaf className="h-4 w-4" />
              Secure access to Prakriti Seva
            </div>
            <h1 className="text-5xl font-bold leading-tight">One modern auth space for your entire platform.</h1>
            <p className="max-w-xl text-lg text-green-50/90">
              Sign in, create your account, use OTP login, or reset password — all in one full-screen experience. Your user data stays stored in MongoDB.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: 'Secure', desc: 'JWT, OTP and Google sign-in' },
                { icon: UserPlus, title: 'Connected', desc: 'New users saved in database' },
                { icon: KeyRound, title: 'Recoverable', desc: 'Reset passwords with OTP' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <item.icon className="mb-3 h-5 w-5" />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-green-50/80">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm text-green-50/80">Prakriti Seva · Eco-Dharmic Platform</div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <Card className="w-full max-w-xl rounded-3xl border-0 shadow-2xl">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6 lg:hidden">
                <button onClick={onBack} className="text-sm font-medium text-green-700">← Back to home</button>
              </div>

              <div className="mb-6">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  Welcome back
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Access your account</h2>
                <p className="mt-2 text-sm text-gray-500">Use email, OTP, or Google to continue.</p>
              </div>

              {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
              {success && <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}

              <div className="mb-5 rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-orange-50 p-4">
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
                  <p className="text-center text-xs text-amber-700">Set a valid `VITE_GOOGLE_CLIENT_ID` to enable Google sign-in.</p>
                )}
              </div>

              <Tabs value={activeTab} onValueChange={(value) => { clearMessages(); setActiveTab(value); }}>
                <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1 sm:grid-cols-4">
                  <TabsTrigger value="signin" className="rounded-xl">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-xl">Sign Up</TabsTrigger>
                  <TabsTrigger value="otp" className="rounded-xl">OTP Login</TabsTrigger>
                  <TabsTrigger value="reset" className="rounded-xl">Forgot Password</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="pt-5">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email Address</Label>
                      <Input id="login-email" type="email" placeholder="your@email.com" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500" disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <PasswordField id="login-password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} placeholder="••••••••" show={showPassword} toggleShow={() => setShowPassword((prev) => !prev)} disabled={isLoading} />
                    </div>
                    <Button type="submit" className="h-11 w-full rounded-xl text-base font-semibold" style={{ backgroundColor: 'var(--nature-green)' }} disabled={isLoading}>
                      {isLoading ? <><Loader className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="pt-5">
                  <form onSubmit={handleRegister} className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input id="signup-name" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500" disabled={isLoading} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="signup-email">Email Address</Label>
                      <Input id="signup-email" type="email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500" disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone</Label>
                      <Input id="signup-phone" value={registerData.phone} onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500" disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <PasswordField id="signup-password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} placeholder="Create password" show={showRegisterPassword} toggleShow={() => setShowRegisterPassword((prev) => !prev)} disabled={isLoading} />
                      <p className="text-xs text-gray-500">Use at least 6 characters.</p>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <PasswordField id="signup-confirm-password" value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} placeholder="Confirm password" show={showRegisterConfirmPassword} toggleShow={() => setShowRegisterConfirmPassword((prev) => !prev)} disabled={isLoading} />
                    </div>
                    <div className="sm:col-span-2">
                      <Button type="submit" className="h-11 w-full rounded-xl text-base font-semibold" style={{ backgroundColor: 'var(--nature-green)' }} disabled={isLoading}>
                        {isLoading ? <><Loader className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : 'Create Account'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="otp" className="pt-5">
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp-email">Email Address</Label>
                      <Input id="otp-email" type="email" value={otpLoginData.email} onChange={(e) => setOtpLoginData({ ...otpLoginData, email: e.target.value })} className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500" disabled={isLoading} />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="otp-code">OTP</Label>
                        <Input id="otp-code" inputMode="numeric" maxLength={6} value={otpLoginData.otp} onChange={(e) => setOtpLoginData({ ...otpLoginData, otp: e.target.value })} className="h-11 rounded-xl border-gray-200 tracking-[0.35em] text-center focus-visible:ring-green-500" disabled={isLoading} />
                      </div>
                      <div className="flex items-end">
                        <Button type="button" variant="outline" onClick={handleSendOtp} className="h-11 rounded-xl" disabled={isLoading || !otpLoginData.email}>
                          <Mail className="mr-2 h-4 w-4" />Send OTP
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="h-11 w-full rounded-xl text-base font-semibold" style={{ backgroundColor: 'var(--nature-green)' }} disabled={isLoading}>
                      {isLoading ? <><Loader className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : 'Verify & Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="reset" className="pt-5">
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email Address</Label>
                      <Input id="reset-email" type="email" value={resetData.email} onChange={(e) => setResetData({ ...resetData, email: e.target.value })} className="h-11 rounded-xl border-gray-200 focus-visible:ring-green-500" disabled={isLoading} />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="reset-otp">Reset OTP</Label>
                        <Input id="reset-otp" inputMode="numeric" maxLength={6} value={resetData.otp} onChange={(e) => setResetData({ ...resetData, otp: e.target.value })} className="h-11 rounded-xl border-gray-200 tracking-[0.35em] text-center focus-visible:ring-green-500" disabled={isLoading} />
                      </div>
                      <div className="flex items-end">
                        <Button type="button" variant="outline" onClick={handleSendResetOtp} className="h-11 rounded-xl" disabled={isLoading || !resetData.email}>
                          <LockKeyhole className="mr-2 h-4 w-4" />Send OTP
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reset-password">New Password</Label>
                      <PasswordField id="reset-password" value={resetData.newPassword} onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })} placeholder="New password" show={showResetPassword} toggleShow={() => setShowResetPassword((prev) => !prev)} disabled={isLoading} />
                    </div>
                    <Button type="submit" className="h-11 w-full rounded-xl text-base font-semibold" style={{ backgroundColor: 'var(--nature-green)' }} disabled={isLoading}>
                      {isLoading ? <><Loader className="mr-2 h-4 w-4 animate-spin" />Resetting...</> : 'Reset Password'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}