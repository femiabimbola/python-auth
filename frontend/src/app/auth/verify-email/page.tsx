"use client";

import * as React from "react";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Loader2,
  MailCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const RESEND_COOLDOWN_SECONDS = 30;

const verifySchema = z.object({
  otp: z
    .string()
    .regex(/^\d{6}$/, "Enter the 6-digit code we sent to your email."),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

type ApiErrorPayload = {
  detail?: string | { msg?: string }[];
  message?: string;
};

function extractErrorMessage(data: unknown): string {
  const fallback = "That code didn't work. Please check it and try again.";
  if (!data || typeof data !== "object") return fallback;

  const { detail, message } = data as ApiErrorPayload;

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    const joined = detail
      .map((item) => (typeof item?.msg === "string" ? item.msg : ""))
      .filter(Boolean)
      .join(", ");
    if (joined) return joined;
  }

  if (typeof message === "string" && message) return message;
  return fallback;
}

function otpSlotClassName(invalid: boolean) {
  return [
    "h-14 w-11 rounded-xl border bg-white text-lg font-semibold text-[#161616] shadow-sm transition-all duration-150 sm:w-12",
    "first:rounded-xl last:rounded-xl",
    "data-[active=true]:ring-4",
    invalid
      ? "border-[#DA1E28] data-[active=true]:border-[#DA1E28] data-[active=true]:ring-[#DA1E28]/15"
      : "border-[#DDE1E6] data-[active=true]:border-[#0F62FE] data-[active=true]:ring-[#0F62FE]/15",
  ].join(" ");
}

/* ---------------------------------------------------------------------- */
/* Inner component — needs Suspense because of useSearchParams            */
/* ---------------------------------------------------------------------- */
function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const abortRef = useRef<AbortController | null>(null);

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { otp: "" },
  });

  /* Abort any in-flight request when the page unmounts */
  useEffect(() => () => abortRef.current?.abort(), []);

  /* Resend countdown */
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  const onSubmit = useCallback(
    async (values: VerifyFormValues) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setApiError(null);

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, email }),
          signal: controller.signal,
          credentials: "include",
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(extractErrorMessage(data));
        }

        router.push("/applicant/auth/login");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setApiError(
          error instanceof Error
            ? error.message
            : "Failed to connect to the server. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [router, email],
  );

  const handleResendOTP = useCallback(async () => {
    if (cooldown > 0 || isResending) return;

    if (!email) {
      setApiError("We couldn't identify your account. Please register again.");
      return;
    }

    setApiError(null);
    setIsResending(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Server already tells us how long to wait (429) — surface that message
        throw new Error(
          extractErrorMessage(data) ||
            "We couldn't send a new code. Please try again.",
        );
      }

      // Only start the cooldown after the server accepted the request
      setCooldown(RESEND_COOLDOWN_SECONDS);
      form.setValue("otp", ""); // optional: clear stale digits for the new code
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  }, [cooldown, isResending, email, form]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#F4F6F8] antialiased">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-40 -top-40 h-128 w-lg rounded-full bg-[#0F62FE]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-128 w-lg rounded-full bg-[#00A3A6]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(22,22,22,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(22,22,22,0.045)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_72%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid w-full overflow-hidden rounded-3xl border border-[#E4E7EB] bg-white shadow-[0_30px_70px_-30px_rgba(22,22,22,0.35)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)]">
      
          <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#161616] p-10 lg:flex">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-[#0F62FE]/45 blur-3xl" />
              <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[#00A3A6]/35 blur-3xl" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="relative flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F62FE] shadow-lg shadow-[#0F62FE]/30">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <span className="text-sm font-semibold tracking-wide text-white">
                HireHub
              </span>
            </div>

            <div className="relative my-12 space-y-6">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
                <MailCheck className="h-6 w-6 text-white" />
              </span>

              <h2 className="max-w-xs text-3xl font-semibold leading-[1.15] tracking-tight text-white">
                One quick step to your next opportunity.
              </h2>

              <p className="max-w-sm text-sm leading-relaxed text-white/60">
                We sent a six-digit code to your inbox. Pop it in and we&apos;ll
                take you straight through.
              </p>

              <ul className="space-y-3 pt-2 text-sm text-white/70">
                {[
                  "The code expires 10 minutes after it's sent.",
                  "Check spam or promotions if it hasn't arrived.",
                  "Never share this code with anyone.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#00A3A6]/20 text-[#00A3A6]">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex items-center gap-2 text-xs text-white/40">
              <ShieldCheck className="h-4 w-4 text-[#00A3A6]" />
              Secure, encrypted verification
            </div>
          </aside>

          {/* ---------------------------------------------------------------- */}
          {/* Form panel                                                       */}
          {/* ---------------------------------------------------------------- */}
          <section className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            {/* Compact brand for mobile */}
            <div className="mb-8 flex items-center gap-2.5 lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F62FE]">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <span className="text-sm font-semibold tracking-wide text-[#161616]">
                HireHub
              </span>
            </div>

            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F62FE]/10 text-[#0F62FE] ring-1 ring-[#0F62FE]/15">
              <MailCheck className="h-5 w-5" />
            </span>

            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[#161616] sm:text-3xl">
              Verify your email
            </h1>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[#525252]">
              Enter the 6-digit code we sent to{" "}
              {email ? (
                <span className="font-medium text-[#161616]">{email}</span>
              ) : (
                "your email address"
              )}{" "}
              to confirm it&apos;s really you.
            </p>

            {apiError && (
              <div
                role="alert"
                aria-live="polite"
                className="mt-6 flex items-start gap-2.5 rounded-xl border border-[#DA1E28]/25 bg-[#DA1E28]/5 p-3.5 text-sm text-[#A2191F]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="mt-7 space-y-6"
            >
              <Controller
                name="otp"
                control={form.control}
                render={({ field, fieldState }) => {
                  const invalid = fieldState.invalid;

                  return (
                    <Field data-invalid={invalid}>
                      <FieldLabel htmlFor={field.name} className="sr-only">
                        One-time verification code
                      </FieldLabel>

                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          {...field}
                          onChange={(value) => {
                            field.onChange(value);
                            if (apiError) setApiError(null);
                          }}
                          aria-invalid={invalid}
                        >
                          <InputOTPGroup className="gap-2">
                            {[0, 1, 2].map((index) => (
                              <InputOTPSlot
                                key={index}
                                index={index}
                                className={otpSlotClassName(invalid)}
                              />
                            ))}
                          </InputOTPGroup>

                          <InputOTPSeparator className="text-[#C6CBD1]" />

                          <InputOTPGroup className="gap-2">
                            {[3, 4, 5].map((index) => (
                              <InputOTPSlot
                                key={index}
                                index={index}
                                className={otpSlotClassName(invalid)}
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>

                      {invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="justify-center text-center"
                        />
                      )}
                    </Field>
                  );
                }}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-xl bg-[#0F62FE] text-[15px] font-medium text-white shadow-[0_10px_24px_-10px_rgba(15,98,254,0.85)] transition-colors hover:bg-[#0043CE] focus-visible:ring-2 focus-visible:ring-[#0F62FE] focus-visible:ring-offset-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Verify email"
                )}
              </Button>
            </form>

            <div className="mt-8 flex flex-col items-center gap-3 border-t border-[#E4E7EB] pt-6 text-sm">
              <p className="text-[#525252]">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={cooldown > 0 || isResending}
                  className="font-medium text-[#0F62FE] underline-offset-4 transition-colors hover:text-[#0043CE] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F62FE]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-[#525252] disabled:no-underline"
                >
                  {isResending
                    ? "Sending…"
                    : cooldown > 0
                      ? `Resend in ${cooldown}s`
                      : "Click to resend"}
                </button>
              </p>

              <Link
                href="/applicant/auth/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#525252] transition-colors hover:text-[#161616] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F62FE]/40 focus-visible:ring-offset-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}


export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}