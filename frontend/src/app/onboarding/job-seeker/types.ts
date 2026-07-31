export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
  FREELANCE = "FREELANCE",
}

export enum WorkplaceType {
  ONSITE = "ONSITE",
  HYBRID = "HYBRID",
  REMOTE = "REMOTE",
}

export enum SalaryCurrency {
  NGN = "NGN",
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
}

export interface JobSeekerProfile {
  // Contact & identity
  phone_number: string;
  country: string;
  state: string;
  city: string;
  
  // Professional info
  headline: string;
  summary: string;
  years_of_experience: number | null;
  
  // Work preferences
  preferred_job_type: JobType | null;
  preferred_workplace_type: WorkplaceType | null;
  preferred_salary_min: number | null;
  preferred_salary_max: number | null;
  preferred_salary_currency: SalaryCurrency;
  is_open_to_remote: boolean;
  is_open_to_relocation: boolean;
  
  // Profile media
  resume_url: string;
  profile_image_url: string;
  
  // Visibility
  is_profile_public: boolean;
}


export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  avatar_url?: string | null;
  created_at?: string;
  two_factor_enabled?: boolean;
}

export type GetUserResult =
| { success: true; data: UserData }
| { success: false; error: 'unauthorized' | 'network' | 'parse' | 'unknown'; message: string };