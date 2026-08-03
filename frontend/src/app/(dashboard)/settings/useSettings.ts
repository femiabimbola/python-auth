// frontend/src/app/(dashboard)/settings/useSettings.ts

'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { queryFetcher } from '@/lib/query-fetcher';
import { ApiError } from '@/lib/api-error';
import { UserData, JobSeekerProfileData } from './types';

export function useSettings() {
  const router = useRouter();

  // 1. Fetch current user
  const userSwr = useSWR<UserData>(
    '/api/users/me', 
    queryFetcher<UserData>,
    {
      onError: (err) => {
        if (err instanceof ApiError && err.status === 401) {
          router.replace('/login');
        }
      },
    }
  );

  const user = userSwr.data;

  // 2. Fetch job seeker profile ONLY if the user is a job seeker
  // Passing `null` as key disables SWR execution when false or when user isn't loaded yet
  const profileKey = user?.is_job_seeker ? '/api/users/job-seeker/profile' : null;

  const profileSwr = useSWR<JobSeekerProfileData>(
    profileKey, queryFetcher<JobSeekerProfileData>,
    {
      shouldRetryOnError: false, // Don't retry if 404 (profile doesn't exist yet)
    }
  );

  const isProfileNotFound = profileSwr.error instanceof ApiError && profileSwr.error.status === 404;

  return {
    // User state
    user,
    isUserLoading: userSwr.isLoading,
    userError: userSwr.error,
    mutateUser: userSwr.mutate,

    // Job Seeker Profile state
    profile: profileSwr.data,
    isProfileLoading: profileSwr.isLoading,
    isProfileNotFound,
    profileError: isProfileNotFound ? null : profileSwr.error,
    mutateProfile: profileSwr.mutate,

    // Convenience combined loading / error states
    isLoading: userSwr.isLoading,
    error: userSwr.error,
  };
}