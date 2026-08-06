"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import * as z from "zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// ─── Validation Schema ─────────────────────────────────────────────
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password must be less than 128 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ValidationErrorDetail {
  loc: [string, string];
  msg: string;
}

interface ApiErrorResponse {
  detail?: string | ValidationErrorDetail[];
  message?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ─── Main Page Component (wrapped in Suspense for useSearchParams) ───
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

// ─── Inner Form Component ────────────────────────────────────────────
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // ─── No Token State ────────────────────────────────────────────────
  if (!token) {
    return (
      <Card className="w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xl border border-zinc-200/80 dark:border-zinc-800/80">
        <CardContent className="pt-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Invalid Link
            </CardTitle>
            <CardDescription className="text-sm max-w-sm mx-auto">
              This password reset link is invalid or has expired. Please request a new one.
            </CardDescription>
          </div>
          <div className="pt-4">
            <Link
              href="/forgot-password"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 gap-2"
            >
              <ArrowLeft size={16} />
              Request new reset link
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ─── Submit Handler ────────────────────────────────────────────────
  const onSubmit = useCallback(
    async (values: ResetPasswordFormValues) => {
      if (!API_URL) {
        setApiError("Server configuration error. Please contact support.");
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setApiError(null);

      try {
        const response = await fetch(`${API_URL}/api/auth/password-reset/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            new_password: values.password,
          }),
          signal: controller.signal,
        });

        const data: ApiErrorResponse = await response
          .json()
          .catch(() => ({} as ApiErrorResponse));

        if (!response.ok) {
          if (response.status === 422 && Array.isArray(data.detail)) {
            data.detail.forEach((err) => {
              const fieldName = err.loc[1] as keyof ResetPasswordFormValues;
              if (fieldName) {
                form.setError(fieldName, {
                  type: "server",
                  message: err.msg.replace(/^Value error,\s*/i, ""),
                });
              }
            });
            return;
          }

          const errorMessage =
            typeof data.detail === "string"
              ? data.detail
              : data.message || "Something went wrong. Please try again.";
          throw new Error(errorMessage);
        }

        setIsSubmitted(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        const message =
          error instanceof Error
            ? error.message
            : "Failed to connect to the server.";
        setApiError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [form, token]
  );

  // ─── Success State ───────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <Card className="w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xl border border-zinc-200/80 dark:border-zinc-800/80">
        <CardContent className="pt-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Password Reset
            </CardTitle>
            <CardDescription className="text-sm max-w-sm mx-auto">
              Your password has been reset successfully. You can now sign in with your new password.
            </CardDescription>
          </div>
          <div className="pt-4">
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 gap-2"
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ─── Reset Form State ──────────────────────────────────────────────
  return (
    <Card className="w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xl border border-zinc-200/80 dark:border-zinc-800/80">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Reset Password
        </CardTitle>
        <CardDescription>
          Enter your new password below.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {apiError && (
          <div
            role="alert"
            className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800"
          >
            {apiError}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            {/* New Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Enter new password"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Confirm Password Field */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Confirm new password"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reset Password
            </Button>
          </div>

          <p className="text-center py-4 text-sm text-zinc-500 dark:text-zinc-400">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}