// frontend/src/app/(dashboard)/settings/useSettings.ts

'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { queryFetcher } from '@/lib/query-fetcher';
import { ApiError } from '@/lib/api-error';
import { UserData } from './types';

export function useSettings() {
  const router = useRouter();

  return useSWR<UserData>(
    '/api/users/me', queryFetcher<UserData>,
    {
      onError: (err) => {
        if (err instanceof ApiError && err.status === 401) {
          router.replace('/login');
        }
      },
    }
  );
}