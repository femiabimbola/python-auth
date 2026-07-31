
import { fetchApi } from '@/lib/fetch-api';
import { JobSeekerForm } from "./components/job-seeker-form";
import { Toaster } from "@/components/ui/sonner"
import { redirect } from "next/navigation";
import { GetUserResult } from './types';


async function getUser(): Promise<GetUserResult> {
  try {
    const res = await fetchApi('/api/users/me', { cache: 'no-store' });

    if (res.status === 401) {
      return { success: false, error: 'unauthorized', message: 'You are not authorized to view this page.' };
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        success: false, error: 'unknown',
        message: body.detail || `HTTP ${res.status}`,
      };
    }

      const data = await res.json().catch(() => {
      throw new Error('parse');
    });

    return { success: true, data };
  } catch (err) {
    const errorType = err instanceof Error && err.message === 'parse' ? 'parse' : 'network';
    return {
      success: false,
      error: errorType,
      message: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}


export default async function Home() {

   const result = await getUser();
  
    // 1. Handle unauthorized/logged-out states by redirecting
    if (!result.success && result.error === 'unauthorized') {
      redirect('/login');
    }
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
          Create Your Profile
        </h1>
        <p className="text-lg text-slate-600">
          Set up your job seeker profile to get discovered by top employers
        </p>
      </div>
      
      <JobSeekerForm />
      <Toaster position="bottom-right" richColors /> 
      
    </main>
  );
}