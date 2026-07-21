
import { JobSeekerForm } from "./components/job-seeker-form";
// import { Toaster } from "@/components/ui/sonner";


export default function Home() {
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
      {/* <Toaster position="bottom-right" richColors />  */}
      
    </main>
  );
}