// frontend/src/app/(dashboard)/settings/components/profile-section.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Briefcase,
  Phone,
  Clock,
  FileText,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { UserData, JobSeekerProfileData } from '../types';
import { useSettingsMutations } from '../useSettingsMutations';

interface ProfileSectionProps {
  user: UserData;
  jobSeekerProfile?: JobSeekerProfileData;
  isJobSeekerLoading?: boolean;
  isJobSeekerNotFound?: boolean;
}

interface FormState {
  success: boolean;
  message: string;
}

export function ProfileSection({
  user,
  jobSeekerProfile,
  isJobSeekerLoading = false,
  isJobSeekerNotFound = false,
}: ProfileSectionProps) {
  const { updateProfile, isUpdatingProfile } = useSettingsMutations();
  const [state, setState] = useState<FormState | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result) {
      setState(result);
    }
  };

  return (
    <section
      id="profile"
      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden scroll-mt-6"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Profile Information</h2>
            <p className="text-sm text-slate-500">Manage your account identity and professional details.</p>
          </div>
        </div>

        {/* Role Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize border border-slate-200/60">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          {user.role.toLowerCase().replace('_', ' ')}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* --- SECTION 1: Personal Identification --- */}
        <div className="space-y-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                defaultValue={user.first_name}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:border-slate-400"
                placeholder="Enter your first name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                defaultValue={user.last_name}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:border-slate-400"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                id="email"
                value={user.email}
                disabled
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-slate-400" />
              Email changes are restricted. Contact support to update your account email address.
            </p>
          </div>
        </div>

        {/* --- SECTION 2: Professional / Job Seeker Profile (If Applicable) --- */}
        {user.is_job_seeker && (
          <>
            <hr className="border-slate-100" />

            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Professional Bio & Preferences
                </h3>
              </div>

              {isJobSeekerLoading ? (
                <div className="flex items-center gap-3 text-slate-500 py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <p className="text-sm">Loading job seeker profile...</p>
                </div>
              ) : isJobSeekerNotFound || !jobSeekerProfile ? (
                <div className="bg-slate-50 rounded-xl p-6 text-center border border-dashed border-slate-200">
                  <p className="text-sm text-slate-600 mb-4">
                    You haven&apos;t set up your job seeker profile yet.
                  </p>
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Create Profile
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="headline" className="block text-sm font-medium text-slate-700">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      name="headline"
                      id="headline"
                      defaultValue={jobSeekerProfile.headline || ''}
                      placeholder="e.g. Senior Full Stack Engineer | React & Node.js"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:border-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="city" className="block text-sm font-medium text-slate-700">City</label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        defaultValue={jobSeekerProfile.city || ''}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="state" className="block text-sm font-medium text-slate-700">State</label>
                      <input
                        type="text"
                        name="state"
                        id="state"
                        defaultValue={jobSeekerProfile.state || ''}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="country" className="block text-sm font-medium text-slate-700">Country</label>
                      <input
                        type="text"
                        name="country"
                        id="country"
                        defaultValue={jobSeekerProfile.country || ''}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="phone_number" className="block text-sm font-medium text-slate-700">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="phone_number"
                          id="phone_number"
                          defaultValue={jobSeekerProfile.phone_number || ''}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="years_of_experience" className="block text-sm font-medium text-slate-700">
                        Years of Experience
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="number"
                          name="years_of_experience"
                          id="years_of_experience"
                          min={0}
                          max={50}
                          defaultValue={jobSeekerProfile.years_of_experience ?? 0}
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="summary" className="block text-sm font-medium text-slate-700">
                      Professional Summary
                    </label>
                    <textarea
                      name="summary"
                      id="summary"
                      rows={4}
                      defaultValue={jobSeekerProfile.summary || ''}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-800">Open to Remote Work</p>
                        <p className="text-xs text-slate-500">Signal recruiters that you accept remote roles.</p>
                      </div>
                      <input
                        type="checkbox"
                        name="is_open_to_remote"
                        defaultChecked={jobSeekerProfile.is_open_to_remote}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <hr className="border-slate-200" />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-800">Open to Relocation</p>
                        <p className="text-xs text-slate-500">Signal readiness to relocate for opportunities.</p>
                      </div>
                      <input
                        type="checkbox"
                        name="is_open_to_relocation"
                        defaultChecked={jobSeekerProfile.is_open_to_relocation}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {jobSeekerProfile.resume_url && (
                    <div className="flex items-center justify-between p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-slate-700 font-medium">Uploaded Resume</span>
                      </div>
                      <a
                        href={jobSeekerProfile.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        View File <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          {state && (
            <p className={`text-sm ${state.success ? 'text-emerald-600' : 'text-rose-600'}`}>
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            {isUpdatingProfile ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </section>
  );
}