import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, CalendarDays, Camera, LogOut, Mail, Palette, Phone, RefreshCw, Save, ShieldCheck, Sparkles, Upload, UserCircle2 } from 'lucide-react';
import apiService from '@/services/api';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ProfilePageProps {
  user: any;
  onUserUpdate: (user: any) => void;
  onLogout: () => void;
}

const avatarColors = ['#16a34a', '#ea580c', '#2563eb', '#7c3aed', '#db2777', '#0f766e'];

const AVATAR_STYLES = [
  { id: 'avataaars', name: 'Cartoon' },
  { id: 'lorelei', name: 'Lorelei' },
  { id: 'pixel-art', name: 'Pixel Art' },
  { id: 'bottts', name: 'Robot' },
  { id: 'fun-emoji', name: 'Emoji' },
  { id: 'croodles', name: 'Doodle' },
];

const SKIN_COLORS = [
  { label: 'Pale', value: 'Pale', hex: '#FFDBB4' },
  { label: 'Light', value: 'Light', hex: '#EDB98A' },
  { label: 'Tanned', value: 'Tanned', hex: '#D08B5B' },
  { label: 'Brown', value: 'Brown', hex: '#AE5D29' },
  { label: 'Dark', value: 'DarkBrown', hex: '#614335' },
  { label: 'Black', value: 'Black', hex: '#3C1F0D' },
];

const HAIR_COLORS = [
  { label: 'Black', value: 'Black', hex: '#090806' },
  { label: 'Brown', value: 'Brown', hex: '#A55728' },
  { label: 'Auburn', value: 'Auburn', hex: '#A55728' },
  { label: 'Blonde', value: 'Blonde', hex: '#B58143' },
  { label: 'Red', value: 'Red', hex: '#C93305' },
  { label: 'Silver', value: 'SilverGray', hex: '#ACACAC' },
  { label: 'Pink', value: 'PastelPink', hex: '#F59797' },
  { label: 'Platinum', value: 'Platinum', hex: '#ECDCBF' },
];

const HAIR_STYLES = [
  { label: 'Short Flat', value: 'ShortHairShortFlat' },
  { label: 'Short Curly', value: 'ShortHairShortCurly' },
  { label: 'Short Round', value: 'ShortHairShortRound' },
  { label: 'Wavy', value: 'ShortHairShortWaved' },
  { label: 'Caesar', value: 'ShortHairTheCaesar' },
  { label: 'Long Straight', value: 'LongHairStraight' },
  { label: 'Long Curly', value: 'LongHairCurly' },
  { label: 'Long Bob', value: 'LongHairBob' },
  { label: 'Bun', value: 'LongHairBun' },
  { label: 'Dreads', value: 'LongHairDreads' },
  { label: 'No Hair', value: 'NoHair' },
  { label: 'Hijab', value: 'Hijab' },
];

const ACCESSORIES = [
  { label: 'None', value: 'Blank' },
  { label: 'Sunglasses', value: 'Sunglasses' },
  { label: 'Glasses', value: 'Prescription02' },
  { label: 'Round', value: 'Round' },
  { label: 'Wayfarers', value: 'Wayfarers' },
  { label: 'Kurt', value: 'Kurt' },
];

const FACIAL_HAIR = [
  { label: 'None', value: 'Blank' },
  { label: 'Light Beard', value: 'BeardLight' },
  { label: 'Medium Beard', value: 'BeardMedium' },
  { label: 'Full Beard', value: 'BeardMagestic' },
  { label: 'Moustache', value: 'MoustacheFancy' },
];

const CLOTHES = [
  { label: 'Hoodie', value: 'Hoodie' },
  { label: 'Blazer', value: 'BlazerShirt' },
  { label: 'Sweater', value: 'CollarSweater' },
  { label: 'T-Shirt', value: 'ShirtCrewNeck' },
  { label: 'V-Neck', value: 'ShirtVNeck' },
  { label: 'Overall', value: 'Overall' },
];

const EYES = [
  { label: 'Default', value: 'Default' },
  { label: 'Happy', value: 'Happy' },
  { label: 'Wink', value: 'Wink' },
  { label: 'Hearts', value: 'Hearts' },
  { label: 'Surprised', value: 'Surprised' },
  { label: 'Squint', value: 'Squint' },
  { label: 'Side', value: 'Side' },
  { label: 'Roll', value: 'EyeRoll' },
];

const MOUTHS = [
  { label: 'Smile', value: 'Smile' },
  { label: 'Default', value: 'Default' },
  { label: 'Serious', value: 'Serious' },
  { label: 'Tongue', value: 'Tongue' },
  { label: 'Twinkle', value: 'Twinkle' },
  { label: 'Sad', value: 'Sad' },
];

const BG_COLORS = [
  { label: 'Sky', value: 'b6e3f4' },
  { label: 'Lavender', value: 'c0aede' },
  { label: 'Peach', value: 'ffdfbf' },
  { label: 'Pink', value: 'ffd5dc' },
  { label: 'Mint', value: 'd1fae5' },
  { label: 'Yellow', value: 'fef9c3' },
  { label: 'White', value: 'ffffff' },
  { label: 'Dark', value: '374151' },
];

function buildAvatarUrl(config: {
  style: string; seed: string; skinColor: string; hairColor: string;
  topType: string; accessories: string; facialHairType: string; clotheType: string;
  eyeType: string; mouthType: string; backgroundColor: string;
}) {
  if (config.style === 'avataaars') {
    const p = new URLSearchParams({
      seed: config.seed,
      skinColor: config.skinColor,
      topType: config.topType,
      hairColor: config.hairColor,
      accessories: config.accessories,
      facialHairType: config.facialHairType,
      clotheType: config.clotheType,
      eyeType: config.eyeType,
      mouthType: config.mouthType,
      backgroundColor: config.backgroundColor,
    });
    return `https://api.dicebear.com/7.x/avataaars/svg?${p}`;
  }
  return `https://api.dicebear.com/7.x/${config.style}/svg?seed=${encodeURIComponent(config.seed)}&backgroundColor=${config.backgroundColor}`;
}

export function ProfilePage({ user, onUserUpdate, onLogout }: ProfilePageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalPickups: 0, contributions: 0, activities: 0, points: 0, badges: [] as string[] });
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    temple: user?.temple || '',
    profileImage: user?.profileImage || '',
    avatarColor: user?.avatarColor || '#16a34a',
  });

  const [avatarConfig, setAvatarConfig] = useState({
    style: 'avataaars',
    seed: user?.name || 'PrakritiUser',
    skinColor: 'Light',
    hairColor: 'Black',
    topType: 'ShortHairShortFlat',
    accessories: 'Blank',
    facialHairType: 'Blank',
    clotheType: 'Hoodie',
    eyeType: 'Default',
    mouthType: 'Smile',
    backgroundColor: 'b6e3f4',
  });

  const avatarPreviewUrl = buildAvatarUrl(avatarConfig);

  const setAvatarField = (field: string, value: string) =>
    setAvatarConfig((prev) => ({ ...prev, [field]: value }));

  const randomizeSeed = () =>
    setAvatarConfig((prev) => ({ ...prev, seed: Math.random().toString(36).slice(2, 10) }));

  const useAvatarAsProfile = () => {
    setField('profileImage', avatarPreviewUrl);
    setAvatarConfig((prev) => prev);
  };

  const initials = useMemo(
    () =>
      (form.name || user?.name || 'U')
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    [form.name, user?.name]
  );

  const setField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const [profile, dashboard] = await Promise.all([
          apiService.getCurrentUser(),
          apiService.getUserDashboard(),
        ]);

        if (!mounted) return;

        if (profile) {
          const resolvedUser = profile.user || profile;
          setForm((prev) => ({
            ...prev,
            name: resolvedUser.name || prev.name,
            email: resolvedUser.email || prev.email,
            phone: resolvedUser.phone || '',
            temple: resolvedUser.temple || '',
            profileImage: resolvedUser.profileImage || '',
            avatarColor: resolvedUser.avatarColor || '#16a34a',
          }));
          onUserUpdate(resolvedUser);
        }

        if (dashboard) {
          setStats({
            totalPickups: dashboard.totalPickups || 0,
            contributions: dashboard.contributions || 0,
            activities: dashboard.activities || 0,
            points: dashboard.points || 0,
            badges: dashboard.badges || [],
          });
        }
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to load profile');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [onUserUpdate]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError('Image should be under 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setError('');
      setField('profileImage', String(reader.result || ''));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (profileImageOverride?: string) => {
    try {
      setSaving(true);
      setError('');
      setMessage('');
      const profileImageToSave = profileImageOverride ?? form.profileImage;
      const response = await apiService.updateProfile({
        name: form.name,
        phone: form.phone,
        temple: form.temple,
        profileImage: profileImageToSave,
        avatarColor: form.avatarColor,
      });

      const updatedUser = response.user || { ...user, ...form, profileImage: profileImageToSave };
      apiService.setUser(updatedUser);
      onUserUpdate(updatedUser);
      setMessage(response.message || 'Profile updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="rounded-[28px] overflow-hidden bg-gradient-to-r from-green-800 via-green-700 to-orange-500 text-white shadow-2xl">
          <div className="p-8 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex items-center gap-5">
              <Avatar className="h-24 w-24 border-4 border-white/30 shadow-lg">
                {form.profileImage ? <AvatarImage src={form.profileImage} alt={form.name || 'User'} /> : null}
                <AvatarFallback style={{ backgroundColor: form.avatarColor, color: 'white', fontSize: '2rem' }}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold mb-3">
                  <Sparkles className="h-3.5 w-3.5" /> Premium profile area
                </div>
                <h1 className="text-4xl font-bold">{form.name || 'My Profile'}</h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSave} disabled={saving || loading} className="rounded-xl bg-white text-green-700 hover:bg-green-50">
                <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button onClick={onLogout} variant="outline" className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20">
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>

        {(message || error) && (
          <div className={`rounded-2xl p-4 text-sm font-medium ${error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {error || message}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Reward Points', value: stats.points, icon: Sparkles, color: 'text-orange-600 bg-orange-50' },
            { label: 'Total Pickups', value: stats.totalPickups, icon: Activity, color: 'text-green-600 bg-green-50' },
            { label: 'Contributions', value: stats.contributions, icon: ShieldCheck, color: 'text-blue-600 bg-blue-50' },
            { label: 'Badges Earned', value: stats.badges.length, icon: CalendarDays, color: 'text-purple-600 bg-purple-50' },
          ].map((stat) => (
            <Card key={stat.label} className="border-0 shadow-md rounded-2xl">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{loading ? '—' : stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3 rounded-2xl bg-white shadow-sm border border-gray-100 p-1">
            <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
            <TabsTrigger value="avatar" className="rounded-xl">🎨 Avatar Creator</TabsTrigger>
            <TabsTrigger value="edit" className="rounded-xl">Edit Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0 grid lg:grid-cols-[320px_1fr] gap-6">
          <Card className="border-0 shadow-lg rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserCircle2 className="h-5 w-5 text-green-600" /> Profile Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                {form.profileImage ? <AvatarImage src={form.profileImage} alt={form.name || 'User'} /> : null}
                <AvatarFallback style={{ backgroundColor: form.avatarColor, color: 'white', fontSize: '2rem' }}>
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-xl font-bold text-gray-900">{form.name || 'Your Name'}</h2>
                <p className="text-sm text-gray-500">{form.email}</p>
                <p className="text-sm text-gray-500">{form.phone || 'Add phone number'}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{user?.role || 'user'}</Badge>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{user?.authProvider || 'local'}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full">
                {avatarColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setField('avatarColor', color)}
                    className={`h-10 rounded-xl border-2 ${form.avatarColor === color ? 'border-gray-900 scale-105' : 'border-white'} transition-all`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select avatar color ${color}`}
                  />
                ))}
              </div>

              <div className="w-full space-y-2">
                <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" /> Upload Photo
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <Button type="button" variant="ghost" className="w-full text-gray-600" onClick={() => setField('profileImage', '')}>
                  <Camera className="h-4 w-4 mr-2" /> Use Avatar Only
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg rounded-3xl">
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><Mail className="h-4 w-4 text-green-600" /> Email</div>
                  <p className="text-gray-900 break-all">{form.email}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><Phone className="h-4 w-4 text-green-600" /> Phone</div>
                  <p className="text-gray-900">{form.phone || 'Not added yet'}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><ShieldCheck className="h-4 w-4 text-green-600" /> Role</div>
                  <p className="text-gray-900 capitalize">{user?.role || 'user'}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"><Palette className="h-4 w-4 text-green-600" /> Avatar Theme</div>
                  <div className="flex items-center gap-3"><span className="h-5 w-5 rounded-full border border-white shadow" style={{ backgroundColor: form.avatarColor }}></span><span className="text-gray-900">Custom color selected</span></div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 p-5 bg-gradient-to-r from-green-50 to-orange-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Achievements & activity</h3>
                {stats.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {stats.badges.map((badge) => (
                      <Badge key={badge} className="bg-white text-green-700 border border-green-200 hover:bg-white">{badge}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">No badges yet. Start pickups and awareness activities to unlock them.</p>
                )}
                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl bg-white p-3 border border-gray-100">
                    <p className="text-gray-500">Activities</p>
                    <p className="text-xl font-bold text-gray-900">{stats.activities}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-gray-100">
                    <p className="text-gray-500">Temple</p>
                    <p className="text-xl font-bold text-gray-900">{form.temple || '—'}</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-gray-100">
                    <p className="text-gray-500">Last login</p>
                    <p className="text-base font-semibold text-gray-900">{user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-IN') : '—'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </TabsContent>

          <TabsContent value="avatar" className="mt-0">
            <Card className="border-0 shadow-lg rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-green-600" /> Avatar Creator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preview + Actions */}
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <div className="flex flex-col items-center gap-3 shrink-0">
                    <div className="rounded-3xl overflow-hidden border-4 shadow-xl" style={{ borderColor: 'var(--nature-green)', width: 160, height: 160, background: `#${avatarConfig.backgroundColor}` }}>
                      <img src={avatarPreviewUrl} alt="Avatar Preview" className="w-full h-full" />
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="rounded-xl" onClick={randomizeSeed}>
                        <RefreshCw className="h-4 w-4 mr-1" /> Random
                      </Button>
                      <Button type="button" className="rounded-xl text-white" style={{ backgroundColor: 'var(--nature-green)' }} onClick={useAvatarAsProfile}>
                        <UserCircle2 className="h-4 w-4 mr-1" /> Use Avatar
                      </Button>
                    </div>
                    {form.profileImage === avatarPreviewUrl && (
                      <p className="text-xs text-green-600 font-medium">✅ Active as your profile!</p>
                    )}
                  </div>

                  {/* Style Picker */}
                  <div className="flex-1 space-y-5">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Style</p>
                      <div className="flex flex-wrap gap-2">
                        {AVATAR_STYLES.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setAvatarField('style', s.id)}
                            className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-1.5 transition-all`}
                            style={avatarConfig.style === s.id ? { borderColor: 'var(--nature-green)', background: '#f0fdf4' } : { borderColor: '#e5e7eb' }}
                          >
                            <img
                              src={`https://api.dicebear.com/7.x/${s.id}/svg?seed=${avatarConfig.seed}&backgroundColor=${avatarConfig.backgroundColor}`}
                              alt={s.name}
                              className="w-12 h-12 rounded-xl"
                            />
                            <span className="text-[10px] font-medium text-gray-600">{s.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Background */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Background</p>
                      <div className="flex flex-wrap gap-2">
                        {BG_COLORS.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => setAvatarField('backgroundColor', c.value)}
                            title={c.label}
                            className={`h-8 w-8 rounded-full border-2 transition-all ${avatarConfig.backgroundColor === c.value ? 'scale-125' : ''}`}
                            style={{ backgroundColor: `#${c.value}`, borderColor: avatarConfig.backgroundColor === c.value ? '#000' : '#ccc' }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Avataaars-only options */}
                {avatarConfig.style === 'avataaars' && (
                  <div className="grid md:grid-cols-2 gap-5 pt-2 border-t border-gray-100">
                    {/* Skin Tone */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Skin Tone</p>
                      <div className="flex flex-wrap gap-2">
                        {SKIN_COLORS.map((c) => (
                          <button key={c.value} type="button" onClick={() => setAvatarField('skinColor', c.value)}
                            title={c.label}
                            className={`h-8 w-8 rounded-full border-2 transition-all ${avatarConfig.skinColor === c.value ? 'scale-125' : ''}`}
                            style={{ backgroundColor: c.hex, borderColor: avatarConfig.skinColor === c.value ? '#000' : '#ccc' }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Hair Color */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Hair Color</p>
                      <div className="flex flex-wrap gap-2">
                        {HAIR_COLORS.map((c) => (
                          <button key={c.value} type="button" onClick={() => setAvatarField('hairColor', c.value)}
                            title={c.label}
                            className={`h-8 w-8 rounded-full border-2 transition-all ${avatarConfig.hairColor === c.value ? 'scale-125' : ''}`}
                            style={{ backgroundColor: c.hex, borderColor: avatarConfig.hairColor === c.value ? '#000' : '#ccc' }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Hair Style */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Hair Style</p>
                      <div className="flex flex-wrap gap-1.5">
                        {HAIR_STYLES.map((h) => (
                          <button key={h.value} type="button" onClick={() => setAvatarField('topType', h.value)}
                            className={`rounded-full px-3 py-1 text-xs border transition-all ${
                              avatarConfig.topType === h.value
                                ? 'text-white border-transparent'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                            }`}
                            style={avatarConfig.topType === h.value ? { backgroundColor: 'var(--nature-green)' } : {}}
                          >{h.label}</button>
                        ))}
                      </div>
                    </div>

                    {/* Accessories */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Accessories</p>
                      <div className="flex flex-wrap gap-1.5">
                        {ACCESSORIES.map((a) => (
                          <button key={a.value} type="button" onClick={() => setAvatarField('accessories', a.value)}
                            className={`rounded-full px-3 py-1 text-xs border transition-all ${
                              avatarConfig.accessories === a.value
                                ? 'text-white border-transparent'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                            }`}
                            style={avatarConfig.accessories === a.value ? { backgroundColor: 'var(--nature-green)' } : {}}
                          >{a.label}</button>
                        ))}
                      </div>
                    </div>

                    {/* Facial Hair */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Facial Hair</p>
                      <div className="flex flex-wrap gap-1.5">
                        {FACIAL_HAIR.map((f) => (
                          <button key={f.value} type="button" onClick={() => setAvatarField('facialHairType', f.value)}
                            className={`rounded-full px-3 py-1 text-xs border transition-all ${
                              avatarConfig.facialHairType === f.value
                                ? 'text-white border-transparent'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                            }`}
                            style={avatarConfig.facialHairType === f.value ? { backgroundColor: 'var(--nature-green)' } : {}}
                          >{f.label}</button>
                        ))}
                      </div>
                    </div>

                    {/* Clothes */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Clothes</p>
                      <div className="flex flex-wrap gap-1.5">
                        {CLOTHES.map((c) => (
                          <button key={c.value} type="button" onClick={() => setAvatarField('clotheType', c.value)}
                            className={`rounded-full px-3 py-1 text-xs border transition-all ${
                              avatarConfig.clotheType === c.value
                                ? 'text-white border-transparent'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                            }`}
                            style={avatarConfig.clotheType === c.value ? { backgroundColor: 'var(--nature-green)' } : {}}
                          >{c.label}</button>
                        ))}
                      </div>
                    </div>

                    {/* Eyes */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Eyes</p>
                      <div className="flex flex-wrap gap-1.5">
                        {EYES.map((e) => (
                          <button key={e.value} type="button" onClick={() => setAvatarField('eyeType', e.value)}
                            className={`rounded-full px-3 py-1 text-xs border transition-all ${
                              avatarConfig.eyeType === e.value
                                ? 'text-white border-transparent'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                            }`}
                            style={avatarConfig.eyeType === e.value ? { backgroundColor: 'var(--nature-green)' } : {}}
                          >{e.label}</button>
                        ))}
                      </div>
                    </div>

                    {/* Mouth */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Expression</p>
                      <div className="flex flex-wrap gap-1.5">
                        {MOUTHS.map((m) => (
                          <button key={m.value} type="button" onClick={() => setAvatarField('mouthType', m.value)}
                            className={`rounded-full px-3 py-1 text-xs border transition-all ${
                              avatarConfig.mouthType === m.value
                                ? 'text-white border-transparent'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                            }`}
                            style={avatarConfig.mouthType === m.value ? { backgroundColor: 'var(--nature-green)' } : {}}
                          >{m.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <Button type="button" className="rounded-xl text-white px-6" style={{ backgroundColor: 'var(--nature-green)' }} onClick={() => { useAvatarAsProfile(); handleSave(avatarPreviewUrl); }}>
                    <Save className="h-4 w-4 mr-2" /> Save Avatar as Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="edit" className="mt-0">
            <Card className="border-0 shadow-lg rounded-3xl">
              <CardHeader>
                <CardTitle>Edit Profile Details</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="profile-name">Full Name</Label>
                <Input id="profile-name" value={form.name} onChange={(e) => setField('name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input id="profile-email" value={form.email} disabled className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone</Label>
                <Input id="profile-phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="profile-temple">Temple / Organization</Label>
                <Input id="profile-temple" value={form.temple} onChange={(e) => setField('temple', e.target.value)} placeholder="Temple name or organization" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="profile-image-url">Photo URL (optional)</Label>
                <Input id="profile-image-url" value={form.profileImage.startsWith('data:') ? '' : form.profileImage} onChange={(e) => setField('profileImage', e.target.value)} placeholder="https://example.com/your-photo.jpg" />
                <p className="text-xs text-gray-500">You can upload a file or paste an image URL.</p>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="rounded-xl text-white" style={{ backgroundColor: 'var(--nature-green)' }}>
                  <Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}