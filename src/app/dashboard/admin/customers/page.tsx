"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiDownload,
  FiMail,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiCalendar,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiShoppingBag,
  FiDollarSign,
  FiGrid,
  FiList,
  FiCopy,
  FiArrowUpRight,
} from "react-icons/fi";
import {
  useGetCustomersQuery,
  useGetCustomerStatsQuery,
  useToggleCustomerStatusMutation,
  CustomerItem,
} from "@/redux/api/customerApi";
import toast from "react-hot-toast";
import CustomerDetailsModal from "./_components/CustomerDetailsModal";
import CustomerEditModal from "./_components/CustomerEditModal";
import DeleteCustomerModal from "./_components/DeleteCustomerModal";

// Customer Avatar Component with fallback initials
const Avatar = ({ name, avatar }: { name: string; avatar?: string }) => {
  const initials = (name || "Customer")
    .trim()
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2) || "C";

  const colors = [
    "from-emerald-500 to-teal-600",
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
    "from-rose-500 to-red-600",
  ];
  const colorIndex = (name || "C").charCodeAt(0) % colors.length;

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm"
      />
    );
  }

  return (
    <div
      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-sm shadow-sm tracking-wider`}
    >
      {initials}
    </div>
  );
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modal states
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerItem | null>(null);

  // RTK Query Hooks
  const queryParams = useMemo(() => {
    const params: any = {
      page,
      limit,
      sortBy,
      sortOrder,
    };
    if (search.trim()) params.search = search.trim();
    if (statusFilter !== "all") params.status = statusFilter;
    if (verifiedFilter !== "all") params.isVerified = verifiedFilter === "verified";
    return params;
  }, [page, limit, search, statusFilter, verifiedFilter, sortBy, sortOrder]);

  const {
    data: customersResponse,
    isLoading: isCustomersLoading,
    isFetching: isCustomersFetching,
    refetch: refetchCustomers,
  } = useGetCustomersQuery(queryParams);

  const {
    data: statsResponse,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useGetCustomerStatsQuery();

  const [toggleStatus, { isLoading: isToggling }] = useToggleCustomerStatusMutation();

  const customers = customersResponse?.data || [];
  const meta = customersResponse?.meta || { totalPages: 1, total: 0, page: 1, limit: 10 };
  const stats = statsResponse?.data ||
    customersResponse?.stats || {
      totalCustomers: 0,
      totalUsers: 0,
      activeUsers: 0,
      blockedUsers: 0,
      verifiedUsers: 0,
      unverifiedUsers: 0,
      newThisMonth: 0,
    };

  const handleRefresh = () => {
    refetchCustomers();
    refetchStats();
    toast.success("Customer data refreshed");
  };

  const handleQuickStatusToggle = async (customer: CustomerItem) => {
    const newStatus = customer.status === "active" ? "blocked" : "active";
    try {
      await toggleStatus({ id: customer._id, status: newStatus }).unwrap();
      toast.success(`${customer.firstName}'s status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `৳${(amount || 0).toLocaleString("en-BD")}`;
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (customers.length === 0) {
      toast.error("No customers to export");
      return;
    }

    const headers = [
      "Customer ID",
      "Full Name",
      "Email",
      "Phone",
      "Status",
      "Verified",
      "Total Orders",
      "Total Spent (BDT)",
      "City",
      "Joined Date",
    ];

    const rows = customers.map((c) => [
      c._id,
      `"${c.firstName} ${c.lastName}"`,
      c.email,
      c.phoneNumber || c.phone || "N/A",
      c.status,
      c.isVerified ? "Yes" : "No",
      c.totalOrders || 0,
      c.totalSpent || 0,
      `"${c.shippingAddress?.city || c.addresses?.[0]?.city || "N/A"}"`,
      formatDate(c.createdAt),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customers_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Customer list exported to CSV");
  };

  const statCards = [
    {
      label: "Total Customers",
      value: stats.totalCustomers || stats.totalUsers || meta.total,
      subtext: "Registered accounts",
      icon: FiUsers,
      color: "text-blue-600",
      bg: "bg-blue-50/70",
      border: "border-blue-100",
    },
    {
      label: "Active Customers",
      value: stats.activeUsers,
      subtext: `${Math.round(
        ((stats.activeUsers || 0) / (stats.totalCustomers || 1)) * 100
      )}% of total`,
      icon: FiUserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50/70",
      border: "border-emerald-100",
    },
    {
      label: "Blocked Accounts",
      value: stats.blockedUsers,
      subtext: "Restricted access",
      icon: FiUserX,
      color: "text-rose-600",
      bg: "bg-rose-50/70",
      border: "border-rose-100",
    },
    {
      label: "Verified Emails",
      value: stats.verifiedUsers,
      subtext: "Authenticated",
      icon: FiCheckCircle,
      color: "text-indigo-600",
      bg: "bg-indigo-50/70",
      border: "border-indigo-100",
    },
    {
      label: "New This Month",
      value: stats.newThisMonth,
      subtext: "Recent signups",
      icon: FiCalendar,
      color: "text-purple-600",
      bg: "bg-purple-50/70",
      border: "border-purple-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shadow-sm">
              <FiUsers size={24} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                Customer Management
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Monitor customer activity, order history, lifetime value, and access status
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-stretch md:self-auto">
          {/* View mode toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "table"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Table View"
            >
              <FiList size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Grid Cards View"
            >
              <FiGrid size={18} />
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm text-gray-700"
          >
            <FiRefreshCw
              size={16}
              className={isCustomersFetching || isStatsLoading ? "animate-spin text-[#2563EB]" : ""}
            />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm shadow-[#2563EB]/20"
          >
            <FiDownload size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className={`${stat.bg} ${stat.border} border rounded-2xl p-4 lg:p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className={`text-2xl lg:text-3xl font-extrabold ${stat.color} mt-2`}>
                  {isStatsLoading ? "..." : (stat.value || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
              </div>
              <div className={`p-3 rounded-xl bg-white shadow-sm ${stat.color}`}>
                <stat.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, phone number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-all text-sm bg-gray-50/40"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-200/80 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none bg-white text-sm font-medium text-gray-700"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="blocked">Blocked Only</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div className="md:col-span-2">
            <select
              value={verifiedFilter}
              onChange={(e) => {
                setVerifiedFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none bg-white text-sm font-medium text-gray-700"
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified Email</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-3">
            <select
              value={`${sortBy}:${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split(":");
                setSortBy(sb);
                setSortOrder(so as "asc" | "desc");
              }}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none bg-white text-sm font-medium text-gray-700"
            >
              <option value="createdAt:desc">Sort: Newest First</option>
              <option value="createdAt:asc">Sort: Oldest First</option>
              <option value="totalOrders:desc">Sort: Most Orders</option>
              <option value="totalSpent:desc">Sort: Highest Spent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Customers Content */}
      {viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Orders / Spent
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isCustomersLoading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-28 mb-1.5"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-36 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-8 bg-gray-200 rounded w-20 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
                          <FiUsers size={32} />
                        </div>
                        <p className="text-gray-800 font-bold text-lg">No customers found</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Try adjusting your search criteria or clear status filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="hover:bg-gray-50/70 transition-colors group"
                    >
                      {/* Customer Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={`${customer.firstName} ${customer.lastName}`}
                            avatar={customer.avatar}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-gray-900 text-sm group-hover:text-[#2563EB] transition-colors">
                                {customer.firstName} {customer.lastName}
                              </p>
                              {customer.isVerified && (
                                <span title="Verified Email">
                                  <FiCheckCircle size={13} className="text-blue-500 inline" />
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 font-mono uppercase mt-0.5">
                              ID: {customer._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p
                            onClick={() => copyToClipboard(customer.email, "Email")}
                            className="text-xs text-gray-700 flex items-center gap-1.5 hover:text-[#2563EB] cursor-pointer"
                            title="Click to copy email"
                          >
                            <FiMail size={13} className="text-gray-400" />
                            {customer.email}
                          </p>
                          {(customer.phoneNumber || customer.phone) && (
                            <p
                              onClick={() =>
                                copyToClipboard(customer.phoneNumber || customer.phone || "", "Phone")
                              }
                              className="text-xs text-gray-500 flex items-center gap-1.5 hover:text-[#2563EB] cursor-pointer"
                              title="Click to copy phone"
                            >
                              <FiPhone size={13} className="text-gray-400" />
                              {customer.phoneNumber || customer.phone}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-700 flex items-center gap-1.5 font-medium">
                          <FiMapPin size={13} className="text-[#2563EB]" />
                          {customer.shippingAddress?.city ||
                            customer.addresses?.[0]?.city ||
                            customer.shippingAddress?.district ||
                            "Not specified"}
                        </p>
                      </td>

                      {/* Orders / Total Spent */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900">
                            <FiShoppingBag size={13} className="text-blue-500" />
                            {customer.totalOrders || 0} Orders
                          </div>
                          <p className="text-xs font-extrabold text-[#2563EB] mt-0.5">
                            {formatCurrency(customer.totalSpent || 0)}
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleQuickStatusToggle(customer)}
                          disabled={isToggling}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-xs ${
                            customer.status === "active"
                              ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                              : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                          }`}
                          title="Click to toggle status"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              customer.status === "active" ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {customer.status}
                        </button>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-600 flex items-center gap-1.5 font-medium">
                          <FiCalendar size={13} className="text-gray-400" />
                          {formatDate(customer.createdAt)}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedCustomerId(customer._id)}
                            className="p-2 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-[#2563EB] border border-gray-200 hover:border-[#2563EB]/30 rounded-xl transition-all shadow-xs"
                            title="Quick View Profile"
                          >
                            <FiEye size={15} />
                          </button>
                          <Link
                            href={`/dashboard/admin/customers/${customer._id}`}
                            className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-200 rounded-xl transition-all shadow-xs"
                            title="Open Full Customer Page"
                          >
                            <FiArrowUpRight size={15} />
                          </Link>
                          <button
                            onClick={() => setEditingCustomer(customer)}
                            className="p-2 bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-600 border border-gray-200 hover:border-purple-200 rounded-xl transition-all shadow-xs"
                            title="Edit Customer"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeletingCustomer(customer)}
                            className="p-2 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-xl transition-all shadow-xs"
                            title="Delete Customer"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="text-xs text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-800">{customers.length}</span> of{" "}
                <span className="font-bold text-gray-800">{meta.total}</span> customers
              </p>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isCustomersLoading}
                className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all text-gray-700"
              >
                <FiChevronLeft size={16} />
              </button>
              <div className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-xs">
                Page {page} of {meta.totalPages || 1}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages || 1, p + 1))}
                disabled={page >= (meta.totalPages || 1) || isCustomersLoading}
                className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all text-gray-700"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {isCustomersLoading ? (
              [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse space-y-4"
                >
                  <div className="h-12 bg-gray-200 rounded-xl"></div>
                  <div className="h-16 bg-gray-200 rounded-xl"></div>
                  <div className="h-10 bg-gray-200 rounded-xl"></div>
                </div>
              ))
            ) : customers.length === 0 ? (
              <div className="col-span-full bg-white p-16 rounded-2xl text-center border border-gray-100">
                <FiUsers size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-700 font-bold text-lg">No customers found</p>
              </div>
            ) : (
              customers.map((customer) => (
                <div
                  key={customer._id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={`${customer.firstName} ${customer.lastName}`}
                          avatar={customer.avatar}
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <h3 className="font-bold text-gray-900 text-base">
                              {customer.firstName} {customer.lastName}
                            </h3>
                            {customer.isVerified && (
                              <FiCheckCircle size={13} className="text-blue-500" />
                            )}
                          </div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1 ${
                              customer.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {customer.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingCustomer(customer)}
                          className="p-1.5 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-gray-100"
                          title="Edit"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeletingCustomer(customer)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                          title="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Contact & Location */}
                    <div className="space-y-2 text-xs text-gray-600 mb-4 bg-gray-50/70 p-3.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FiMail size={13} className="text-gray-400" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPhone size={13} className="text-gray-400" />
                        <span>{customer.phoneNumber || customer.phone || "No phone"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin size={13} className="text-gray-400" />
                        <span>
                          {customer.shippingAddress?.city ||
                            customer.addresses?.[0]?.city ||
                            "No address"}
                        </span>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-t border-gray-100">
                      <div>
                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                          Orders
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-0.5">
                          {customer.totalOrders || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                          Total Spent
                        </p>
                        <p className="text-lg font-bold text-[#2563EB] mt-0.5">
                          {formatCurrency(customer.totalSpent || 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCustomerId(customer._id)}
                      className="flex-1 py-2 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-[#2563EB] border border-gray-200 hover:border-[#2563EB]/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <FiEye size={14} />
                      View Profile
                    </button>
                    <Link
                      href={`/dashboard/admin/customers/${customer._id}`}
                      className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-200 rounded-xl text-xs transition-all"
                      title="Full Page"
                    >
                      <FiArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Grid Pagination */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">
              Showing page {page} of {meta.totalPages || 1} ({meta.total} customers)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages || 1, p + 1))}
                disabled={page >= (meta.totalPages || 1)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomerId && (
        <CustomerDetailsModal
          customerId={selectedCustomerId}
          onClose={() => setSelectedCustomerId(null)}
          onEdit={(c) => {
            setSelectedCustomerId(null);
            setEditingCustomer(c);
          }}
        />
      )}

      {/* Customer Edit Modal */}
      {editingCustomer && (
        <CustomerEditModal
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSuccess={() => {
            refetchCustomers();
            refetchStats();
          }}
        />
      )}

      {/* Customer Delete Confirmation Modal */}
      {deletingCustomer && (
        <DeleteCustomerModal
          customer={deletingCustomer}
          onClose={() => setDeletingCustomer(null)}
          onSuccess={() => {
            refetchCustomers();
            refetchStats();
          }}
        />
      )}
    </div>
  );
}
