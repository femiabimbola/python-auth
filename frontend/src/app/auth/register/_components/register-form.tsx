"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Loader2,
} from "lucide-react";
import useSWRMutation from "swr/mutation";
import * as z from "zod";
import Link from "next/link";

type AccountType = "employer" | "job_seeker";

const registerSchema = z
  .object({
    first_name: z.string().min(2, "First name must be at least 2 characters."),
    last_name: z.string().min(2, "Last name must be at least 2 characters."),
    email: z.email("Please enter a valid email address."),
    account_type: z
      .string()
      .refine(
        (v) => v === "employer" || v === "job_seeker",
        "Please select an account type.",
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol."),
    confirm_password: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// 2. SWR Mutation Fetcher
async function registerFetcher(
  url: string, { arg }: { arg: RegisterFormValues },
) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: arg.first_name,
      last_name: arg.last_name,
      email: arg.email,
      password: arg.password,
      account_type: arg.account_type,
      confirm_password: arg.confirm_password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const err = new Error(data.detail || "Registration failed");
    (err as any).status = response.status;
    (err as any).data = data;
    throw err;
  }
  return data;
}

export function RegisterForm() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const registerUrl = `${apiUrl}/api/auth/register`;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      account_type: "",
      password: "",
      confirm_password: "",
    },
  });

  const { trigger, isMutating } = useSWRMutation(registerUrl, registerFetcher);

  async function onSubmit(values: RegisterFormValues) {
    console.log(values);
    setApiError(null);

    try {
      await trigger(values);
      router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (err: any) {
      const status = err.status;
      const data = err.data;

      if (status === 422 && data?.detail && Array.isArray(data.detail)) {
        // Safe list of fields we actually have in our form
        const validFields: (keyof RegisterFormValues)[] = [
          "first_name",
          "last_name",
          "email",
          "account_type",
          "password",
          "confirm_password",
        ];

        data.detail.forEach((detailErr: any) => {
          const fieldName = detailErr.loc[1] as string;

          // Only set error if it's a field we control in the frontend form
          if (validFields.includes(fieldName as keyof RegisterFormValues)) {
            form.setError(fieldName as keyof RegisterFormValues, {
              type: "server",
              message: detailErr.msg.replace(/^Value error,\s*/i, ""),
            });
          } else {
            // This will help you debug if the backend is asking for a field you aren't sending
            console.warn(
              `Backend validation error for unknown field: "${fieldName}" - ${detailErr.msg}`,
            );
          }
        });
      } else {
        setApiError(
          data?.detail || err.message || "Failed to connect to the server.",
        );
      }
    }
  }

  return (
    <div className="flex h-full flex-col justify-center bg-white p-8 md:p-12 lg:p-16">
      <div className="flex justify-end text-sm text-gray-600">
        <span>Already have an account? </span>
        <Link
          href="/auth/login"
          className="ml-1 flex items-center font-semibold text-[#0056FF] hover:underline"
        >
          Log In
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>

      <div className="mt-10 mb-6">
        <h2 className="text-4xl font-bold text-gray-900">Create Account</h2>
        <p className="mt-2 text-gray-500">
          Join Hire Naija and take the next step
        </p>
      </div>

      {apiError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {apiError}
        </div>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="first_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1.5">
                <label htmlFor={field.name}
                  className="text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    {...field}
                    id={field.name}
                    type="text"
                    placeholder="Enter first name"
                    disabled={isMutating}
                    aria-invalid={fieldState.invalid}
                    className={`w-full rounded-lg border py-3 pl-10 pr-4 text-gray-900 outline-none transition-colors focus:ring-1 ${
                      fieldState.invalid
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#0056FF] focus:ring-[#0056FF]"
                    }`}
                  />
                </div>
                {fieldState.invalid && (
                  <p className="text-xs text-red-500">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="last_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={field.name}
                  className="text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    {...field}
                    id={field.name}
                    type="text"
                    placeholder="Enter last name"
                    disabled={isMutating}
                    aria-invalid={fieldState.invalid}
                    className={`w-full rounded-lg border py-3 pl-10 pr-4 text-gray-900 outline-none transition-colors focus:ring-1 ${
                      fieldState.invalid
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-[#0056FF] focus:ring-[#0056FF]"
                    }`}
                  />
                </div>
                {fieldState.invalid && (
                  <p className="text-xs text-red-500">
                    {fieldState.error?.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Email Field */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="Enter your email address"
                  disabled={isMutating}
                  aria-invalid={fieldState.invalid}
                  className={`w-full rounded-lg border py-3 pl-10 pr-4 text-gray-900 outline-none transition-colors focus:ring-1 ${
                    fieldState.invalid
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-[#0056FF] focus:ring-[#0056FF]"
                  }`}
                />
              </div>
              {fieldState.invalid && (
                <p className="text-xs text-red-500">
                  {fieldState.error?.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Account Type Dropdown */}
        <Controller
          name="account_type"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-gray-700"
              >
                I am...
              </label>
              <div className="relative">
                <select
                  {...field}
                  id={field.name}
                  disabled={isMutating}
                  aria-invalid={fieldState.invalid}
                  className={`w-full appearance-none rounded-lg border bg-white py-3 pl-4 pr-10 text-gray-900 outline-none transition-colors focus:ring-1 ${
                    fieldState.invalid
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-[#0056FF] focus:ring-[#0056FF]"
                  }`}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="employer">I am an employer</option>
                  <option value="job_seeker">
                    I am looking for opportunities
                  </option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
              {fieldState.invalid && (
                <p className="text-xs text-red-500">
                  {fieldState.error?.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Password Field */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  {...field}
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  disabled={isMutating}
                  aria-invalid={fieldState.invalid}
                  className={`w-full rounded-lg border py-3 pl-10 pr-10 text-gray-900 outline-none transition-colors focus:ring-1 ${
                    fieldState.invalid
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-[#0056FF] focus:ring-[#0056FF]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {fieldState.invalid && (
                <p className="text-xs text-red-500">
                  {fieldState.error?.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Confirm Password Field */}
        <Controller
          name="confirm_password"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  {...field}
                  id={field.name}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  disabled={isMutating}
                  aria-invalid={fieldState.invalid}
                  className={`w-full rounded-lg border py-3 pl-10 pr-10 text-gray-900 outline-none transition-colors focus:ring-1 ${
                    fieldState.invalid
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-[#0056FF] focus:ring-[#0056FF]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {fieldState.invalid && (
                <p className="text-xs text-red-500">
                  {fieldState.error?.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Register Button */}
        <button
          type="submit"
          disabled={isMutating}
          className="mt-2 flex w-full items-center justify-center rounded-lg bg-[#0056FF] py-3.5 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isMutating && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {isMutating ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* Divider & Social Buttons (unchanged for brevity, keep your existing ones here) */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">or</span>
        </div>
      </div>
      {/* ... Keep your Google/LinkedIn buttons and Terms footer here ... */}
    </div>
  );
}
