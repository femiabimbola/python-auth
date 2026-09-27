"use client";

import useSWR from "swr";
import {
  Search,
  Bell,
  ChevronDown,
  Moon,
  Sun,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCallback, useRef, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  // States
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Fetch current user data with renamed loading state to avoid collision
  const { data: user, isLoading: isUserLoading, error: userError } = useSWR<UserData>(
    "/api/users/me",
    queryFetcher
  );

  // Keyboard shortcut (⌘K or Ctrl+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onLogout = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoggingOut(true);
    setApiError(null);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        credentials: "include",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage =
          typeof data.detail === "string"
            ? data.detail
            : data.message || "Failed to sign out. Please try again.";
        throw new Error(errorMessage);
      }

      router.push("/login");
      router.refresh();
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
      setIsLoggingOut(false);
    }
  }, [router]);

  // Dynamic breadcrumb example based on current URL path
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    ...pathSegments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " "),
      href: `/${pathSegments.slice(0, index + 1).join("/")}`,
    })),
  ];

  return (
    <header
      className="flex items-center justify-between h-15 px-6 border-b bg-white shrink-0"
      style={{ borderColor: "var(--mist)" }}
    >
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href || i} className="flex items-center gap-2">
            {i > 0 && <span style={{ color: "var(--mid)" }}>/</span>}
            <span
              className={
                i === breadcrumbs.length - 1 ? "font-semibold" : "font-normal"
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
      <div className="flex-1 max-w-sm mx-8 relative hidden sm:block">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
          style={{ color: "var(--mid)" }}
        />
        <Input
          ref={searchInputRef}
          placeholder="Search anything…"
          className="pl-9 pr-12 h-8 text-sm border-0 rounded-lg focus-visible:ring-1"
          style={
            {
              background: "var(--lavender)",
              color: "var(--ink)",
              "--tw-ring-color": "var(--violet)",
            } as React.CSSProperties
          }
        />
        <kbd
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded border font-mono flex items-center"
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
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-(--lavender)"
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
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-(--lavender)"
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
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-(--lavender) transition-colors outline-none">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 uppercase"
                style={{
                  background:
                    "linear-gradient(135deg, var(--violet), var(--indigo))",
                }}
              >
                {isUserLoading || !user ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`
                )}
              </div>
              <span
                className="text-sm font-medium hidden sm:block truncate max-w-30"
                style={{ color: "var(--ink)" }}
              >
                {isUserLoading || !user ? (
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
            {!isUserLoading && user && (
              <div
                className="px-2 py-1.5 text-xs border-b mb-1"
                style={{ borderColor: "var(--mist)" }}
              >
                <p className="font-semibold capitalize truncate text-slate-800">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-slate-500 capitalize truncate">
                  {user.role?.replace("_", " ")}
                </p>
              </div>
            )}
            <DropdownMenuItem style={{ color: "var(--ink)" }}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem style={{ color: "var(--ink)" }}>
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isLoggingOut}
              onSelect={(e) => {
                e.preventDefault();
                onLogout();
              }}
              style={{ color: "oklch(0.577 0.245 27.325)" }}
            >
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}