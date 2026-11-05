"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiPackage,
  FiRefreshCw,
  FiArrowUp,
  FiArrowDown,
  FiPieChart,
  FiBarChart2,
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTruck,
  FiTarget,
  FiAlertTriangle,
} from "react-icons/fi";
import { useGetDashboardStatsQuery } from "@/redux/api/dashboardApi";
import { useGetTrackingLogsQuery } from "@/redux/api/marketingApi";

// Stat Card Component
const StatCard = ({
  title,
  value,
  change,
  subtext,
  icon: Icon,
  color,
  bgColor,
}: {
  title: string;
  value: string;
  change?: number;
  subtext?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
}) => {
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</p>
          <p className="text-2xl lg:text-3xl font-extrabold text-gray-900 mt-2">{value}</p>
          {change !== undefined ? (
            <div
              className={`flex items-center gap-1 mt-2.5 text-xs font-semibold ${
                isPositive ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {isPositive ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
              <span>{Math.abs(change)}%</span>
              <span className="text-gray-400 font-normal ml-1">vs previous period</span>
            </div>
          ) : (
            <p className="text-xs text-gray-400 mt-2.5">{subtext}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgColor}`}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [range, setRange] = useState<"today" | "7days" | "30days" | "year">("7days");
  const { data: statsResponse, isLoading, refetch } = useGetDashboardStatsQuery(range);
  const { data: logsResponse, isLoading: isLoadingLogs, refetch: refetchLogs } = useGetTrackingLogsQuery(8);

  const stats = statsResponse?.data;
  const overview = stats?.overview;
  const alerts = stats?.alerts;
  const revenueChart = stats?.revenueChart || [];
  const statusBreakdown = stats?.orderStatus || {};
  const topProducts = stats?.topProducts || [];
  const topCategories = stats?.topCategories || [];

  const maxRevenue = Math.max(
    ...revenueChart.map((item: any) => Number(item.revenue) || 0),
    1
  );

  const averageOrderValue =
    overview && overview.orders?.total > 0
      ? Math.round(overview.revenue?.total / overview.orders?.total)
      : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">E-Commerce & Marketing Analytics</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Live Database
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Real-time business performance, conversion rates, and server-side tracking health
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="year">This Year</option>
          </select>

          <button
            onClick={() => {
              refetch();
              refetchLogs();
            }}
            disabled={isLoading}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition disabled:opacity-50"
          >
            <FiRefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>

          <Link
            href="/dashboard/admin/marketing"
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <FiTarget size={15} />
            Pixels & CAPI
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Gross Revenue"
          value={`৳${(overview?.revenue?.total ?? 0).toLocaleString()}`}
          change={overview?.revenue?.change}
          icon={FiDollarSign}
          color="text-[#2563EB]"
          bgColor="bg-emerald-50"
        />
        <StatCard
          title="Total Orders"
          value={(overview?.orders?.total ?? 0).toLocaleString()}
          change={overview?.orders?.change}
          icon={FiShoppingCart}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Average Order Value (AOV)"
          value={`৳${averageOrderValue.toLocaleString()}`}
          subtext="Revenue per order in this period"
          icon={FiActivity}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
        <StatCard
          title="Delivery Success Rate"
          value={`${alerts?.successRate ?? 0}%`}
          subtext={`${alerts?.deliveredOrders ?? 0} delivered vs ${alerts?.cancelledOrders ?? 0} cancelled`}
          icon={FiCheckCircle}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
      </div>

      {/* Secondary Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <FiClock size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Pending Orders</p>
            <p className="text-lg font-bold text-gray-800">{alerts?.pendingOrders ?? 0}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <FiAlertTriangle size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Low Stock Products</p>
            <p className="text-lg font-bold text-gray-800">{alerts?.lowStockProducts ?? 0}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <FiTruck size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Active Riders</p>
            <p className="text-lg font-bold text-gray-800">{alerts?.onlineRiders ?? 0}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FiUsers size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Customers</p>
            <p className="text-lg font-bold text-gray-800">{(overview?.customers?.total ?? 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Breakdown Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Revenue & Order Trend</h2>
              <p className="text-xs text-gray-500">Sales volume across the selected timeframe</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-gray-600">
                <span className="w-3 h-3 rounded-full bg-[#2563EB]" />
                Daily Sales (৳)
              </span>
            </div>
          </div>

          {revenueChart.length > 0 ? (
            <div className="h-72 flex items-end justify-between gap-2 pt-6">
              {revenueChart.map((item: any) => {
                const heightPercent = Math.max((Number(item.revenue) / maxRevenue) * 200, 12);
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex items-end justify-center">
                      <div
                        className="w-full max-w-[40px] bg-gradient-to-t from-[#2563EB] to-[#60A5FA] rounded-t-lg transition-all duration-300 group-hover:from-[#1D4ED8] group-hover:to-[#2563EB]"
                        style={{ height: `${heightPercent}px` }}
                      >
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg pointer-events-none">
                          <p>৳{Number(item.revenue).toLocaleString()}</p>
                          <p className="text-[10px] text-gray-300 font-normal">{item.orders} orders</p>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono truncate max-w-[48px]">
                      {item.date?.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-sm">
              <FiBarChart2 size={36} className="text-gray-300 mb-2" />
              <p>No revenue data recorded for this time frame yet.</p>
            </div>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Order Fulfillment Status</h2>
              <p className="text-xs text-gray-500">Distribution of monthly orders</p>
            </div>
            <FiPieChart size={20} className="text-gray-400" />
          </div>

          <div className="space-y-3.5 mt-6">
            {[
              { key: "delivered", label: "Delivered", color: "bg-emerald-500", text: "text-emerald-700" },
              { key: "processing", label: "Processing", color: "bg-blue-500", text: "text-blue-700" },
              { key: "shipped", label: "Shipped", color: "bg-indigo-500", text: "text-indigo-700" },
              { key: "pending", label: "Pending", color: "bg-amber-500", text: "text-amber-700" },
              { key: "cancelled", label: "Cancelled", color: "bg-rose-500", text: "text-rose-700" },
              { key: "returned", label: "Returned", color: "bg-gray-400", text: "text-gray-700" },
            ].map(({ key, label, color, text }) => {
              const count = statusBreakdown[key]?.count ?? 0;
              const percent = statusBreakdown[key]?.percent ?? 0;

              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-700 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                      {label}
                    </span>
                    <span className="text-gray-500">
                      {count} <span className="text-gray-400 font-normal">({percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Products and Top Categories Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Top Selling Products</h2>
              <p className="text-xs text-gray-500">Highest volume items sold in selected period</p>
            </div>
            <FiPackage size={20} className="text-gray-400" />
          </div>

          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((product: any, idx: number) => (
                <div key={product._id || idx} className="flex items-center gap-4 p-2 rounded-xl hover:bg-gray-50 transition">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-gray-400">#{idx + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{product.productName || "Unnamed Product"}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {product.totalSold} sold • <span className="font-semibold text-[#2563EB]">৳{Number(product.totalRevenue).toLocaleString()}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold bg-gray-100 text-gray-700 rounded-lg">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm">
              No product sales data available for this range.
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Top Categories by Revenue</h2>
              <p className="text-xs text-gray-500">Best performing grocery categories</p>
            </div>
            <FiPieChart size={20} className="text-gray-400" />
          </div>

          {topCategories.length > 0 ? (
            <div className="space-y-4">
              {topCategories.map((cat: any, idx: number) => (
                <div key={cat._id || idx} className="p-3 bg-gray-50/70 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-800 font-bold">{cat.categoryName || "Category"}</span>
                    <span className="text-[#2563EB] font-bold">৳{Number(cat.totalRevenue).toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-gray-500">{cat.totalSold} items ordered</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm">
              No category sales data recorded in this period.
            </div>
          )}
        </div>
      </div>

      {/* Tracking Audit Trail & Ad Conversions Health */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
              <FiTarget />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Conversions API (CAPI) & Ad Tracking Health</h3>
              <p className="text-xs text-gray-500">
                Server-side audit log verifying purchases and pageviews sent to Meta, GA4, and TikTok
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/admin/marketing"
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
          >
            Manage Pixels & Tokens &rarr;
          </Link>
        </div>

        {logsResponse?.data && logsResponse.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-4 rounded-l-lg">Event</th>
                  <th className="py-2.5 px-4">Identifier / Order</th>
                  <th className="py-2.5 px-4">Meta CAPI</th>
                  <th className="py-2.5 px-4">GA4</th>
                  <th className="py-2.5 px-4">TikTok</th>
                  <th className="py-2.5 px-4 rounded-r-lg">Dispatched At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logsResponse.data.slice(0, 6).map((log: any) => {
                  const metaRes = log.providers?.find((p: any) => p.provider === "facebook");
                  const ga4Res = log.providers?.find((p: any) => p.provider === "ga4");
                  const ttRes = log.providers?.find((p: any) => p.provider === "tiktok");

                  return (
                    <tr key={log._id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-bold text-gray-800">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                          {log.eventName}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-500">
                        {log.orderId ? `Order #${log.orderId.slice(-6)}` : log.userIdentifier || "Visitor"}
                      </td>
                      <td className="py-3 px-4">
                        {metaRes ? (
                          metaRes.success ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <FiCheckCircle size={13} /> Active
                            </span>
                          ) : (
                            <span className="text-rose-500 font-semibold flex items-center gap-1" title={metaRes.error}>
                              <FiXCircle size={13} /> Error
                            </span>
                          )
                        ) : (
                          <span className="text-gray-300">Off</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {ga4Res ? (
                          ga4Res.success ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <FiCheckCircle size={13} /> Active
                            </span>
                          ) : (
                            <span className="text-rose-500 font-semibold flex items-center gap-1" title={ga4Res.error}>
                              <FiXCircle size={13} /> Error
                            </span>
                          )
                        ) : (
                          <span className="text-gray-300">Off</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {ttRes ? (
                          ttRes.success ? (
                            <span className="text-emerald-600 font-semibold flex items-center gap-1">
                              <FiCheckCircle size={13} /> Active
                            </span>
                          ) : (
                            <span className="text-rose-500 font-semibold flex items-center gap-1" title={ttRes.error}>
                              <FiXCircle size={13} /> Error
                            </span>
                          )
                        ) : (
                          <span className="text-gray-300">Off</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-400 font-mono">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-6">
            No tracking logs yet. Configure your IDs in the Marketing settings to begin tracking.
          </p>
        )}
      </div>
    </div>
  );
}
