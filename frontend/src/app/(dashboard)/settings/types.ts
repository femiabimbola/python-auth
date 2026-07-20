// frontend/src/app/%28dashboard%29/settings/types.ts

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