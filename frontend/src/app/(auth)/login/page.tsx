"use client";

import * as React from "react";
import { useCallback, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import * as z from "zod";
import { useRouter } from "next/navigation";

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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginSuccessResponse {
  access_token: string;
  refresh_token: string;
}

interface ValidationErrorDetail {
  loc: [string, string];
  msg: string;
}

interface ApiErrorResponse {
  detail?: string | ValidationErrorDetail[];
  message?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    async (values: LoginFormValues) => {
      if (!API_URL) {
        setApiError("Server configuration error. Please contact support.");
        return;
      }

      // Abort any previous ongoing requests
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setApiError(null);

      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          signal: controller.signal,
        });

        // Safe JSON parsing fallback to prevent crashes on non-JSON server errors
        const data: LoginSuccessResponse & ApiErrorResponse = await response
          .json()
          .catch(() => ({} as LoginSuccessResponse & ApiErrorResponse));

        if (!response.ok) {
          if (response.status === 422 && Array.isArray(data.detail)) {
            data.detail.forEach((err) => {
              const fieldName = err.loc[1] as keyof LoginFormValues;
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
              : data.message || "Invalid email or password.";
          throw new Error(errorMessage);
        }

        // Storing tokens securely
        sessionStorage.setItem("access_token", data.access_token);
        sessionStorage.setItem("refresh_token", data.refresh_token);

        router.push("/dashboard");
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
    [form, router]
  );

  return (
    <Card className="w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xl border border-zinc-200/80 dark:border-zinc-800/80">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription>
          Enter your credentials to sign in to your account
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
            
            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <a 
                      href="/forgot-password"
                      className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </div>

          <p className="text-center py-4 text-sm text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{" "}
            <a 
              href="/register"
              className="text-blue-600 font-medium hover:underline dark:text-blue-400"
            >
              Register here
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}