import { fetchApi } from '@/lib/fetch-api';
import { JobSeekerForm } from "./components/job-seeker-form";
import { Toaster } from "@/components/ui/sonner"
import { redirect } from "next/navigation";

// Define the possible outcomes of checking the profile
type ProfileCheckResult =  { status: 'exists' }  | { status: 'not_found' }
  | { status: 'unauthorized' }
  | { status: 'error'; message: string };

async function checkJobSeekerProfile(): Promise<ProfileCheckResult> {
  try {
    const res = await fetchApi('/api/users/job-seeker/profile', { cache: 'no-store' });

    if (res.status === 401) return { status: 'unauthorized' };
    
  
    // 404 means they haven't created it yet - this is exactly what we want for this page!
    if (res.status === 404) {
      return { status: 'not_found' };
    }

    if (res.status === 200) {
      return { status: 'exists' };
    }

    // Handle other unexpected errors (e.g., 500)
    const body = await res.json().catch(() => ({}));
    return { status: 'error', message: body.detail || `HTTP ${res.status}` };

  } catch (err) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export default async function Home() {
   const result = await checkJobSeekerProfile();
  
    // 1. Not logged in -> Go to login
    if (result.status === 'unauthorized') redirect('/login');
    

    // 2. Profile already exists -> Redirect to their dashboard or jobs page
    if (result.status === 'exists') redirect('/dashboard'); 
    

    // 3. If there is a server error, you might want to show a message or just let it render the form
    if (result.status === 'error') {
      console.error("Failed to check profile:", result.message);
      // Optional: return an error UI here instead of the form
    }

    // If result.status === 'not_found', it skips all redirects and safely renders the form below!

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