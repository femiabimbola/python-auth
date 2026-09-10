"use client";

import { useState } from "react";
import useSWR from "swr";
import { Search, Bell, ChevronDown, Plus, Moon, Sun, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queryFetcher } from "@/lib/query-fetcher";

interface UserData {
  first_name: string;
  last_name: string;
  role: string;
}

const breadcrumbs = [
  { label: "Dashboard", href: "/" },
  { label: "Overview" },
];

export function Topbar() {
  const [darkMode, setDarkMode] = useState(false);

  // Fetch current user data
  const { data: user, isLoading } = useSWR<UserData>("/api/users/me", queryFetcher);

  return (
    <header
      className="flex items-center justify-between h-[60px] px-6 border-b bg-white shrink-0"
      style={{ borderColor: "var(--mist)" }}
    >
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span style={{ color: "var(--mid)" }}>/</span>
            )}
            <span
              className={
                i === breadcrumbs.length - 1
                  ? "font-semibold"
                  : "font-normal"
              }
              style={
                i === breadcrumbs.length - 1
                  ? { color: "var(--indigo)" }
                  : { color: "var(--mid)" }
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-sm mx-8 relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
          style={{ color: "var(--mid)" }}
        />
        <Input
          placeholder="Search anything…"
          className="pl-9 h-8 text-sm border-0 rounded-lg text-sm focus-visible:ring-1"
          style={{
            background: "var(--lavender)",
            color: "var(--ink)",
            "--tw-ring-color": "var(--violet)",
          } as React.CSSProperties}
        />
        <kbd
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded border font-mono hidden sm:flex items-center"
          style={{
            color: "var(--mid)",
            borderColor: "var(--mist)",
            background: "white",
          }}
        >
          ⌘K
        </kbd>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* New Report Button */}
        <Button
          size="sm"
          className="h-8 text-xs font-medium gap-1.5 hidden md:flex"
          style={{
            background: "var(--violet)",
            color: "white",
            border: "none",
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          New report
        </Button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--lavender)]"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun className="w-4 h-4" style={{ color: "var(--mid)" }} />
          ) : (
            <Moon className="w-4 h-4" style={{ color: "var(--mid)" }} />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--lavender)]"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" style={{ color: "var(--mid)" }} />
          </button>
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full border-2 border-white"
            style={{ background: "var(--violet)" }}
          />
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-[var(--lavender)] transition-colors">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 uppercase"
                style={{
                  background:
                    "linear-gradient(135deg, var(--violet), var(--indigo))",
                }}
              >
                {isLoading || !user ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`
                )}
              </div>
              <span
                className="text-sm font-medium hidden sm:block truncate max-w-[120px]"
                style={{ color: "var(--ink)" }}
              >
                {isLoading || !user ? (
                  <span className="inline-block w-12 h-3.5 bg-slate-200 animate-pulse rounded" />
                ) : (
                  user.first_name
                )}
              </span>
              <ChevronDown
                className="w-3.5 h-3.5"
                style={{ color: "var(--mid)" }}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 text-sm">
            {!isLoading && user && (
              <>
                <div className="px-2 py-1.5 text-xs border-b mb-1" style={{ borderColor: "var(--mist)" }}>
                  <p className="font-semibold capitalize truncate text-slate-800">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-slate-500 capitalize truncate">{user.role?.replace("_", " ")}</p>
                </div>
              </>
            )}
            <DropdownMenuItem style={{ color: "var(--ink)" }}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem style={{ color: "var(--ink)" }}>
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem style={{ color: "var(--ink)" }}>
              Team
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem style={{ color: "oklch(0.577 0.245 27.325)" }}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}