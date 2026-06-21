"use client";

import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react";
import StatCard from "../_components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 32000, target: 30000 },
  { month: "Feb", revenue: 28000, target: 32000 },
  { month: "Mar", revenue: 41000, target: 35000 },
  { month: "Apr", revenue: 38000, target: 38000 },
  { month: "May", revenue: 52000, target: 40000 },
  { month: "Jun", revenue: 49000, target: 45000 },
  { month: "Jul", revenue: 61000, target: 48000 },
];

const categoryData = [
  { name: "Design", sales: 420 },
  { name: "Dev", sales: 630 },
  { name: "Marketing", sales: 275 },
  { name: "Analytics", sales: 510 },
  { name: "Support", sales: 190 },
];

const recentOrders = [
  {
    id: "#10231",
    customer: "Nkechi Adeyemi",
    product: "Pro Plan – Annual",
    amount: "₦ 180,000",
    status: "Completed",
  },
  {
    id: "#10230",
    customer: "Emeka Obi",
    product: "Starter Plan",
    amount: "₦ 42,000",
    status: "Pending",
  },
  {
    id: "#10229",
    customer: "Fatima Al-Hassan",
    product: "Pro Plan – Monthly",
    amount: "₦ 18,500",
    status: "Completed",
  },
  {
    id: "#10228",
    customer: "David Mensah",
    product: "Enterprise",
    amount: "₦ 540,000",
    status: "Processing",
  },
  {
    id: "#10227",
    customer: "Amaka Eze",
    product: "Starter Plan",
    amount: "₦ 42,000",
    status: "Cancelled",
  },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  Completed: { bg: "#A8D5BA22", text: "var(--sage)" },
  Pending: { bg: "#F0EEFF", text: "var(--violet)" },
  Processing: { bg: "#FFF4E5", text: "#E08C00" },
  Cancelled: { bg: "#FEE2E2", text: "#DC2626" },
};

const stats = [
  {
    label: "Total Revenue",
    value: "₦ 2.41M",
    change: "+12.4%",
    positive: true,
    icon: DollarSign,
    accent: "var(--violet)",
  },
  {
    label: "Active Users",
    value: "8,342",
    change: "+5.1%",
    positive: true,
    icon: Users,
    accent: "#3B82F6",
  },
  {
    label: "New Orders",
    value: "1,209",
    change: "-2.3%",
    positive: false,
    icon: ShoppingCart,
    accent: "var(--sage)",
  },
  {
    label: "Growth Rate",
    value: "24.7%",
    change: "+3.8%",
    positive: true,
    icon: TrendingUp,
    accent: "#F59E0B",
  },
];

export default function DashboardPage() {
  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-6"
      style={{ background: "var(--pearl)" }}
    >
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--indigo)" }}>
            Good morning, Ade 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--mid)" }}>
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="text-sm px-3 py-1.5 rounded-lg border bg-white focus:outline-none focus:ring-1"
            style={
              {
                borderColor: "var(--mist)",
                color: "var(--ink)",
                "--tw-ring-color": "var(--violet)",
              } as React.CSSProperties
            }
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart - spans 2 cols */}
        <div
          className="xl:col-span-2 bg-white rounded-2xl p-5 border"
          style={{ borderColor: "var(--mist)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2
                className="font-semibold text-sm"
                style={{ color: "var(--ink)" }}
              >
                Revenue Overview
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--mid)" }}>
                Revenue vs. target this year
              </p>
            </div>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--lavender)]">
              <MoreHorizontal
                className="w-4 h-4"
                style={{ color: "var(--mid)" }}
              />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={revenueData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--violet)"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--violet)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--mist)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "var(--mid)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--mid)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--indigo)",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "white" }}
                labelStyle={{ color: "var(--violet-lt)", fontWeight: 600 }}
                formatter={(v: number) => [`₦${(v / 1000).toFixed(1)}k`]}
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="var(--mist)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="none"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--violet)"
                strokeWidth={2}
                fill="url(#revGrad)"
                dot={{ r: 3, fill: "var(--violet)", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "var(--violet)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-2">
            <div className="flex items-center gap-1.5">
              <span
                className="w-3 h-0.5 rounded"
                style={{ background: "var(--violet)", display: "block" }}
              />
              <span className="text-xs" style={{ color: "var(--mid)" }}>
                Revenue
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-3 h-0.5 rounded border-t border-dashed"
                style={{ borderColor: "var(--mid)", display: "block" }}
              />
              <span className="text-xs" style={{ color: "var(--mid)" }}>
                Target
              </span>
            </div>
          </div>
        </div>

        {/* Sales by Category */}
        <div
          className="bg-white rounded-2xl p-5 border"
          style={{ borderColor: "var(--mist)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2
                className="font-semibold text-sm"
                style={{ color: "var(--ink)" }}
              >
                Sales by Category
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--mid)" }}>
                Units sold this quarter
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={categoryData}
              margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              barSize={18}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--mist)"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "var(--mid)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--mid)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--indigo)",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "12px",
                }}
                cursor={{ fill: "var(--lavender)" }}
              />
              <Bar dataKey="sales" fill="var(--violet)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div
        className="bg-white rounded-2xl border overflow-hidden"
        style={{ borderColor: "var(--mist)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--mist)" }}
        >
          <div>
            <h2
              className="font-semibold text-sm"
              style={{ color: "var(--ink)" }}
            >
              Recent Orders
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--mid)" }}>
              Latest 5 transactions
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1 h-7"
            style={{ color: "var(--violet)" }}
          >
            View all
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--pearl)" }}>
                {["Order ID", "Customer", "Product", "Amount", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--mid)" }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-[var(--pearl)] transition-colors"
                  style={{ borderColor: "var(--mist)" }}
                >
                  <td
                    className="px-5 py-3.5 font-mono text-xs"
                    style={{ color: "var(--mid)" }}
                  >
                    {order.id}
                  </td>
                  <td
                    className="px-5 py-3.5 font-medium"
                    style={{ color: "var(--ink)" }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                        style={{
                          background: `hsl(${(i * 67 + 230) % 360}, 60%, 55%)`,
                        }}
                      >
                        {order.customer
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      {order.customer}
                    </div>
                  </td>
                  <td className="px-5 py-3.5" style={{ color: "var(--mid)" }}>
                    {order.product}
                  </td>
                  <td
                    className="px-5 py-3.5 font-semibold"
                    style={{ color: "var(--ink)" }}
                  >
                    {order.amount}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: statusColors[order.status]?.bg,
                        color: statusColors[order.status]?.text,
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
