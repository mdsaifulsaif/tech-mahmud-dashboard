"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FiMapPin,
  FiSearch,
  FiRefreshCw,
  FiDownload,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiPhone,
  FiMail,
  FiTrash2,
  FiEdit3,
  FiPlus,
  FiCopy,
  FiList,
  FiGrid,
  FiArrowUpRight,
  FiX,
  FiSave,
} from "react-icons/fi";
import {
  useGetAreaRequestsQuery,
  useGetAreaRequestStatsQuery,
  useUpdateAreaRequestStatusMutation,
  useDeleteAreaRequestMutation,
  AreaRequestItem,
  AreaRequestStatus,
} from "@/redux/api/areaRequestApi";
import toast from "react-hot-toast";

export default function AreaRequestsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Selected for status modal
  const [statusModalItem, setStatusModalItem] = useState<AreaRequestItem | null>(null);
  const [newStatus, setNewStatus] = useState<AreaRequestStatus>("pending");
  const [adminNotes, setAdminNotes] = useState("");

  // Deleting item
  const [deletingItem, setDeletingItem] = useState<AreaRequestItem | null>(null);

  const queryParams = useMemo(() => {
    const params: any = { page, limit };
    if (search.trim()) params.search = search.trim();
    if (statusFilter !== "all") params.status = statusFilter;
    return params;
  }, [page, limit, search, statusFilter]);

  const {
    data: requestsData,
    isLoading,
    isFetching,
    refetch: refetchRequests,
  } = useGetAreaRequestsQuery(queryParams);

  const {
    data: statsData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useGetAreaRequestStatsQuery();

  const [updateStatus, { isLoading: isUpdating }] = useUpdateAreaRequestStatusMutation();
  const [deleteRequest, { isLoading: isDeleting }] = useDeleteAreaRequestMutation();

  const requests = requestsData?.data || [];
  const meta = requestsData?.meta || { total: 0, totalPages: 1, page: 1, limit: 10 };
  const stats = statsData?.data || { total: 0, pending: 0, reviewed: 0, approved: 0, rejected: 0 };

  const handleRefresh = () => {
    refetchRequests();
    refetchStats();
    toast.success("Area requests refreshed");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
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

  const openStatusModal = (item: AreaRequestItem) => {
    setStatusModalItem(item);
    setNewStatus(item.status);
    setAdminNotes(item.adminNotes || "");
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalItem) return;

    try {
      await updateStatus({
        id: statusModalItem._id,
        status: newStatus,
        adminNotes: adminNotes.trim(),
      }).unwrap();

      toast.success("Area request status updated!");
      setStatusModalItem(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteRequest(deletingItem._id).unwrap();
      toast.success("Request deleted successfully");
      setDeletingItem(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete request");
    }
  };

  const handleExportCSV = () => {
    if (requests.length === 0) {
      toast.error("No area requests to export");
      return;
    }

    const headers = [
      "ID",
      "Area Name",
      "Customer Name",
      "Phone",
      "Email",
      "City",
      "Status",
      "Notes",
      "Admin Notes",
      "Date",
    ];

    const rows = requests.map((r) => [
      r._id,
      `"${r.areaName}"`,
      `"${r.name}"`,
      r.phone,
      r.email || "",
      r.city || "Barishal",
      r.status,
      `"${r.notes || ""}"`,
      `"${r.adminNotes || ""}"`,
      formatDate(r.createdAt),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `area_requests_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Area requests exported to CSV");
  };

  const getStatusBadge = (status: AreaRequestStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Review
          </span>
        );
      case "reviewed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Reviewed
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
    }
  };

  const statCards = [
    {
      label: "Total Requests",
      value: stats.total,
      subtext: "All customer submissions",
      icon: FiMapPin,
      color: "text-blue-600",
      bg: "bg-blue-50/70",
      border: "border-blue-100",
    },
    {
      label: "Pending Review",
      value: stats.pending,
      subtext: "Action required",
      icon: FiClock,
      color: "text-amber-600",
      bg: "bg-amber-50/70",
      border: "border-amber-100",
    },
    {
      label: "Reviewed",
      value: stats.reviewed,
      subtext: "Under feasibility check",
      icon: FiEye,
      color: "text-indigo-600",
      bg: "bg-indigo-50/70",
      border: "border-indigo-100",
    },
    {
      label: "Approved",
      value: stats.approved,
      subtext: "Marked for expansion",
      icon: FiCheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50/70",
      border: "border-emerald-100",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      subtext: "Out of scope",
      icon: FiXCircle,
      color: "text-rose-600",
      bg: "bg-rose-50/70",
      border: "border-rose-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shadow-sm">
              <FiMapPin size={24} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                Customer Area Requests
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Review delivery expansion requests submitted by customers from currently uncovered areas
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-stretch md:self-auto">
          <Link
            href="/dashboard/admin/areas"
            className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-all shadow-sm"
          >
            ← View Delivery Areas
          </Link>

          {/* View mode toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "table" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
              title="Table View"
            >
              <FiList size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === "grid" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
              title="Grid View"
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className={`${stat.bg} ${stat.border} border rounded-2xl p-4 lg:p-5 shadow-sm hover:shadow-md transition-all`}
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

      {/* Filters Toolbar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search */}
          <div className="md:col-span-8 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by area name, customer name, phone number, notes..."
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
              <option value="all">All Request Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="reviewed">Reviewed</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Requested Area
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Customer Info
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Customer Notes
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-28 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                      <td className="px-6 py-4 text-right"><div className="h-8 bg-gray-200 rounded w-20 ml-auto"></div></td>
                    </tr>
                  ))
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
                          <FiMapPin size={32} />
                        </div>
                        <p className="text-gray-800 font-bold text-lg">No area requests found</p>
                        <p className="text-gray-400 text-sm mt-1">
                          No customer area requests match your filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  requests.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Area */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2563EB] flex items-center justify-center shadow-xs">
                            <FiMapPin size={18} />
                          </div>
                          <div>
                            <p className="font-extrabold text-gray-900 text-sm">{item.areaName}</p>
                            <p className="text-xs text-gray-400">
                              {item.city || "Barishal"} {item.district ? `, ${item.district}` : ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                            <FiUser size={13} className="text-gray-400" />
                            {item.name}
                          </p>
                          <p
                            onClick={() => copyToClipboard(item.phone, "Phone")}
                            className="text-xs text-gray-600 flex items-center gap-1.5 hover:text-[#2563EB] cursor-pointer"
                            title="Click to copy phone"
                          >
                            <FiPhone size={12} className="text-gray-400" />
                            {item.phone}
                          </p>
                          {item.email && (
                            <p
                              onClick={() => copyToClipboard(item.email || "", "Email")}
                              className="text-xs text-gray-400 flex items-center gap-1.5 hover:text-[#2563EB] cursor-pointer"
                              title="Click to copy email"
                            >
                              <FiMail size={12} className="text-gray-300" />
                              {item.email}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Notes */}
                      <td className="px-6 py-4">
                        {item.notes ? (
                          <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100 max-w-xs line-clamp-2">
                            "{item.notes}"
                          </p>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No notes provided</span>
                        )}
                        {item.adminNotes && (
                          <p className="text-[11px] text-blue-600 mt-1 font-medium">
                            Admin Note: {item.adminNotes}
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">{getStatusBadge(item.status)}</td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-600 font-medium">{formatDate(item.createdAt)}</p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openStatusModal(item)}
                            className="p-2 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-[#2563EB] border border-gray-200 rounded-xl transition-all shadow-xs"
                            title="Update Status & Note"
                          >
                            <FiEdit3 size={15} />
                          </button>

                          <Link
                            href={`/dashboard/admin/areas/new?name=${encodeURIComponent(item.areaName)}`}
                            className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200 rounded-xl transition-all shadow-xs"
                            title="Create Delivery Zone for this Area"
                          >
                            <FiPlus size={15} />
                          </Link>

                          <button
                            onClick={() => setDeletingItem(item)}
                            className="p-2 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 rounded-xl transition-all shadow-xs"
                            title="Delete Request"
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
                Showing <span className="font-bold text-gray-800">{requests.length}</span> of{" "}
                <span className="font-bold text-gray-800">{meta.total}</span> requests
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
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse h-48"></div>
            ))
          ) : requests.length === 0 ? (
            <div className="col-span-full bg-white p-16 text-center rounded-2xl border border-gray-100">
              <p className="text-gray-500 font-bold">No requests found</p>
            </div>
          ) : (
            requests.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-[#2563EB]">
                        <FiMapPin size={18} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-base">{item.areaName}</h3>
                        <p className="text-xs text-gray-400">{item.city || "Barishal"}</p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3.5 rounded-xl mb-3">
                    <p className="font-bold text-gray-800">{item.name}</p>
                    <p className="text-gray-500">Phone: {item.phone}</p>
                    {item.email && <p className="text-gray-400">Email: {item.email}</p>}
                    {item.notes && <p className="text-gray-700 italic pt-1 border-t border-gray-200/50 mt-1">"{item.notes}"</p>}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">{formatDate(item.createdAt)}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openStatusModal(item)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-[#2563EB] rounded-lg text-xs font-semibold"
                    >
                      Update
                    </button>
                    <Link
                      href={`/dashboard/admin/areas/new?name=${encodeURIComponent(item.areaName)}`}
                      className="p-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg text-xs"
                      title="Create Delivery Area"
                    >
                      <FiPlus size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* UPDATE STATUS MODAL */}
      {statusModalItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Update Request Status</h3>
                <p className="text-xs text-gray-500">
                  {statusModalItem.areaName} ({statusModalItem.name})
                </p>
              </div>
              <button
                onClick={() => setStatusModalItem(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Request Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AreaRequestStatus)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none bg-white font-medium"
                >
                  <option value="pending">Pending Review</option>
                  <option value="reviewed">Reviewed (Evaluating coverage)</option>
                  <option value="approved">Approved (Expanding soon)</option>
                  <option value="rejected">Rejected (Not serviceable)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Internal Admin Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. 5 customers requested this area. Planning courier coverage for next month."
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStatusModalItem(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  <FiSave size={16} />
                  {isUpdating ? "Saving..." : "Save Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900">Delete Area Request?</h3>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete the request for{" "}
              <span className="font-bold text-gray-800">{deletingItem.areaName}</span> by{" "}
              <span className="font-bold text-gray-800">{deletingItem.name}</span>?
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
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
