// frontend/src/app/(dashboard)/dashboard/DashboardContent.tsx
'use client';

import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Briefcase, 
  Eye, 
  FileText, 
  Star, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  is_verified: boolean;
  is_active: boolean;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 401) {
    const error = new Error('Session expired. Please log in again.');
    (error as any).status = 401;
    throw error;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }

  return res.json();
};

export function DashboardContent() {
  const router = useRouter();

  const { data: user, error, isLoading } = useSWR<User>('/api/users/me', fetcher, {
    onError: (err) => {
      if (err.status === 401 || err.message.includes('Session expired')) {
        router.push('/login');
      }
    },
  });

  if (isLoading) return <div className="p-8 flex items-center justify-center min-h-[400px]">Loading...</div>;
  
  if (error && error.status !== 401) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }
  if (!user) return <div className="p-8">No user data</div>;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT COLUMN: Main Content */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Greeting Banner */}
        <div className="bg-[#f8fbff] border border-blue-50 rounded-2xl p-6 md:p-8 flex items-center gap-6">
          <Avatar className="h-20 w-20 border-4 border-white shadow-sm">
            <AvatarImage src="/api/placeholder/150/150" alt={user.first_name} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Good morning, {user.first_name}! <span className="text-2xl">👋</span>
            </h1>
            <p className="text-slate-700 font-medium">Your next opportunity could be just a click away.</p>
            <p className="text-slate-500 text-sm">Here's what's happening with your job search.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Applications Card */}
          <Card className="rounded-xl shadow-sm border-slate-100">
            <CardContent className="p-5 flex flex-col justify-between h-full group cursor-pointer hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Applications</p>
                  <h3 className="text-2xl font-bold text-slate-900">12</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-emerald-600 font-medium">+3 this week</span>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>
            </CardContent>
          </Card>

          {/* Profile Views Card */}
          <Card className="rounded-xl shadow-sm border-slate-100">
            <CardContent className="p-5 flex flex-col justify-between h-full group cursor-pointer hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <Eye size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Profile Views</p>
                  <h3 className="text-2xl font-bold text-slate-900">48</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-emerald-600 font-medium">+12% this week</span>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>
            </CardContent>
          </Card>

          {/* Interviews Card */}
          <Card className="rounded-xl shadow-sm border-slate-100">
            <CardContent className="p-5 flex flex-col justify-between h-full group cursor-pointer hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Interviews</p>
                  <h3 className="text-2xl font-bold text-slate-900">3</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Scheduled</span>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>
            </CardContent>
          </Card>

          {/* Offers Card */}
          <Card className="rounded-xl shadow-sm border-slate-100">
            <CardContent className="p-5 flex flex-col justify-between h-full group cursor-pointer hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                  <Star size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Offers</p>
                  <h3 className="text-2xl font-bold text-slate-900">1</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-orange-500 font-medium">In progress</span>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RIGHT COLUMN: Profile Summary */}
      <div className="lg:col-span-1">
        <Card className="rounded-xl shadow-sm border-slate-100 overflow-hidden">
          {/* Cover Image Placeholder */}
          <div className="h-28 w-full bg-linear-to-r from-slate-200 to-slate-300 relative">
            <img 
              src="/api/placeholder/400/150" 
              alt="Profile Cover" 
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          
          <CardContent className="p-6 pt-0">
            {/* Overlapping Avatar */}
            <div className="relative w-24 h-24 mx-auto -mt-12 mb-4">
              <Avatar className="w-full h-full border-4 border-white shadow-md">
                <AvatarImage src="/api/placeholder/150/150" alt={user.full_name} />
                <AvatarFallback className="bg-slate-100 text-slate-600 text-2xl">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 bg-slate-900 text-white p-1.5 rounded-full border-2 border-white hover:bg-slate-800 transition-colors">
                <Camera size={14} />
              </button>
            </div>

            {/* User Info */}
            <div className="text-center space-y-1 mb-8">
              <h2 className="text-xl font-bold text-slate-900">{user.full_name}</h2>
              <p className="text-slate-500 text-sm">{user.role || 'Software Developer'}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mt-2">
                <MapPin size={14} />
                <span>Lagos, Nigeria</span>
                <span className="text-slate-300">•</span>
                <span>Open to Remote</span>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-900">Profile Completion</span>
                  <span className="font-bold text-blue-600">85%</span>
                </div>
                <Progress value={85} className="h-2 bg-slate-100 [&>div]:bg-blue-600" />
              </div>

              {/* Status Alert */}
              <div className="bg-emerald-50 rounded-xl p-4 flex gap-3 border border-emerald-100">
                <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-emerald-900 text-sm mb-1">Your profile is looking great!</h4>
                  <p className="text-emerald-700 text-xs leading-relaxed">Complete your resume and add more details to reach 100%.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}