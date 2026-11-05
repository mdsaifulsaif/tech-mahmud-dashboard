"use client";

import React, { useState, useMemo } from "react";
import {
  FiMail,
  FiSearch,
  FiRefreshCw,
  FiDownload,
  FiCheckCircle,
  FiXCircle,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiSend,
  FiUsers,
  FiAlertCircle,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import {
  useGetSubscribersQuery,
  useGetSubscriberStatsQuery,
  useToggleSubscriberStatusMutation,
  useDeleteSubscriberMutation,
  SubscriberItem,
} from "@/redux/api/subscriberApi";
import toast from "react-hot-toast";

export default function SubscribersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Deleting state
  const [deletingItem, setDeletingItem] = useState<SubscriberItem | null>(null);

  const queryParams = useMemo(() => {
    const params: any = { page, limit };
    if (search.trim()) params.search = search.trim();
    if (statusFilter !== "all") params.status = statusFilter;
    return params;
  }, [page, limit, search, statusFilter]);

  const {
    data: subscribersData,
    isLoading,
    isFetching,
    refetch: refetchSubscribers,
  } = useGetSubscribersQuery(queryParams);

  const {
    data: statsData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useGetSubscriberStatsQuery();

  const [toggleStatus, { isLoading: isToggling }] = useToggleSubscriberStatusMutation();
  const [deleteSubscriber, { isLoading: isDeleting }] = useDeleteSubscriberMutation();

  const subscribers = subscribersData?.data || [];
  const meta = subscribersData?.meta || { total: 0, totalPages: 1, page: 1, limit: 10 };
  const stats = statsData?.data || { total: 0, active: 0, unsubscribed: 0, newThisMonth: 0 };

  const handleRefresh = () => {
    refetchSubscribers();
    refetchStats();
    toast.success("Subscribers list refreshed");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
    toast.success(`${label} copied to clipboard`);
  };

  const handleCopyAllActiveEmails = () => {
    const activeEmails = subscribers
      .filter((s) => s.status === "active")
      .map((s) => s.email)
      .join(", ");

    if (!activeEmails) {
      toast.error("No active subscriber emails to copy");
      return;
    }

    navigator.clipboard.writeText(activeEmails);
    toast.success("All active emails copied for email campaign!");
  };

  const handleToggleStatus = async (item: SubscriberItem) => {
    const newStatus = item.status === "active" ? "unsubscribed" : "active";
    try {
      await toggleStatus({ id: item._id, status: newStatus }).unwrap();
      toast.success(`Subscriber marked as ${newStatus}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update subscriber status");
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteSubscriber(deletingItem._id).unwrap();
      toast.success("Subscriber removed successfully");
      setDeletingItem(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete subscriber");
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      toast.error("No subscribers to export");
      return;
    }

    const headers = ["ID", "Email", "Status", "Subscribed Date"];
    const rows = subscribers.map((s) => [
      s._id,
      `"${s.email}"`,
      s.status,
      formatDate(s.createdAt),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Subscribers exported to CSV");
  };

  const statCards = [
    {
      label: "Total Subscribers",
      value: stats.total,
      subtext: "Newsletter audience",
      icon: FiMail,
      color: "text-blue-600",
      bg: "bg-blue-50/70",
      border: "border-blue-100",
    },
    {
      label: "Active Subscribers",
      value: stats.active,
      subtext: `${Math.round(((stats.active || 0) / (stats.total || 1)) * 100)}% active rate`,
      icon: FiCheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50/70",
      border: "border-emerald-100",
    },
    {
      label: "Unsubscribed",
      value: stats.unsubscribed,
      subtext: "Opted out",
      icon: FiXCircle,
      color: "text-rose-600",
      bg: "bg-rose-50/70",
      border: "border-rose-100",
    },
    {
      label: "New This Month",
      value: stats.newThisMonth,
      subtext: "Audience growth",
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
              <FiMail size={24} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                Newsletter Subscribers
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Manage your email subscriber audience, newsletter reach, and opt-in contacts
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-stretch md:self-auto">
          <button
            onClick={handleCopyAllActiveEmails}
            className="px-4 py-2.5 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-[#2563EB] border border-gray-200 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
            title="Copy all active subscriber emails separated by commas"
          >
            <FiSend size={15} />
            <span>Copy Active Emails</span>
          </button>

          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm text-gray-700"
          >
            <FiRefreshCw
              size={16}
              className={isFetching || isStatsLoading ? "animate-spin text-[#2563EB]" : ""}
            />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <FiDownload size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className={`${stat.bg} ${stat.border} border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
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

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search */}
          <div className="md:col-span-8 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search subscribers by email address..."
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
          <div className="md:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none bg-white text-sm font-medium text-gray-700"
            >
              <option value="all">All Subscribers</option>
              <option value="active">Active Only</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Subscriber
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Subscribed Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-200 rounded-xl"></div>
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-gray-200 rounded w-20 ml-auto"></div></td>
                  </tr>
                ))
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
                        <FiMail size={32} />
                      </div>
                      <p className="text-gray-800 font-bold text-lg">No subscribers found</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Subscribers will appear here once visitors enter their email on the landing page footer or app promo
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscribers.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Subscriber email & initial avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center font-bold text-sm shadow-xs uppercase">
                          {item.email?.[0] || "S"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-sm">{item.email}</span>
                            <button
                              onClick={() => copyToClipboard(item.email, "Email")}
                              className="text-gray-400 hover:text-[#2563EB] transition-colors p-1"
                              title="Copy email"
                            >
                              {copiedEmail === item.email ? (
                                <FiCheck size={14} className="text-emerald-500" />
                              ) : (
                                <FiCopy size={13} />
                              )}
                            </button>
                          </div>
                          <p className="text-[11px] text-gray-400 font-mono uppercase mt-0.5">
                            ID: {item._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        disabled={isToggling}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs ${
                          item.status === "active"
                            ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                            : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "active" ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        {item.status}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-600 font-medium flex items-center gap-1.5">
                        <FiCalendar size={13} className="text-gray-400" />
                        {formatDate(item.createdAt)}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleStatus(item)}
                          disabled={isToggling}
                          className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200 rounded-xl transition-all shadow-xs"
                          title={item.status === "active" ? "Mark Unsubscribed" : "Mark Active"}
                        >
                          {item.status === "active" ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-2 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 rounded-xl transition-all shadow-xs"
                          title="Delete Subscriber"
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

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-800">{subscribers.length}</span> of{" "}
              <span className="font-bold text-gray-800">{meta.total}</span> subscribers
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
              disabled={page === 1 || isLoading}
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all text-gray-700"
            >
              <FiChevronLeft size={16} />
            </button>
            <div className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 shadow-xs">
              Page {page} of {meta.totalPages || 1}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages || 1, p + 1))}
              disabled={page >= (meta.totalPages || 1) || isLoading}
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all text-gray-700"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900">Remove Subscriber?</h3>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to remove <span className="font-bold text-gray-800">{deletingItem.email}</span> from the newsletter subscriber list?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              >
                {isDeleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
