"use client";

import * as React from "react";
import { useCallback, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// Define the validation schema for the 6-digit OTP
const verifySchema = z.object({
  otp: z.string().length(6, "Your verification code must be exactly 6 digits."),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function VerifyEmailPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = useCallback(
    async (values: VerifyFormValues) => {
      // Abort any previous ongoing requests
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setApiError(null);

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
          signal: controller.signal,
          credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const errorMessage =
            data.message || data.detail || "Invalid verification code.";
          throw new Error(errorMessage);
        }

        // On success, redirect the user to the dashboard or login page
        router.push("/applicant/dashboard");
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
    [router],
  );

  const handleResendOTP = useCallback(async () => {
    // Logic to resend the OTP
    console.log("Resending OTP...");
    // Add your fetch logic here for resending the OTP
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xl border border-zinc-200/80 dark:border-zinc-800/80">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Verify your email
        </CardTitle>
        <CardDescription>
          We&apos;ve sent a 6-digit verification code to your email address. Please enter it below.
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
          <div className="space-y-6">
            <Controller
              name="otp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <FieldLabel htmlFor={field.name} className="sr-only">
                      One-Time Password
                    </FieldLabel>
                    
                    {/* Shadcn Input OTP Component - 6 Digits */}
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Email
            </Button>
          </div>

          <p className="text-center mt-6 text-sm text-zinc-500 dark:text-zinc-400">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOTP}
              className="text-blue-600 font-medium hover:underline dark:text-blue-400 focus:outline-none"
            >
              Click to resend
            </button>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}