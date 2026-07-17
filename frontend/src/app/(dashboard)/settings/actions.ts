// frontend/src/app/(dashboard)/settings/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { fetchApi } from '@/lib/fetch-api';

export async function updateProfile(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;

  try {
    await fetchApi('/api/users/me', {
      method: 'PATCH',
      // Note: If your fetchApi automatically stringifies objects, you can just pass the raw object here.
      body: JSON.stringify({ first_name: firstName, last_name: lastName }),
    });

    revalidatePath('/settings');
    return { success: true, message: 'Profile updated successfully' };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Update failed' };
  }
}

export async function updatePassword(formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  try {
    await fetchApi('/api/auth/password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });

    return { success: true, message: 'Password updated successfully' };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Update failed' };
  }
}

export async function updateNotifications(formData: FormData) {
  const payload = {
    email_marketing: formData.has('email_marketing'),
    email_security: formData.has('email_security'),
    email_updates: formData.has('email_updates'),
    push_enabled: formData.has('push_enabled'),
  };

  try {
    await fetchApi('/api/users/me/notifications', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    revalidatePath('/settings');
    return { success: true, message: 'Preferences saved' };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Update failed' };
  }
}

export async function deleteAccount() {
  try {
    await fetchApi('/api/users/me', {
      method: 'DELETE',
    });

    // Clear cookies and redirect handled by middleware or client
    return { success: true };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Deletion failed' };
  }
}