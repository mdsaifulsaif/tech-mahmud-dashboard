"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiShoppingBag,
  FiUsers,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiPackage,
  FiArrowRight,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiCreditCard,
  FiActivity,
  FiSliders,
  FiLayers,
  FiShield,
  FiEye,
} from "react-icons/fi";
import { useGetDashboardStatsQuery } from "@/redux/api/dashboardApi";

// ===== TypeScript Interfaces =====
interface DashboardData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    changes: {
      revenue: number;
      orders: number;
      products: number;
      customers: number;
    };
  };
  alerts: {
    pendingOrders: number;
    lowStockProducts: number;
    successRate: number;
  };
  revenueChart: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  orderStatus: {
    pending: { count: number; percent: number };
    confirmed: { count: number; percent: number };
    processing: { count: number; percent: number };
    shipped: { count: number; percent: number };
    out_for_delivery: { count: number; percent: number };
    delivered: { count: number; percent: number };
    cancelled: { count: number; percent: number };
    returned: { count: number; percent: number };
  };
  totalOrdersThisMonth: number;
  recentOrders: Array<{
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    amount: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    _id: string;
    productName: string;
    thumbnail: string;
    totalSold: number;
    totalRevenue: number;
  }>;
  topCategories: Array<{
    _id: string;
    categoryName: string;
    totalSold: number;
    totalRevenue: number;
  }>;
}

const ORDER_STATUS_META: Record<
  string,
  { label: string; bgClass: string; textClass: string; borderClass: string }
> = {
  pending: {
    label: "Pending",
    bgClass: "bg-slate-100",
    textClass: "text-slate-800",
    borderClass: "border-slate-300",
  },
  confirmed: {
    label: "Confirmed",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
    borderClass: "border-blue-200",
  },
  processing: {
    label: "Processing",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
    borderClass: "border-blue-300",
  },
  shipped: {
    label: "Shipped",
    bgClass: "bg-slate-800",
    textClass: "text-white",
    borderClass: "border-slate-900",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    bgClass: "bg-blue-600",
    textClass: "text-white",
    borderClass: "border-blue-700",
  },
  delivered: {
    label: "Delivered",
    bgClass: "bg-blue-50",
    textClass: "text-blue-900 font-bold",
    borderClass: "border-blue-300",
  },
  cancelled: {
    label: "Cancelled",
    bgClass: "bg-slate-100",
    textClass: "text-slate-500",
    borderClass: "border-slate-200",
  },
  returned: {
    label: "Returned",
    bgClass: "bg-slate-100",
    textClass: "text-slate-600",
    borderClass: "border-slate-300",
  },
};

const AdminDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState("7days");

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetDashboardStatsQuery(dateRange, {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const dashboardData = response?.data as DashboardData | undefined;
  const isDataLoading = isLoading || isFetching;

  // Format currency in BDT
  const formatBDT = (amount: number) => {
    return `৳${(amount || 0).toLocaleString("en-BD")}`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Safe accessor for order status
  const getStatusCount = (status: string): number => {
    if (!dashboardData?.orderStatus) return 0;
    const entry = (dashboardData.orderStatus as any)?.[status];
    return entry?.count || 0;
  };

  const getStatusPercent = (status: string): number => {
    if (!dashboardData?.orderStatus) return 0;
    const entry = (dashboardData.orderStatus as any)?.[status];
    return entry?.percent || 0;
  };

  // Chart coordinate calculations
  const chartData = dashboardData?.revenueChart || [];
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1000);
  const chartHeight = 160;
  const chartWidth = 500;

  const points = chartData.map((item, idx) => {
    const x =
      chartData.length > 1
        ? (idx / (chartData.length - 1)) * (chartWidth - 40) + 20
        : chartWidth / 2;
    const y = chartHeight - (item.revenue / maxRevenue) * (chartHeight - 30) - 15;
    return { x, y, ...item };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = points.length
    ? `${points[0].x},${chartHeight} ${polylinePoints} ${
        points[points.length - 1].x
      },${chartHeight}`
    : "";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ===== 1. HERO COMMAND HEADER ===== */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle high-tech background pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Tech Mahmud E-Commerce Operations
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Command Center & Analytics
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Live telemetry for Gadgets, Apparel, Inventory matrix, Courier dispatches, and Sales revenue.
            </p>
          </div>

          {/* Date Filter & Control Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              {[
                { id: "today", label: "Today" },
                { id: "7days", label: "7 Days" },
                { id: "30days", label: "30 Days" },
                { id: "year", label: "This Year" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setDateRange(pill.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    dateRange === pill.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh Telemetry"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            </button>

            <Link
              href="/dashboard/admin/products/new"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              + Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* ===== 2. PRIMARY 4 BENTO METRICS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Gross Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FiDollarSign size={20} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-blue-600 tracking-tight">
              {isDataLoading ? "..." : formatBDT(dashboardData?.summary?.totalRevenue || 0)}
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="inline-flex items-center text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                <FiTrendingUp size={12} className="mr-1" />
                {dashboardData?.summary?.changes?.revenue || 0}%
              </span>
              <span className="text-xs text-slate-500">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FiShoppingCart size={20} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isDataLoading
                ? "..."
                : (dashboardData?.summary?.totalOrders || 0).toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-600">
                {dashboardData?.alerts?.pendingOrders || 0} orders pending dispatch
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Active Catalog Products */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Catalog Items
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FiShoppingBag size={20} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isDataLoading
                ? "..."
                : (dashboardData?.summary?.totalProducts || 0).toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-600">
                {dashboardData?.alerts?.lowStockProducts || 0} low stock items
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Total Customers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Registered Buyers
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FiUsers size={20} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isDataLoading
                ? "..."
                : (dashboardData?.summary?.totalCustomers || 0).toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-600">
                Success rate: {dashboardData?.alerts?.successRate || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 3. CORE ANALYTICS: SALES TREND + ORDER FUNNEL ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Revenue Velocity Curve (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Revenue & Sales Trajectory
              </h2>
              <p className="text-xs text-slate-500">
                Daily earnings visualization for the selected time window
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Revenue Curve
              </span>
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="w-full pt-4">
            {chartData.length > 0 ? (
              <div className="relative">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-44 overflow-visible"
                >
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line
                    x1="0"
                    y1="20"
                    x2={chartWidth}
                    y2="20"
                    stroke="#E2E8F0"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="0"
                    y1={chartHeight / 2}
                    x2={chartWidth}
                    y2={chartHeight / 2}
                    stroke="#E2E8F0"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="0"
                    y1={chartHeight - 1}
                    x2={chartWidth}
                    y2={chartHeight - 1}
                    stroke="#CBD5E1"
                  />

                  {/* Shaded Area */}
                  {areaPoints && (
                    <polygon points={areaPoints} fill="url(#blueGradient)" />
                  )}

                  {/* Line */}
                  <polyline
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polylinePoints}
                  />

                  {/* Points */}
                  {points.map((p, idx) => (
                    <g key={idx} className="group">
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="#2563EB"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="hover:r-6 transition-all cursor-pointer"
                      />
                    </g>
                  ))}
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-3 px-2 border-t border-slate-100">
                  {points.map((p, idx) => {
                    // Only show 5 evenly spaced labels to prevent crowd
                    if (
                      idx === 0 ||
                      idx === points.length - 1 ||
                      idx === Math.floor(points.length / 2)
                    ) {
                      return <span key={idx}>{formatDate(p.date)}</span>;
                    }
                    return null;
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No revenue records captured for this interval.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Journey Breakdown (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              Fulfillment Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Status distribution across active orders
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              "pending",
              "confirmed",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
            ].map((st) => {
              const meta = ORDER_STATUS_META[st] || ORDER_STATUS_META.pending;
              const count = getStatusCount(st);
              const percent = getStatusPercent(st);

              return (
                <div key={st} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 capitalize">
                      {meta.label}
                    </span>
                    <span className="font-bold text-slate-900">
                      {count} <span className="font-normal text-slate-400">({percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        st === "delivered"
                          ? "bg-blue-600"
                          : st === "pending"
                          ? "bg-slate-400"
                          : "bg-blue-400"
                      }`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard/admin/orders"
              className="w-full block text-center py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
            >
              Open Full Order Management →
            </Link>
          </div>
        </div>
      </div>

      {/* ===== 4. STREAMING DATA: RECENT ORDERS & TOP PRODUCTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Customer Orders (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Order Feed
              </h2>
              <p className="text-xs text-slate-500">
                Latest customer purchases processed through the system
              </p>
            </div>
            <Link
              href="/dashboard/admin/orders"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dashboardData?.recentOrders && dashboardData.recentOrders.length > 0 ? (
                  dashboardData.recentOrders.map((ord, idx) => {
                    const meta =
                      ORDER_STATUS_META[ord.status] || ORDER_STATUS_META.pending;

                    return (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 font-mono font-bold text-blue-600">
                          #{ord.orderNumber}
                        </td>
                        <td className="py-3 font-medium text-slate-800">
                          {ord.customerName}
                        </td>
                        <td className="py-3 font-bold text-slate-900">
                          {formatBDT(ord.amount)}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${meta.bgClass} ${meta.textClass} ${meta.borderClass}`}
                          >
                            {meta.label}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href="/dashboard/admin/orders"
                            className="p-1 hover:text-blue-600 text-slate-400 inline-block"
                          >
                            <FiEye size={14} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No customer orders available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Top Selling Products (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Top Products
              </h2>
              <p className="text-xs text-slate-500">
                Best performing Gadgets & Apparel
              </p>
            </div>
            <Link
              href="/dashboard/admin/products"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Catalog
            </Link>
          </div>

          <div className="space-y-3">
            {dashboardData?.topProducts && dashboardData.topProducts.length > 0 ? (
              dashboardData.topProducts.slice(0, 5).map((prod, idx) => (
                <div
                  key={prod._id || idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800 text-xs line-clamp-1 max-w-[170px]">
                        {prod.productName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {prod.totalSold || 0} units sold
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-blue-600 text-xs">
                    {formatBDT(prod.totalRevenue || 0)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                Top selling products will populate once orders are completed.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== 5. QUICK OPERATIONS LAUNCHPAD ===== */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Operations Quick Dock
            </h2>
            <p className="text-xs text-slate-500">
              Instant shortcuts to essential admin modules
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              title: "Products",
              href: "/dashboard/admin/products",
              icon: FiShoppingBag,
              desc: "Manage Catalog",
            },
            {
              title: "Orders",
              href: "/dashboard/admin/orders",
              icon: FiShoppingCart,
              desc: "Courier & Tracking",
            },
            {
              title: "Categories",
              href: "/dashboard/admin/categories",
              icon: FiLayers,
              desc: "Niches & Groups",
            },
            {
              title: "Marketing",
              href: "/dashboard/admin/marketing",
              icon: FiActivity,
              desc: "Meta CAPI & TikTok",
            },
            {
              title: "Customers",
              href: "/dashboard/admin/customers",
              icon: FiUsers,
              desc: "Buyer Accounts",
            },
            {
              title: "Settings",
              href: "/dashboard/admin/settings",
              icon: FiSliders,
              desc: "Store Configuration",
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="p-4 rounded-xl border border-slate-200/80 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-center flex flex-col items-center gap-2 group bg-slate-50/50"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-blue-600 group-hover:border-blue-300 transition-colors shadow-2xs">
                <item.icon size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </p>
                <p className="text-[10px] text-slate-400">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
