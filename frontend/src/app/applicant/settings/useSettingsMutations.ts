// frontend/src/app/(dashboard)/settings/useSettingsMutations.ts

"use client";

import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { mutationFetcher } from "@/lib/mutation-fetcher";

export function useSettingsMutations() {
  const { mutate } = useSWRConfig();

  const handleError = (err: unknown, defaultMessage: string) => ({
    success: false,
    message: err instanceof Error ? err.message : defaultMessage,
  });

  // 1. Update Profile
  const profileMutation = useSWRMutation("/api/users/me", mutationFetcher);

  const updateProfile = async (formData: FormData) => {
    try {
      await profileMutation.trigger({
        method: "PATCH",
        body: {
          first_name: formData.get("firstName") as string,
          last_name: formData.get("lastName") as string,
        },
      });
      // Revalidate local SWR cache instead of revalidatePath()
      await mutate("/api/users/me");
      return { success: true, message: "Profile updated successfully" };
    } catch (err) {
      return handleError(err, "Update failed");
    }
  };

  // 2. Update Password
  const passwordMutation = useSWRMutation("/api/auth/password", mutationFetcher);

  const updatePassword = async (formData: FormData) => {
    try {
      await passwordMutation.trigger({
        method: "POST",
        body: {
          current_password: formData.get("currentPassword") as string,
          new_password: formData.get("newPassword") as string,
        },
      });
      return { success: true, message: "Password updated successfully" };
    } catch (err) {
      return handleError(err, "Password update failed");
    }
  };

  // 3. Update Notifications
  const notificationMutation = useSWRMutation( "/api/users/me/notifications",
     mutationFetcher,
  );

  const updateNotifications = async (formData: FormData) => {
    try {
      await notificationMutation.trigger({
        method: "PATCH",
        body: {
          email_marketing: formData.has("email_marketing"),
          email_security: formData.has("email_security"),
          email_updates: formData.has("email_updates"),
          push_enabled: formData.has("push_enabled"),
        },
      });
      await mutate("/api/users/me/notifications");
      return { success: true, message: "Preferences saved" };
    } catch (err) {
      return handleError(err, "Failed to save preferences");
    }
  };

  // 4. Delete Account
  const deleteMutation = useSWRMutation("/api/users/me", mutationFetcher);

  const deleteAccount = async () => {
    try {
      await deleteMutation.trigger({ method: "DELETE" });
      return { success: true };
    } catch (err) {
      return handleError(err, "Failed to delete account");
    }
  };

  return {
    updateProfile,
    updatePassword,
    updateNotifications,
    deleteAccount,
    isUpdatingProfile: profileMutation.isMutating,
    isUpdatingPassword: passwordMutation.isMutating,
    isUpdatingNotifications: notificationMutation.isMutating,
    isDeletingAccount: deleteMutation.isMutating,
  };
}
