import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import apiService from '../services/api';
import {
  Users,
  Truck,
  Gift,
  BookOpen,
  ShoppingBag,
  BarChart2,
  Trash2,
  CheckCircle,
  XCircle,
  Edit3,
  Plus,
  RefreshCw,
  Shield,
  AlertTriangle,
  TrendingUp,
  Package,
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_BASE: string = (import.meta as any).env?.VITE_CORE_API_BASE_URL || 'http://localhost:5002/api';

function authHeaders() {
  const token = localStorage.getItem('authToken');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  points: number;
  contributions: number;
  temple?: string;
  authProvider?: 'local' | 'google';
  profileImage?: string;
  loginCount?: number;
  lastLoginAt?: string;
  lastLoginIp?: string;
  loginHistory?: Array<{
    at: string;
    provider: 'local' | 'google';
    event: 'signup' | 'login';
    ip?: string;
    userAgent?: string;
  }>;
  createdAt: string;
}

interface Pickup {
  _id: string;
  temple: string;
  address: string;
  wasteType: string;
  scheduleDate: string;
  contactNumber: string;
  quantity: number;
  status: 'Pending' | 'Approved' | 'InTransit' | 'Completed';
  assignedVolunteer?: string;
  vehicleNumber?: string;
  estimatedArrival?: string;
  trackingNote?: string;
  currentLocation?: string;
  mapQuery?: string;
  createdBy?: { name: string; email: string };
  createdAt: string;
}

interface Reward {
  _id: string;
  name: string;
  pointsRequired: number;
  stock: number;
  isActive: boolean;
}

interface AwarenessItem {
  _id: string;
  title: string;
  description: string;
  type: 'video' | 'infographic' | 'quiz' | 'story';
  link: string;
  thumbnail?: string;
  duration?: string;
  category?: string;
  createdAt: string;
}

interface Redemption {
  _id: string;
  user: { name: string; email: string };
  reward: { name: string; pointsRequired: number };
  pointsSpent: number;
  status: 'requested' | 'approved' | 'rejected' | 'delivered';
  createdAt: string;
}

interface StoreProduct {
  id: string | number;
  title: string;
  price: number;
  image?: string | null;
  description?: string;
  category?: string;
  quantity?: number;
  createdAt?: string;
}

// ─── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Status Badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    InTransit: 'bg-indigo-100 text-indigo-800',
    Completed: 'bg-blue-100 text-blue-800',
    requested: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    delivered: 'bg-blue-100 text-blue-800',
    admin: 'bg-purple-100 text-purple-800',
    user: 'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

// ─── Section Header ─────────────────────────────────────────────────────────

function SectionHeader({ title, onRefresh, loading }: { title: string; onRefresh: () => void; loading: boolean }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
        <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
}

// ─── Confirm Dialog ─────────────────────────────────────────────────────────

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-orange-500" />
          <p className="text-gray-800 font-medium">{message}</p>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════════════════════

function OverviewTab() {
  const [stats, setStats] = useState({
    users: 0,
    pickups: 0,
    pendingPickups: 0,
    rewards: 0,
    awareness: 0,
    redemptions: 0,
    pendingRedemptions: 0,
    activeToday: 0,
    newThisWeek: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, pickups, rewards, awareness, redemptions] = await Promise.allSettled([
        apiFetch('/admin/stats'),
        apiFetch('/pickups/all'),
        apiFetch('/rewards'),
        apiFetch('/awareness'),
        apiFetch('/rewards/admin/redemptions'),
      ]);

      const resolvedStats = statsData.status === 'fulfilled' ? statsData.value : {};

      setStats({
        users: typeof resolvedStats.users === 'number' ? resolvedStats.users : 0,
        pickups: pickups.status === 'fulfilled' ? (Array.isArray(pickups.value) ? pickups.value.length : 0) : 0,
        pendingPickups:
          pickups.status === 'fulfilled' && Array.isArray(pickups.value)
            ? pickups.value.filter((p: Pickup) => p.status === 'Pending').length
            : 0,
        rewards: rewards.status === 'fulfilled' ? (Array.isArray(rewards.value) ? rewards.value.length : 0) : 0,
        awareness:
          awareness.status === 'fulfilled' ? (Array.isArray(awareness.value) ? awareness.value.length : 0) : 0,
        redemptions:
          redemptions.status === 'fulfilled' ? (Array.isArray(redemptions.value) ? redemptions.value.length : 0) : 0,
        pendingRedemptions:
          redemptions.status === 'fulfilled' && Array.isArray(redemptions.value)
            ? redemptions.value.filter((r: Redemption) => r.status === 'requested').length
            : 0,
        activeToday: typeof resolvedStats.activeToday === 'number' ? resolvedStats.activeToday : 0,
        newThisWeek: typeof resolvedStats.newThisWeek === 'number' ? resolvedStats.newThisWeek : 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return (
    <div className="space-y-6">
      <SectionHeader title="Platform Overview" onRefresh={fetchStats} loading={loading} />
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-md animate-pulse">
              <CardContent className="p-5 h-20 bg-gray-100 rounded-xl" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Users" value={stats.users} color="bg-blue-500" />
          <StatCard icon={Truck} label="Total Pickups" value={stats.pickups} color="bg-green-500" />
          <StatCard icon={AlertTriangle} label="Pending Pickups" value={stats.pendingPickups} color="bg-yellow-500" />
          <StatCard icon={Gift} label="Rewards" value={stats.rewards} color="bg-purple-500" />
          <StatCard icon={BookOpen} label="Awareness Content" value={stats.awareness} color="bg-teal-500" />
          <StatCard icon={ShoppingBag} label="Total Redemptions" value={stats.redemptions} color="bg-orange-500" />
          <StatCard icon={TrendingUp} label="Pending Redemptions" value={stats.pendingRedemptions} color="bg-red-500" />
          <StatCard icon={BarChart2} label="Active Today" value={stats.activeToday} color="bg-gray-500" />
          <StatCard icon={Plus} label="Joined This Week" value={stats.newThisWeek} color="bg-indigo-500" />
        </div>
      )}

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            Admin Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Review Pickups', tab: 'pickups', color: 'bg-green-50 border-green-200 text-green-700' },
            { label: 'Manage Rewards', tab: 'rewards', color: 'bg-purple-50 border-purple-200 text-purple-700' },
            { label: 'Pending Redemptions', tab: 'redemptions', color: 'bg-orange-50 border-orange-200 text-orange-700' },
            { label: 'Manage Users', tab: 'users', color: 'bg-blue-50 border-blue-200 text-blue-700' },
          ].map((action) => (
            <div
              key={action.tab}
              className={`p-4 rounded-xl border-2 cursor-pointer hover:shadow-md transition-all text-center font-semibold text-sm ${action.color}`}
            >
              {action.label}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// USERS TAB
// ═══════════════════════════════════════════════════════════════════════════

function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState<{ msg: string; fn: () => void } | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/admin/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (e: any) { showToast('❌ ' + e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const deleteUser = async (id: string) => {
    try {
      await apiFetch(`/admin/users/${id}`, { method: 'DELETE' });
      setUsers((prev) => prev.filter((u) => u._id !== id));
      showToast('✅ User deleted');
    } catch (e: any) { showToast('❌ ' + e.message); }
  };

  const toggleRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await apiFetch(`/admin/users/${user._id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u)));
      showToast(`✅ Role changed to ${newRole}`);
    } catch (e: any) { showToast('❌ ' + e.message); }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-xl px-4 py-3 text-sm font-medium border border-gray-200">
          {toast}
        </div>
      )}
      {confirm && (
        <ConfirmDialog
          message={confirm.msg}
          onConfirm={() => { confirm.fn(); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}
      <SectionHeader title={`Users (${filtered.length})`} onRefresh={fetchUsers} loading={loading} />
      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      {loading ? (
        <p className="text-gray-400 text-sm text-center py-8">Loading users...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">No users found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((user) => (
            <Card key={user._id} className="border border-gray-100 shadow-sm">
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                    <StatusBadge status={user.role} />
                  </div>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  {user.temple && <p className="text-xs text-gray-400">{user.temple}</p>}
                  <div className="flex gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-green-600 font-medium">🟢 {user.points} pts</span>
                    <span className="text-xs text-blue-600 font-medium">📦 {user.contributions} contributions</span>
                    <span className="text-xs text-purple-600 font-medium">🔐 {user.authProvider || 'local'}</span>
                    <span className="text-xs text-orange-600 font-medium">👀 {user.loginCount || 0} logins</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <p>Joined: {new Date(user.createdAt).toLocaleString('en-IN')}</p>
                    <p>Last Login: {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('en-IN') : 'Not logged in yet'}</p>
                    {user.lastLoginIp && <p>Last IP: {user.lastLoginIp}</p>}
                    {user.loginHistory?.[0] && (
                      <p>Recent Activity: {user.loginHistory[0].event} via {user.loginHistory[0].provider}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setConfirm({
                        msg: `Change ${user.name}'s role to ${user.role === 'admin' ? 'user' : 'admin'}?`,
                        fn: () => toggleRole(user),
                      })
                    }
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role === 'admin' ? 'Demote' : 'Make Admin'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setConfirm({
                        msg: `Delete user "${user.name}"? This cannot be undone.`,
                        fn: () => deleteUser(user._id),
                      })
                    }
                    className="text-red-500 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PICKUPS TAB
// ═══════════════════════════════════════════════════════════════════════════

function PickupsTab() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'InTransit' | 'Completed'>('All');
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState<{ msg: string; fn: () => void } | null>(null);
  const [trackingForms, setTrackingForms] = useState<Record<string, { assignedVolunteer: string; vehicleNumber: string; estimatedArrival: string; trackingNote: string; currentLocation: string; mapQuery: string }>>({});

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchPickups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/pickups/all');
      setPickups(Array.isArray(data) ? data : []);
    } catch (e: any) { showToast('❌ ' + e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPickups(); }, [fetchPickups]);

  useEffect(() => {
    const next: Record<string, { assignedVolunteer: string; vehicleNumber: string; estimatedArrival: string; trackingNote: string; currentLocation: string; mapQuery: string }> = {};
    pickups.forEach((pickup) => {
      next[pickup._id] = {
        assignedVolunteer: pickup.assignedVolunteer || '',
        vehicleNumber: pickup.vehicleNumber || '',
        estimatedArrival: pickup.estimatedArrival || '',
        trackingNote: pickup.trackingNote || '',
        currentLocation: pickup.currentLocation || '',
        mapQuery: pickup.mapQuery || pickup.address || pickup.temple || '',
      };
    });
    setTrackingForms(next);
  }, [pickups]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const tracking = trackingForms[id] || {
        assignedVolunteer: '',
        vehicleNumber: '',
        estimatedArrival: '',
        trackingNote: '',
        currentLocation: '',
        mapQuery: '',
      };
      await apiFetch(`/pickups/status/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status, ...tracking }),
      });
      setPickups((prev) => prev.map((p) => (p._id === id ? { ...p, status: status as Pickup['status'], ...tracking } : p)));
      showToast(`✅ Status updated to ${status}`);
    } catch (e: any) { showToast('❌ ' + e.message); }
  };

  const saveTracking = async (pickupId: string) => {
    try {
      const tracking = trackingForms[pickupId] || {
        assignedVolunteer: '',
        vehicleNumber: '',
        estimatedArrival: '',
        trackingNote: '',
        currentLocation: '',
        mapQuery: '',
      };
      const updated = await apiFetch(`/pickups/status/${pickupId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: pickups.find((p) => p._id === pickupId)?.status, ...tracking }),
      });
      setPickups((prev) => prev.map((p) => (p._id === pickupId ? { ...p, ...(updated.pickup || {}), ...tracking } : p)));
      showToast('✅ Tracking details updated');
    } catch (e: any) {
      showToast('❌ ' + e.message);
    }
  };

  const deletePickup = async (id: string) => {
    try {
      await apiFetch(`/pickups/${id}`, { method: 'DELETE' });
      setPickups((prev) => prev.filter((p) => p._id !== id));
      showToast('✅ Pickup deleted');
    } catch (e: any) { showToast('❌ ' + e.message); }
  };

  const filtered = filter === 'All' ? pickups : pickups.filter((p) => p.status === filter);

  const counts = {
    All: pickups.length,
    Pending: pickups.filter((p) => p.status === 'Pending').length,
    Approved: pickups.filter((p) => p.status === 'Approved').length,
    InTransit: pickups.filter((p) => p.status === 'InTransit').length,
    Completed: pickups.filter((p) => p.status === 'Completed').length,
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-xl px-4 py-3 text-sm font-medium border border-gray-200">
          {toast}
        </div>
      )}
      {confirm && (
        <ConfirmDialog
          message={confirm.msg}
          onConfirm={() => { confirm.fn(); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}
      <SectionHeader title={`Pickup Requests (${filtered.length})`} onRefresh={fetchPickups} loading={loading} />

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap mb-4">
        {(['All', 'Pending', 'Approved', 'InTransit', 'Completed'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
              filter === s
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
            }`}
          >
            {s} <span className="ml-1 opacity-70">({counts[s]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm text-center py-8">Loading pickups...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">No pickups found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((pickup) => (
            <Card key={pickup._id} className="border border-gray-100 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-gray-800">{pickup.temple}</p>
                      <StatusBadge status={pickup.status} />
                    </div>
                    <p className="text-sm text-gray-600">{pickup.address}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                      <span>🗑️ {pickup.wasteType}</span>
                      <span>📦 {pickup.quantity} kg</span>
                      <span>📅 {new Date(pickup.scheduleDate).toLocaleDateString('en-IN')}</span>
                      <span>📞 {pickup.contactNumber}</span>
                    </div>
                    {pickup.createdBy && (
                      <p className="text-xs text-gray-400 mt-1">
                        By: {pickup.createdBy.name} ({pickup.createdBy.email})
                      </p>
                    )}
                    {(pickup.status === 'Approved' || pickup.status === 'InTransit' || pickup.status === 'Completed') && (
                      <div className="mt-3 grid sm:grid-cols-2 gap-2 rounded-xl bg-green-50 border border-green-100 p-3">
                        <Input
                          placeholder="Assigned volunteer"
                          value={trackingForms[pickup._id]?.assignedVolunteer || ''}
                          onChange={(e) => setTrackingForms((prev) => ({ ...prev, [pickup._id]: { ...(prev[pickup._id] || { assignedVolunteer: '', vehicleNumber: '', estimatedArrival: '', trackingNote: '', currentLocation: '', mapQuery: '' }), assignedVolunteer: e.target.value } }))}
                        />
                        <Input
                          placeholder="Vehicle number"
                          value={trackingForms[pickup._id]?.vehicleNumber || ''}
                          onChange={(e) => setTrackingForms((prev) => ({ ...prev, [pickup._id]: { ...(prev[pickup._id] || { assignedVolunteer: '', vehicleNumber: '', estimatedArrival: '', trackingNote: '', currentLocation: '', mapQuery: '' }), vehicleNumber: e.target.value } }))}
                        />
                        <Input
                          placeholder="ETA e.g. 30 mins"
                          value={trackingForms[pickup._id]?.estimatedArrival || ''}
                          onChange={(e) => setTrackingForms((prev) => ({ ...prev, [pickup._id]: { ...(prev[pickup._id] || { assignedVolunteer: '', vehicleNumber: '', estimatedArrival: '', trackingNote: '', currentLocation: '', mapQuery: '' }), estimatedArrival: e.target.value } }))}
                        />
                        <Input
                          placeholder="Tracking note"
                          value={trackingForms[pickup._id]?.trackingNote || ''}
                          onChange={(e) => setTrackingForms((prev) => ({ ...prev, [pickup._id]: { ...(prev[pickup._id] || { assignedVolunteer: '', vehicleNumber: '', estimatedArrival: '', trackingNote: '', currentLocation: '', mapQuery: '' }), trackingNote: e.target.value } }))}
                        />
                        <Input
                          placeholder="Current location / landmark"
                          value={trackingForms[pickup._id]?.currentLocation || ''}
                          onChange={(e) => setTrackingForms((prev) => ({ ...prev, [pickup._id]: { ...(prev[pickup._id] || { assignedVolunteer: '', vehicleNumber: '', estimatedArrival: '', trackingNote: '', currentLocation: '', mapQuery: '' }), currentLocation: e.target.value } }))}
                        />
                        <Input
                          placeholder="Map search query / address"
                          value={trackingForms[pickup._id]?.mapQuery || ''}
                          onChange={(e) => setTrackingForms((prev) => ({ ...prev, [pickup._id]: { ...(prev[pickup._id] || { assignedVolunteer: '', vehicleNumber: '', estimatedArrival: '', trackingNote: '', currentLocation: '', mapQuery: '' }), mapQuery: e.target.value } }))}
                        />
                        <div className="sm:col-span-2 flex justify-end">
                          <Button size="sm" variant="outline" className="border-green-200 text-green-700" onClick={() => saveTracking(pickup._id)}>
                            Save Tracking Details
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pickup.status === 'Pending' && (
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => updateStatus(pickup._id, 'Approved')}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                    )}
                    {pickup.status === 'Approved' && (
                      <Button
                        size="sm"
                        className="bg-indigo-500 hover:bg-indigo-600 text-white"
                        onClick={() => updateStatus(pickup._id, 'InTransit')}
                      >
                        <Truck className="h-3 w-3 mr-1" />
                        Start Pickup
                      </Button>
                    )}
                    {pickup.status === 'InTransit' && (
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => updateStatus(pickup._id, 'Completed')}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    )}
                    {pickup.status !== 'Pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-yellow-600 border-yellow-200"
                        onClick={() => updateStatus(pickup._id, 'Pending')}
                      >
                        Reset
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() =>
                        setConfirm({
                          msg: `Delete pickup request for "${pickup.temple}"?`,
                          fn: () => deletePickup(pickup._id),
                        })
                      }
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REWARDS TAB
// ═══════════════════════════════════════════════════════════════════════════

function RewardsTab() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState<{ msg: string; fn: () => void } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [form, setForm] = useState({ name: '', pointsRequired: '', stock: '', isActive: true });
  const [saving, setSaving] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchRewards = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/rewards');
      setRewards(Array.isArray(data) ? data : []);
    } catch (e: any) { showToast('❌ ' + e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRewards(); }, [fetchRewards]);

  const openCreate = () => {
    setEditingReward(null);
    setForm({ name: '', pointsRequired: '', stock: '', isActive: true });
    setShowForm(true);
  };

  const openEdit = (reward: Reward) => {
    setEditingReward(reward);
    setForm({ name: reward.name, pointsRequired: String(reward.pointsRequired), stock: String(reward.stock), isActive: reward.isActive });
    setShowForm(true);
  };

  const saveReward = async () => {
    if (!form.name || !form.pointsRequired) { showToast('❌ Name and points required'); return; }
    setSaving(true);
    const body = { name: form.name, pointsRequired: Number(form.pointsRequired), stock: Number(form.stock) || 0, isActive: form.isActive };
    try {
      if (editingReward) {
        const updated = await apiFetch(`/rewards/${editingReward._id}`, { method: 'PUT', body: JSON.stringify(body) });
        setRewards((prev) => prev.map((r) => (r._id === editingReward._id ? updated : r)));
        showToast('✅ Reward updated');
      } else {
        const created = await apiFetch('/rewards', { method: 'POST', body: JSON.stringify(body) });
        setRewards((prev) => [created, ...prev]);
        showToast('✅ Reward created');
      }
      setShowForm(false);
    } catch (e: any) { showToast('❌ ' + e.message); }
    finally { setSaving(false); }
  };

  const deleteReward = async (id: string) => {
    try {
      await apiFetch(`/rewards/${id}`, { method: 'DELETE' });
      setRewards((prev) => prev.filter((r) => r._id !== id));
      showToast('✅ Reward deleted');
    } catch (e: any) { showToast('❌ ' + e.message); }
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-xl px-4 py-3 text-sm font-medium border border-gray-200">
          {toast}
        </div>
      )}
      {confirm && (
        <ConfirmDialog
          message={confirm.msg}
          onConfirm={() => { confirm.fn(); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-bold mb-4">{editingReward ? 'Edit Reward' : 'Add New Reward'}</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Reward Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Eco Tote Bag"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Points Required *</label>
                <Input
                  type="number"
                  value={form.pointsRequired}
                  onChange={(e) => setForm({ ...form, pointsRequired: e.target.value })}
                  placeholder="e.g. 500"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Stock</label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="e.g. 100"
                  className="mt-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (visible to users)</label>
              </div>
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={saveReward}
                disabled={saving}
              >
                {saving ? 'Saving...' : editingReward ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Rewards ({rewards.length})</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchRewards} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" /> Add Reward
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm text-center py-8">Loading rewards...</p>
      ) : rewards.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">No rewards yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <Card key={reward._id} className={`border shadow-sm ${!reward.isActive ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-gray-800">{reward.name}</p>
                  {!reward.isActive && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>
                  )}
                </div>
                <div className="flex gap-3 text-sm text-gray-600 mb-3">
                  <span>🎯 {reward.pointsRequired} pts</span>
                  <span>📦 {reward.stock} in stock</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-blue-600 border-blue-200"
                    onClick={() => openEdit(reward)}
                  >
                    <Edit3 className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() =>
                      setConfirm({ msg: `Delete reward "${reward.name}"?`, fn: () => deleteReward(reward._id) })
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// AWARENESS TAB
// ═══════════════════════════════════════════════════════════════════════════

function AwarenessTab() {
  const [items, setItems] = useState<AwarenessItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState<{ msg: string; fn: () => void } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'story', link: '', thumbnail: '', duration: '', category: '' });
  const [saving, setSaving] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/awareness');
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) { showToast('❌ ' + e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const saveItem = async () => {
    if (!form.title || !form.description) { showToast('❌ Title and description required'); return; }
    setSaving(true);
    try {
      const created = await apiFetch('/awareness', { method: 'POST', body: JSON.stringify(form) });
      setItems((prev) => [created.content ?? created, ...prev]);
      showToast('✅ Content added');
      setShowForm(false);
      setForm({ title: '', description: '', type: 'story', link: '', thumbnail: '', duration: '', category: '' });
    } catch (e: any) { showToast('❌ ' + e.message); }
    finally { setSaving(false); }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiFetch(`/awareness/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((i) => i._id !== id));
      showToast('✅ Content deleted');
    } catch (e: any) { showToast('❌ ' + e.message); }
  };

  const typeColors: Record<string, string> = {
    video: 'bg-red-100 text-red-700',
    infographic: 'bg-blue-100 text-blue-700',
    quiz: 'bg-yellow-100 text-yellow-800',
    story: 'bg-green-100 text-green-700',
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-xl px-4 py-3 text-sm font-medium border border-gray-200">
          {toast}
        </div>
      )}
      {confirm && (
        <ConfirmDialog
          message={confirm.msg}
          onConfirm={() => { confirm.fn(); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col" style={{ maxHeight: '90vh' }}>
            <div className="overflow-y-auto flex-1 p-6">
            <h4 className="text-lg font-bold mb-4">Add Awareness Content</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Title *</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Content title" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Content description..."
                  rows={3}
                  className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="story">Story</option>
                  <option value="video">🎥 Video Tutorial</option>
                  <option value="infographic">Infographic</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Link {form.type === 'video' ? '(YouTube / Video URL) *' : '(optional)'}</label>
                <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder={form.type === 'video' ? 'https://youtube.com/watch?v=...' : 'https://...'} className="mt-1" />
              </div>
              {form.type === 'video' && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Thumbnail Image URL</label>
                    <Input value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://... (thumbnail image)" className="mt-1" />
                    {form.thumbnail && (
                      <img src={form.thumbnail} alt="preview" className="mt-2 h-20 w-full object-cover rounded-lg border" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Duration (e.g. 8:45)</label>
                      <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="8:45" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Composting" className="mt-1" />
                    </div>
                  </div>
                </>
              )}
            </div>
            </div>
            <div className="flex gap-3 p-4 border-t justify-end bg-white rounded-b-2xl shrink-0">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={saveItem} disabled={saving}>
                {saving ? 'Saving...' : 'Add Content'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Awareness Content ({items.length})</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchItems} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Content
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm text-center py-8">Loading content...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">No awareness content yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item._id} className="border border-gray-100 shadow-sm">
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-gray-800 truncate">{item.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[item.type] || 'bg-gray-100 text-gray-600'}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  {item.type === 'video' && item.thumbnail && (
                    <img src={item.thumbnail} alt={item.title} className="mt-2 h-16 w-28 object-cover rounded-lg border" />
                  )}
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block truncate">
                      🔗 {item.link}
                    </a>
                  )}
                  {item.type === 'video' && (item.duration || item.category) && (
                    <p className="text-xs text-gray-400 mt-1">
                      {item.duration && `⏱ ${item.duration}`}{item.duration && item.category && ' · '}{item.category && `🏷 ${item.category}`}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{new Date(item.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50 shrink-0"
                  onClick={() =>
                    setConfirm({ msg: `Delete "${item.title}"?`, fn: () => deleteItem(item._id) })
                  }
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REDEMPTIONS TAB
// ═══════════════════════════════════════════════════════════════════════════

function RedemptionsTab() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'requested' | 'approved' | 'rejected' | 'delivered'>('all');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchRedemptions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/rewards/admin/redemptions');
      setRedemptions(Array.isArray(data) ? data : []);
    } catch (e: any) { showToast('❌ ' + e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRedemptions(); }, [fetchRedemptions]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiFetch(`/rewards/admin/redemptions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setRedemptions((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: status as Redemption['status'] } : r))
      );
      showToast(`✅ Status updated to ${status}`);
    } catch (e: any) { showToast('❌ ' + e.message); }
  };

  const filtered = filter === 'all' ? redemptions : redemptions.filter((r) => r.status === filter);

  const counts = {
    all: redemptions.length,
    requested: redemptions.filter((r) => r.status === 'requested').length,
    approved: redemptions.filter((r) => r.status === 'approved').length,
    rejected: redemptions.filter((r) => r.status === 'rejected').length,
    delivered: redemptions.filter((r) => r.status === 'delivered').length,
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-xl px-4 py-3 text-sm font-medium border border-gray-200">
          {toast}
        </div>
      )}
      <SectionHeader title={`Redemption Requests (${filtered.length})`} onRefresh={fetchRedemptions} loading={loading} />

      <div className="flex gap-2 flex-wrap mb-4">
        {(['all', 'requested', 'approved', 'rejected', 'delivered'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border capitalize ${
              filter === s
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-400'
            }`}
          >
            {s} <span className="ml-1 opacity-70">({counts[s]})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm text-center py-8">Loading redemptions...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">No redemptions found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <Card key={r._id} className="border border-gray-100 shadow-sm">
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-gray-800">{r.reward?.name ?? 'Unknown Reward'}</p>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-sm text-gray-600">
                    User: {r.user?.name ?? '—'} ({r.user?.email ?? '—'})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    🎯 {r.pointsSpent} pts spent · {new Date(r.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.status === 'requested' && (
                    <>
                      <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => updateStatus(r._id, 'approved')}>
                        <CheckCircle className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => updateStatus(r._id, 'rejected')}>
                        <XCircle className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {r.status === 'approved' && (
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => updateStatus(r._id, 'delivered')}>
                      <Package className="h-3 w-3 mr-1" /> Mark Delivered
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// STORE TAB
// ═══════════════════════════════════════════════════════════════════════════

function StoreTab() {
  const [toast, setToast] = useState('');
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    price: '',
    image: '',
    description: '',
    category: 'eco-friendly',
    quantity: '25',
  });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e: any) {
      showToast('❌ ' + e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = form.title.trim();
    const description = form.description.trim();
    const image = form.image.trim();
    const price = Number(form.price);
    const quantity = Number(form.quantity);

    if (!title) {
      showToast('❌ Product title is required');
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      showToast('❌ Enter a valid price greater than 0');
      return;
    }
    if (!Number.isFinite(quantity) || quantity < 0) {
      showToast('❌ Quantity cannot be negative');
      return;
    }

    setLoading(true);
    try {
      const created = await apiService.createProduct({
        title,
        price,
        image,
        description,
        category: form.category,
        quantity,
      });
      setProducts((prev) => [created, ...prev]);
      setForm({ title: '', price: '', image: '', description: '', category: 'eco-friendly', quantity: '25' });
      showToast('✅ Product added to live store');
      await fetchProducts();
    } catch (e: any) {
      showToast('❌ ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id: string | number) => {
    try {
      await apiService.deleteProduct(id);
      setProducts((prev) => prev.filter((product) => String(product.id) !== String(id)));
      showToast('✅ Product removed from store');
    } catch (e: any) {
      showToast('❌ ' + e.message);
    }
  };

  return (
    <div>
      {toast && <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-xl px-4 py-3 text-sm font-medium border border-gray-200">{toast}</div>}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-green-800 to-amber-600 text-white p-5 shadow-lg">
        <h3 className="text-lg font-bold">🛍️ Store Management</h3>
        <p className="text-sm text-white/90 mt-1">Add products here and they appear instantly in the public store.</p>
      </div>
      <form onSubmit={createProduct} className="grid md:grid-cols-2 gap-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 shadow-sm p-5 mb-6">
        <div className="md:col-span-2 flex items-center justify-between rounded-xl border border-emerald-200 bg-white px-4 py-3">
          <p className="text-sm font-semibold text-emerald-900">Add New Product</p>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: '#008000', border: '2px solid #006600' }}
          >
            <Plus className="h-4 w-4" /> {loading ? 'Submitting...' : 'Submit Product'}
          </button>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-emerald-900">Product Title *</label>
          <Input required placeholder="e.g. Bamboo Toothbrush" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-emerald-900">Price (₹) *</label>
          <Input required placeholder="e.g. 199" type="number" min="1" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-emerald-900">Image URL (optional)</label>
          <Input placeholder="https://..." value={form.image} onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))} />
          {/* Live preview — same 1:1 square aspect ratio as Store cards */}
          {form.image ? (
            <div className="relative overflow-hidden rounded-xl border border-emerald-200 bg-gray-50" style={{ aspectRatio: '1/1', maxWidth: '120px' }}>
              <img
                src={form.image}
                alt="preview"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement | null;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0 w-full h-full items-center justify-center gap-2 text-green-600 text-xs font-medium" style={{ display: 'none' }}>
                ⚠️ Image could not be loaded
              </div>
              <span className="absolute bottom-1 right-2 text-xs text-white bg-black/50 rounded px-1.5 py-0.5">Preview</span>
            </div>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-emerald-900">Quantity *</label>
          <Input required placeholder="e.g. 25" type="number" min="0" value={form.quantity} onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-emerald-900">Category</label>
          <select className="h-10 w-full rounded-md border border-emerald-300 bg-white px-3 text-sm text-emerald-900" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}>
            <option value="eco-friendly">Eco Friendly</option>
            <option value="upcycled">Upcycled</option>
            <option value="organic">Organic</option>
            <option value="zero-waste">Zero Waste</option>
          </select>
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-emerald-900">Description</label>
          <Input placeholder="Short product description" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-3 justify-end border-t border-emerald-200 pt-4">
          <Button
            type="button"
            variant="outline"
            className="text-white"
            style={{ backgroundColor: '#6b7280', border: '2px solid #4b5563' }}
            onClick={() => setForm({ title: '', price: '', image: '', description: '', category: 'eco-friendly', quantity: '25' })}
          >
            Clear Form
          </Button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md px-6 py-2 text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: '#008000', border: '2px solid #006600' }}
          >
            <Plus className="h-4 w-4" /> {loading ? 'Submitting...' : 'Add Product to Store'}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-8">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No store products yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={String(product.id)} className="border border-emerald-100 shadow-md hover:shadow-lg transition-all overflow-hidden">
              <CardContent className="p-0">
                {product.image ? (
                  <img src={product.image} alt={product.title} className="h-44 w-full object-cover" />
                ) : (
                  <div className="h-44 w-full bg-gradient-to-br from-green-100 to-orange-100 flex items-center justify-center text-5xl">♻️</div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-bold text-gray-800">{product.title}</h4>
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 capitalize border border-emerald-200">{product.category || 'eco-friendly'}</Badge>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2 min-h-[40px] leading-6">{product.description || 'No description added yet.'}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-lg font-bold text-emerald-800">₹{product.price}</p>
                      <p className="text-xs text-gray-500">Stock: {product.quantity ?? 0}</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => removeProduct(product.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════════════

export function AdminPanel({ headerExtras }: { headerExtras?: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check admin authorization on mount
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user') || localStorage.getItem('userData') || '{}';
      const user = JSON.parse(userStr);
      const token = localStorage.getItem('authToken');
      
      if (user?.role === 'admin' && token) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch {
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-orange-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-green-400 border-t-green-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-orange-50 p-4">
        <Card className="max-w-md w-full border-2 border-red-300 shadow-xl">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">You don't have permission to access the Admin Panel</p>
            <p className="text-sm text-gray-500">Only administrators can access this section.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 p-4 sm:p-6">
      {/* Admin Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-orange-500 p-2.5 rounded-xl">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
              <p className="text-sm text-gray-500">Prakriti Seva — Complete Platform Management</p>
            </div>
          </div>
          {headerExtras ? <div className="shrink-0">{headerExtras}</div> : null}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="flex flex-wrap gap-1 h-auto bg-white border border-gray-200 p-1 rounded-xl shadow-sm overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="overview" className="flex items-center gap-1.5 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg px-3 py-2 text-sm">
              <BarChart2 className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-3 py-2 text-sm">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="pickups" className="flex items-center gap-1.5 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg px-3 py-2 text-sm">
              <Truck className="h-4 w-4" /> Pickups
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-1.5 data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg px-3 py-2 text-sm">
              <Gift className="h-4 w-4" /> Rewards
            </TabsTrigger>
            <TabsTrigger value="awareness" className="flex items-center gap-1.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white rounded-lg px-3 py-2 text-sm">
              <BookOpen className="h-4 w-4" /> Awareness
            </TabsTrigger>
            <TabsTrigger value="redemptions" className="flex items-center gap-1.5 data-[state=active]:bg-orange-600 data-[state=active]:text-white rounded-lg px-3 py-2 text-sm">
              <ShoppingBag className="h-4 w-4" /> Redemptions
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center gap-1.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg px-3 py-2 text-sm">
              <Package className="h-4 w-4" /> Store
            </TabsTrigger>
          </TabsList>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab />
            </TabsContent>
            <TabsContent value="users" className="mt-0">
              <UsersTab />
            </TabsContent>
            <TabsContent value="pickups" className="mt-0">
              <PickupsTab />
            </TabsContent>
            <TabsContent value="rewards" className="mt-0">
              <RewardsTab />
            </TabsContent>
            <TabsContent value="awareness" className="mt-0">
              <AwarenessTab />
            </TabsContent>
            <TabsContent value="redemptions" className="mt-0">
              <RedemptionsTab />
            </TabsContent>
            <TabsContent value="store" className="mt-0">
              <StoreTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}