"use client";

import * as React from "react";
import { useCallback, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import * as z from "zod";
import Link from "next/link";

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

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ValidationErrorDetail {
  loc: [string, string];
  msg: string;
}

interface ApiErrorResponse {
  detail?: string | ValidationErrorDetail[];
  message?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = useCallback(
    async (values: ForgotPasswordFormValues) => {
      if (!API_URL) {
        setApiError("Server configuration error. Please contact support.");
        return;
      }

      // Abort any ongoing request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setApiError(null);

      try {
        const response = await fetch(`${API_URL}/api/auth/password-reset/request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          signal: controller.signal,
        });

        const data: ApiErrorResponse = await response
          .json()
          .catch(() => ({} as ApiErrorResponse));

        if (!response.ok) {
          if (response.status === 422 && Array.isArray(data.detail)) {
            data.detail.forEach((err) => {
              const fieldName = err.loc[1] as keyof ForgotPasswordFormValues;
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

        // Successfully requested password reset
        setIsSubmitted(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        const message =error instanceof Error ? error.message
            : "Failed to connect to the server.";
        setApiError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [form]
  );



  // Success State Template
  if (isSubmitted) {
    return (
      <Card className="w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xl border border-zinc-200/80 dark:border-zinc-800/80">
        <CardContent className="pt-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Check your email
            </CardTitle>
            <CardDescription className="text-sm max-w-sm mx-auto">
              If an account with {" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100 break-all">
                {form.getValues("email")}
              </span>
              {" "} exists, we have sent a password reset link. Please check your inbox and spam folder.
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

  // Active Request Form State Template
  return (
    <Card className="w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xl border border-zinc-200/80 dark:border-zinc-800/80">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Forgot password?
        </CardTitle>
        <CardDescription>
          No worries! Enter your email below and we will send you instructions to reset it.
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

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
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