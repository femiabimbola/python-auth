"use client";

import * as React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// 1. Zod schema for matching your explicit JSON structure
const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    first_name: z.string().min(2, "First name must be at least 2 characters."),
    last_name: z.string().min(2, "Last name must be at least 2 characters."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol."),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // 2. Setup the form with the Zod resolver
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
  });

// 3. Post request handler
async function onSubmit(values: RegisterFormValues) {
  setIsLoading(true);
  setApiError(null);

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${apiUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
        confirm_password : values.confirm_password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // 1. If it's a validation error, map errors directly to the inputs 
      if (response.status === 422 && data.detail && Array.isArray(data.detail)) {
        data.detail.forEach((err: any) => {
          const fieldName = err.loc[1] as keyof RegisterFormValues;
          if (fieldName) {
            form.setError(fieldName, {
              type: "server",
              message: err.msg.replace(/^Value error,\s*/i, "")
            });
          }
        });
        return; // Stop execution here so it doesn't fall through to the global error catcher
      }

      // 2. Fallback fallback for non-422 errors (e.g., 400 Bad Request, 500 Server Error)
      let errorMessage =  data.detail || data.message || "Something went wrong during registration.";
      throw new Error(errorMessage);
    }
    
    setIsSuccess(true);
    form.reset();
  } catch (error: any) {
    // This catches your thrown Error or general network connection failures
    setApiError(error.message || "Failed to connect to the server.");
  } finally {
    setIsLoading(false);
  }
}

  return (
    <Card className="w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-xl border border-zinc-200/80 dark:border-zinc-800/80">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSuccess && (
          <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
            Registration successful! You can now log in.
          </div>
        )}

        {apiError && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
            {apiError}
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* First & Last Name row */}
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="first_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="John"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="last_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Doe"
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

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
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading}
                      aria-invalid={fieldState.invalid}
                      className="pr-10" /* Prevents text trailing under the visibility toggle icon */
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
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

            {/* Confirm Password Field */}
            <Controller
              name="confirm_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    disabled={isLoading}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" className="w-full !mt-6" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register Account
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
