"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShoppingBag,
  Settings,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    badge: "New",
  },
  {
    label: "Customers",
    href: "/customers",
    icon: Users,
    badge: "4",
  },
  {
    label: "Products",
    href: "/products",
    icon: ShoppingBag,
  },
];

const bottomNavItems = [
  { label: "Notifications", href: "/notifications", icon: Bell, badge: "3" },
  { label: "Help", href: "/help", icon: HelpCircle },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen border-r transition-all duration-300 ease-in-out bg-white",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
      style={{ borderColor: "var(--mist)" }}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-5 border-b",
          collapsed && "justify-center px-2"
        )}
        style={{ borderColor: "var(--mist)" }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
          style={{ background: "var(--violet)" }}
        >
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span
            className="font-semibold text-base tracking-tight"
            style={{ color: "var(--indigo)" }}
          >
            Lumina
          </span>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p
            className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2"
            style={{ color: "var(--mid)" }}
          >
            Main
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                collapsed && "justify-center px-2",
                isActive
                  ? "text-white"
                  : "hover:text-[var(--violet)]"
              )}
              style={
                isActive
                  ? { background: "var(--violet)", color: "white" }
                  : { color: "var(--mid)" }
              }
            >
              <Icon
                className={cn("w-4 h-4 shrink-0", isActive && "text-white")}
              />
              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <Badge
                  className="text-[10px] px-1.5 py-0 h-4"
                  style={
                    isActive
                      ? { background: "rgba(255,255,255,0.25)", color: "white", border: "none" }
                      : { background: "var(--lavender)", color: "var(--violet)", border: "none" }
                  }
                >
                  {item.badge}
                </Badge>
              )}
              {/* Tooltip when collapsed */}
              {collapsed && (
                <div
                  className="absolute left-full ml-2 px-2 py-1 text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                  style={{
                    background: "var(--indigo)",
                    color: "white",
                  }}
                >
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="py-3">
          <div className="border-t" style={{ borderColor: "var(--mist)" }} />
        </div>

        {!collapsed && (
          <p
            className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2"
            style={{ color: "var(--mid)" }}
          >
            System
          </p>
        )}
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                collapsed && "justify-center px-2",
                isActive ? "text-white" : "hover:text-[var(--violet)]"
              )}
              style={
                isActive
                  ? { background: "var(--violet)", color: "white" }
                  : { color: "var(--mid)" }
              }
            >
              <div className="relative">
                <Icon className="w-4 h-4 shrink-0" />
                {item.badge && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                    style={{ background: "var(--violet)" }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {collapsed && (
                <div
                  className="absolute left-full ml-2 px-2 py-1 text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                  style={{ background: "var(--indigo)", color: "white" }}
                >
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Avatar Block */}
      {!collapsed && (
        <div
          className="flex items-center gap-3 px-4 py-4 border-t"
          style={{ borderColor: "var(--mist)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, var(--violet), var(--indigo))" }}
          >
            AO
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "var(--ink)" }}>
              Ade Okafor
            </p>
            <p className="text-xs truncate" style={{ color: "var(--mid)" }}>
              Admin
            </p>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full border flex items-center justify-center bg-white shadow-sm hover:shadow-md transition-shadow z-10"
        style={{ borderColor: "var(--mist)" }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" style={{ color: "var(--violet)" }} />
        ) : (
          <ChevronLeft className="w-3 h-3" style={{ color: "var(--violet)" }} />
        )}
      </button>
    </aside>
  );
}
