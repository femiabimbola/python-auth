import {
  User,
  Shield,
  Bell,
  Palette,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { UserData } from '../types';

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
}

function formatDate(dateString?: string) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const navItems = [
  { id: 'profile', label: 'Profile', icon: User, desc: 'Personal information' },
  { id: 'security', label: 'Security', icon: Shield, desc: 'Password & 2FA' },
  { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Email & push alerts' },
  { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Theme & display' },
];

export function SettingsSidebar({ user }: { user: UserData }) {
  return (
    <div className="lg:col-span-3 space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(user.first_name, user.last_name)
            )}
          </div>
          {/* TODO: Extract to client component when wiring up avatar upload */}
          <label className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
            <Camera className="w-4 h-4 text-slate-600" />
            <input type="file" className="hidden" accept="image/*" />
          </label>
        </div>

        <h2 className="mt-4 text-xl font-semibold text-slate-900">{user.full_name}</h2>
        <p className="text-sm text-slate-500">{user.email}</p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
              user.is_verified
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {user.is_verified ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <AlertCircle className="w-3 h-3" />
            )}
            {user.is_verified ? 'Verified' : 'Unverified'}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 capitalize">
            {user.role}
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
          Member since {formatDate(user.created_at)}
        </div>
      </div>

      {/* Quick Navigation */}
      <nav className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {navItems.map((item, idx) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors group ${
              idx !== navItems.length - 1 ? 'border-b border-slate-100' : ''
            }`}
          >
            <div className="p-2 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <item.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{item.label}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
          </a>
        ))}
      </nav>

      {/* Account Security */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          Account Security
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Status</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">2FA</span>
            <span
              className={`font-medium ${
                user.two_factor_enabled ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {user.two_factor_enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Sessions</span>
            <span className="font-medium text-slate-900">1 active</span>
          </div>
        </div>
      </div>
    </div>
  );
}