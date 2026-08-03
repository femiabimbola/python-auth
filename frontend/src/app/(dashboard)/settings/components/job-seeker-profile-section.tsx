// frontend/src/app/(dashboard)/settings/components/job-seeker-profile-section.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Briefcase, Phone, Clock, FileText, Plus, Loader2, ExternalLink } from 'lucide-react';
import { JobSeekerProfileData } from '../types';

interface JobSeekerProfileSectionProps {
  profile?: JobSeekerProfileData;
  isLoading: boolean;
  isNotFound: boolean;
}

export function JobSeekerProfileSection({ 
  profile, 
  isLoading, 
  isNotFound 
}: JobSeekerProfileSectionProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  if (isLoading) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p className="text-sm">Loading job seeker profile...</p>
        </div>
      </section>
    );
  }

  // Profile not created state
  if (isNotFound || !profile) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Job Seeker Profile</h2>
            <p className="text-sm text-slate-500">Set up your professional bio and job preferences.</p>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-6 text-center border border-dashed border-slate-200">
          <p className="text-sm text-slate-600 mb-4">You haven&apos;t created your job seeker profile yet.</p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Profile
          </Link>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    // Call your submit mutation here
    setTimeout(() => {
      setIsSaving(false);
      setMessage({ success: true, text: 'Job seeker profile updated successfully!' });
    }, 1000);
  };

  return (
    <section
      id="job-seeker-profile"
      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden scroll-mt-6"
    >
      <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Job Seeker Details</h2>
          <p className="text-sm text-slate-500">Manage your career preferences, headline, and resume.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Headline */}
        <div className="space-y-2">
          <label htmlFor="headline" className="block text-sm font-medium text-slate-700">
            Professional Headline
          </label>
          <input
            type="text"
            name="headline"
            id="headline"
            defaultValue={profile.headline || ''}
            placeholder="e.g. Senior Full Stack Engineer | Python & React Specialist"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all hover:border-slate-400"
          />
        </div>

        {/* Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-slate-700">City</label>
            <input
              type="text"
              name="city"
              id="city"
              defaultValue={profile.city || ''}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="state" className="block text-sm font-medium text-slate-700">State</label>
            <input
              type="text"
              name="state"
              id="state"
              defaultValue={profile.state || ''}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="country" className="block text-sm font-medium text-slate-700">Country</label>
            <input
              type="text"
              name="country"
              id="country"
              defaultValue={profile.country || ''}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Phone & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="phone_number" className="block text-sm font-medium text-slate-700">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="phone_number"
                id="phone_number"
                defaultValue={profile.phone_number || ''}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="years_of_experience" className="block text-sm font-medium text-slate-700">Years of Experience</label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                name="years_of_experience"
                id="years_of_experience"
                min={0}
                max={50}
                defaultValue={profile.years_of_experience ?? 0}
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-2">
          <label htmlFor="summary" className="block text-sm font-medium text-slate-700">Professional Summary</label>
          <textarea
            name="summary"
            id="summary"
            rows={4}
            defaultValue={profile.summary || ''}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Toggles */}
        <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">Open to Remote Work</p>
              <p className="text-xs text-slate-500">Let recruiters know you are open to remote roles.</p>
            </div>
            <input
              type="checkbox"
              name="is_open_to_remote"
              defaultChecked={profile.is_open_to_remote}
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
          </div>

          <hr className="border-slate-200" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">Open to Relocation</p>
              <p className="text-xs text-slate-500">Show readiness to relocate for new job opportunities.</p>
            </div>
            <input
              type="checkbox"
              name="is_open_to_relocation"
              defaultChecked={profile.is_open_to_relocation}
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Resume */}
        {profile.resume_url && (
          <div className="flex items-center justify-between p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-slate-700 font-medium">Uploaded Resume</span>
            </div>
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View File <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {message && (
            <p className={`text-sm ${message.success ? 'text-emerald-600' : 'text-rose-600'}`}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Details'
            )}
          </button>
        </div>
      </form>
    </section>
  );
}