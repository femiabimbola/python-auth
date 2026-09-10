// frontend/src/app/(dashboard)/settings/types.ts

export type UserRole = 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN' | 'SUPERADMIN';

export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole; // Strongly typed role enum matching your Python UserRole enum
  is_verified: boolean;
  is_active: boolean;
  
  // Role helper flags (matching your Python model properties)
  is_job_seeker: boolean;
  is_employer?: boolean;
  is_admin?: boolean;
  is_superadmin?: boolean;

  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
  two_factor_enabled?: boolean;
}


export type GetUserResult =
  | { success: true; data: UserData }
  | { success: false; error: 'unauthorized' | 'network' | 'parse' | 'unknown'; message: string };

  // frontend/src/app/(dashboard)/settings/types.ts

export interface JobSeekerProfileData {
  phone_number?: string;
  country?: string;
  state?: string;
  city?: string;
  headline?: string;
  summary?: string;
  years_of_experience?: number;
  preferred_job_type?: string;
  preferred_workplace_type?: string;
  preferred_salary_min?: number;
  preferred_salary_max?: number;
  preferred_salary_currency?: string;
  is_open_to_remote: boolean;
  is_open_to_relocation: boolean;
  resume_url?: string;
  profile_image_url?: string;
  is_profile_public: boolean;
}