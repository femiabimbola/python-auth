"use client";

import { useState } from "react";
import { ChevronDown, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";

type AccountType = "employer" | "candidate";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState<AccountType | "">("");

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

      {/* Title */}
      <div className="mt-10 mb-6">
        <h2 className="text-4xl font-bold text-gray-900">Create Account</h2>
        <p className="mt-2 text-gray-500">
          Join Hire Naija and take the next step
        </p>
      </div>

      <form className="flex flex-col gap-4">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter first name"
                autoComplete="given-name"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 outline-none transition-colors focus:border-[#0056FF] focus:ring-1 focus:ring-[#0056FF]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter last name"
                autoComplete="family-name"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 outline-none transition-colors focus:border-[#0056FF] focus:ring-1 focus:ring-[#0056FF]"
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 outline-none transition-colors focus:border-[#0056FF] focus:ring-1 focus:ring-[#0056FF]"
            />
          </div>
        </div>

        {/* Account Type Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="accountType"
            className="text-sm font-medium text-gray-700"
          >
            I am...
          </label>
          <div className="relative">
            <select
              id="accountType"
              name="accountType"
              value={accountType}
              onChange={(e) =>
                setAccountType(e.target.value as AccountType | "")
              }
              className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-10 text-gray-900 outline-none transition-colors focus:border-[#0056FF] focus:ring-1 focus:ring-[#0056FF]"
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="employer">I am an employer</option>
              <option value="candidate">
                I am looking for opportunities
              </option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 text-gray-900 outline-none transition-colors focus:border-[#0056FF] focus:ring-1 focus:ring-[#0056FF]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-10 text-gray-900 outline-none transition-colors focus:border-[#0056FF] focus:ring-1 focus:ring-[#0056FF]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="mt-2 w-full rounded-lg bg-[#0056FF] py-3.5 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Create Account
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">or</span>
        </div>
      </div>

      {/* Social Register Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <svg
            className="h-5 w-5 text-[#0A66C2]"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          Continue with LinkedIn
        </button>
      </div>

      {/* Terms */}
      <p className="mt-6 text-center text-xs text-gray-500">
        By continuing, you agree to our{" "}
        <Link href="#" className="text-[#0056FF] hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-[#0056FF] hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}