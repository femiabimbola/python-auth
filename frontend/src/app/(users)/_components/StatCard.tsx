import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
  accent?: string;
}

export default function StatCard({
  label,
  value,
  change,
  positive,
  icon: Icon,
  accent = "var(--violet)",
}: StatCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-5 border flex flex-col gap-4 hover:shadow-sm transition-shadow"
      style={{ borderColor: "var(--mist)" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: "var(--mid)" }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}18` }}
        >
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold tracking-tight" style={{ color: "var(--ink)" }}>
          {value}
        </p>
        <div className="flex items-center gap-1 mt-1">
          {positive ? (
            <TrendingUp className="w-3 h-3" style={{ color: "var(--sage)" }} />
          ) : (
            <TrendingDown className="w-3 h-3" style={{ color: "oklch(0.577 0.245 27.325)" }} />
          )}
          <span
            className="text-xs font-medium"
            style={{
              color: positive ? "var(--sage)" : "oklch(0.577 0.245 27.325)",
            }}
          >
            {change}
          </span>
          <span className="text-xs" style={{ color: "var(--mid)" }}>
            vs last month
          </span>
        </div>
      </div>
    </div>
  );
}
