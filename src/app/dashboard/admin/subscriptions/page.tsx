"use client";

import React, { useState, useMemo } from "react";
import {
  FiRepeat,
  FiSearch,
  FiRefreshCw,
  FiDownload,
  FiCheckCircle,
  FiPauseCircle,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiPhone,
  FiMapPin,
  FiClock,
  FiAlertCircle,
  FiMessageSquare,
  FiBox,
  FiDollarSign,
  FiPlus,
  FiX,
} from "react-icons/fi";
import {
  useGetSubscriptionsQuery,
  useGetSubscriptionStatsQuery,
  useToggleSubscriptionStatusMutation,
  useDeleteSubscriptionMutation,
  useUpdateSubscriptionPaymentStatusMutation,
  useAddSubscriptionPaymentRecordMutation,
  SubscriptionItem,
  SubscriptionPaymentRecord,
} from "@/redux/api/subscriptionApi";
import toast from "react-hot-toast";

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  const [dueSoonOnly, setDueSoonOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Deleting item modal state
  const [deletingItem, setDeletingItem] = useState<SubscriptionItem | null>(null);
  // View details modal state
  const [selectedItem, setSelectedItem] = useState<SubscriptionItem | null>(null);
  // Payment tracking modal state
  const [paymentModalItem, setPaymentModalItem] = useState<SubscriptionItem | null>(null);
  const [newMonthName, setNewMonthName] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newAmount, setNewAmount] = useState<number | string>("");
  const [newPaymentStatus, setNewPaymentStatus] = useState<"paid" | "unpaid">("unpaid");


  const queryParams = useMemo(() => {
    const params: any = { page, limit };
    if (search.trim()) params.search = search.trim();
    if (statusFilter !== "all") params.status = statusFilter;
    if (frequencyFilter !== "all") params.frequency = frequencyFilter;
    if (dueSoonOnly) params.dueSoon = "true";
    return params;
  }, [page, limit, search, statusFilter, frequencyFilter, dueSoonOnly]);

  const {
    data: subscriptionsData,
    isLoading,
    isFetching,
    refetch: refetchSubscriptions,
  } = useGetSubscriptionsQuery(queryParams);

  const {
    data: statsData,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useGetSubscriptionStatsQuery();

  const [toggleStatus, { isLoading: isToggling }] = useToggleSubscriptionStatusMutation();
  const [deleteSubscription, { isLoading: isDeleting }] = useDeleteSubscriptionMutation();
  const [updatePaymentStatus, { isLoading: isUpdatingPayment }] = useUpdateSubscriptionPaymentStatusMutation();
  const [addPaymentRecord, { isLoading: isAddingPayment }] = useAddSubscriptionPaymentRecordMutation();

  const subscriptions = subscriptionsData?.data || [];
  const meta = subscriptionsData?.meta || { total: 0, totalPage: 1, page: 1, limit: 10 };
  const stats = statsData?.data || { total: 0, active: 0, paused: 0, cancelled: 0, dueThisWeek: 0 };

  const handleRefresh = () => {
    refetchSubscriptions();
    refetchStats();
    toast.success("Subscriptions refreshed");
  };

  const handleToggleStatus = async (item: SubscriptionItem, nextStatus: "active" | "paused" | "cancelled") => {
    try {
      await toggleStatus({ id: item._id, status: nextStatus }).unwrap();
      toast.success(`Subscription updated to ${nextStatus}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update subscription status");
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteSubscription(deletingItem._id).unwrap();
      toast.success("Subscription removed successfully");
      setDeletingItem(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete subscription");
    }
  };

  const handleOpenPaymentModal = (item: SubscriptionItem) => {
    setPaymentModalItem(item);
    const existingCount = item.payments?.length || 0;
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + (existingCount > 0 ? 1 : 0));
    const suggestedMonth = nextDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    setNewMonthName(suggestedMonth);
    setNewDueDate(new Date().toISOString().split("T")[0]);
    setNewAmount(item.totalPerDelivery);
    setNewPaymentStatus("unpaid");
  };

  const handleTogglePaymentRecord = async (
    subscriptionId: string,
    paymentId: string,
    currentStatus: "paid" | "unpaid" | "pending"
  ) => {
    const nextStatus = currentStatus === "paid" ? "unpaid" : "paid";
    try {
      const res: any = await updatePaymentStatus({
        id: subscriptionId,
        paymentId,
        status: nextStatus,
      }).unwrap();
      toast.success(`Cycle payment marked as ${nextStatus.toUpperCase()}`);
      if (res?.data && paymentModalItem && paymentModalItem._id === subscriptionId) {
        setPaymentModalItem(res.data);
      }
      refetchSubscriptions();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update payment status");
    }
  };

  const handleAddCyclePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalItem) return;
    if (!newMonthName.trim()) {
      return toast.error("Please enter a billing month name (e.g. November 2026)");
    }
    try {
      const res: any = await addPaymentRecord({
        id: paymentModalItem._id,
        billingMonth: newMonthName.trim(),
        dueDate: newDueDate || new Date().toISOString(),
        amount: Number(newAmount) || paymentModalItem.totalPerDelivery,
        paymentStatus: newPaymentStatus,
      }).unwrap();
      toast.success("Billing cycle record added successfully!");
      if (res?.data) {
        setPaymentModalItem(res.data);
      }
      refetchSubscriptions();
      setNewMonthName("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add billing cycle");
    }
  };


  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isDueSoon = (dateStr?: string) => {
    if (!dateStr) return false;
    const nextDate = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diffDays = (nextDate - now) / (1000 * 3600 * 24);
    return diffDays >= -1 && diffDays <= 7;
  };

  const openWhatsApp = (phone: string, customerName: string, productName: string, dateStr: string) => {
    let cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "88" + cleanPhone;
    }
    const formattedDate = formatDate(dateStr);
    const message = encodeURIComponent(
      `আসসালামু আলাইকুম ${customerName}! সদাইবাড়ি (Tech Mahmud) থেকে আপনার সাবস্ক্রিপশন প্যাকেজ: "${productName}" আগামী ${formattedDate} তারিখে ডেলিভারির জন্য প্রস্তুত হচ্ছে। আপনার ডেলিভারি কনফার্ম করতে অনুগ্রহ করে রিপ্লাই দিন। ধন্যবাদ!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank");
  };

  const handleExportCSV = () => {
    if (subscriptions.length === 0) {
      toast.error("No subscriptions to export");
      return;
    }

    const headers = [
      "ID",
      "Customer Name",
      "Phone",
      "Address",
      "Product",
      "Frequency",
      "Next Delivery",
      "Total Amount",
      "Status",
      "Latest Payment Month",
      "Payment Status",
    ];
    const rows = subscriptions.map((s) => {
      const latestPay = s.payments && s.payments.length > 0 ? s.payments[s.payments.length - 1] : null;
      return [
        s._id,
        `"${s.customerName}"`,
        `"${s.customerPhone}"`,
        `"${s.deliveryAddress}"`,
        `"${s.productName}"`,
        s.frequency,
        formatDate(s.nextDeliveryDate),
        s.totalPerDelivery,
        s.status,
        latestPay ? `"${latestPay.billingMonth}"` : "N/A",
        latestPay ? latestPay.paymentStatus?.toUpperCase() : "N/A",
      ];
    });


    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscriptions_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Subscriptions exported to CSV");
  };

  const statCards = [
    {
      label: "Total Subscriptions",
      value: stats.total,
      subtext: "All registered plans",
      icon: FiRepeat,
      color: "text-blue-600",
      bg: "bg-blue-50/70",
      border: "border-blue-100",
    },
    {
      label: "Active Deliveries",
      value: stats.active,
      subtext: "Currently recurring",
      icon: FiCheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50/70",
      border: "border-emerald-100",
    },
    {
      label: "Due This Week",
      value: stats.dueThisWeek,
      subtext: "Pending delivery action",
      icon: FiClock,
      color: "text-amber-600",
      bg: "bg-amber-50/70",
      border: "border-amber-200",
    },
    {
      label: "Paused / Cancelled",
      value: (stats.paused || 0) + (stats.cancelled || 0),
      subtext: `${stats.paused || 0} paused, ${stats.cancelled || 0} cancelled`,
      icon: FiPauseCircle,
      color: "text-rose-600",
      bg: "bg-rose-50/70",
      border: "border-rose-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-sm">
              <FiRepeat size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Package Subscriptions
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Auto Delivery
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-0.5">
                Manage recurring grocery & household boxes, weekly/monthly schedules, and scheduled dispatches
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-stretch md:self-auto">
          <button
            onClick={() => setDueSoonOnly(!dueSoonOnly)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2 border ${
              dueSoonOnly
                ? "bg-amber-500 text-white border-amber-600"
                : "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200"
            }`}
          >
            <FiClock size={16} />
            <span>Due Next 7 Days</span>
          </button>

          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm text-gray-700"
          >
            <FiRefreshCw
              size={16}
              className={isFetching || isStatsLoading ? "animate-spin text-emerald-600" : ""}
            />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
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
          <div className="md:col-span-6 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by customer name, phone, package, or address..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm bg-gray-50/40"
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
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white text-sm font-medium text-gray-700"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Frequency Filter */}
          <div className="md:col-span-3">
            <select
              value={frequencyFilter}
              onChange={(e) => {
                setFrequencyFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white text-sm font-medium text-gray-700"
            >
              <option value="all">All Frequencies</option>
              <option value="weekly">Weekly Plans</option>
              <option value="monthly">Monthly Plans</option>
              <option value="bi-weekly">Bi-Weekly Plans</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Subscribed Package
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Frequency & Day
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Next Delivery
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Amount / Cycle
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Payment (মাসিক বিল)
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
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
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-36"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-44"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-gray-200 rounded w-24 ml-auto"></div></td>
                  </tr>
                ))
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                        <FiRepeat size={32} />
                      </div>
                      <p className="text-gray-800 font-bold text-lg">No Subscriptions Found</p>
                      <p className="text-gray-400 text-sm mt-1 max-w-md">
                        Customers who subscribe to weekly vegetable boxes or monthly hygiene boxes will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((item) => {
                  const due = isDueSoon(item.nextDeliveryDate);
                  const latestPayment = item.payments && item.payments.length > 0
                    ? item.payments[item.payments.length - 1]
                    : null;
                  const isPaid = latestPayment?.paymentStatus === "paid";

                  return (
                    <tr key={item._id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Customer info */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{item.customerName}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                            <FiPhone size={12} className="text-gray-400" />
                            <span>{item.customerPhone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5 truncate max-w-xs">
                            <FiMapPin size={11} className="shrink-0" />
                            <span className="truncate">{item.deliveryAddress}</span>
                          </div>
                        </div>
                      </td>

                      {/* Package Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          {item.productThumbnail ? (
                            <img
                              src={item.productThumbnail}
                              alt={item.productName}
                              className="w-10 h-10 object-cover rounded-lg border border-gray-100 shadow-xs"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                              <FiBox size={18} />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.productName}</p>
                            {item.variantName && (
                              <p className="text-[11px] text-emerald-700 font-medium">Size: {item.variantName}</p>
                            )}
                            <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      </td>

                      {/* Frequency & Preferred Day */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                            item.frequency === "weekly"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {item.frequency}
                        </span>
                        {item.preferredDeliveryDay && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <FiCalendar size={11} /> {item.preferredDeliveryDay}
                          </p>
                        )}
                      </td>

                      {/* Next Delivery Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-800">{formatDate(item.nextDeliveryDate)}</span>
                          {due && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 animate-pulse">
                              Due Soon
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Completed: {item.deliveriesCompleted || 0} times
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-gray-900">৳{item.totalPerDelivery}</p>
                        <p className="text-[11px] text-gray-400">Payment: {item.paymentPreference?.toUpperCase()}</p>
                      </td>

                      {/* Payment Tracking (Monthly) */}
                      <td className="px-6 py-4">
                        {latestPayment ? (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  isPaid
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}
                              >
                                {isPaid ? <FiCheckCircle size={10} /> : <FiAlertCircle size={10} />}
                                {isPaid ? "Paid" : "Unpaid"}
                              </span>
                              <span className="text-xs font-bold text-gray-800">{latestPayment.billingMonth}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenPaymentModal(item)}
                              className="text-[11px] text-blue-600 hover:text-blue-800 font-bold hover:underline mt-1 flex items-center gap-1 cursor-pointer"
                            >
                              <span>Manage ({item.payments?.length || 0} cycles)</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenPaymentModal(item)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all cursor-pointer border border-blue-200"
                          >
                            + Track Payment
                          </button>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            item.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : item.status === "paused"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === "active"
                                ? "bg-emerald-500 animate-ping"
                                : item.status === "paused"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Payment Management Modal Trigger */}
                          <button
                            onClick={() => handleOpenPaymentModal(item)}
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl transition-all shadow-xs"
                            title="Manage Monthly Payments"
                          >
                            <FiDollarSign size={15} />
                          </button>

                          {/* WhatsApp Notify */}
                          <button
                            onClick={() =>
                              openWhatsApp(
                                item.customerPhone,
                                item.customerName,
                                item.productName,
                                item.nextDeliveryDate
                              )
                            }
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-all shadow-xs"
                            title="Send WhatsApp Delivery Reminder"
                          >
                            <FiMessageSquare size={15} />
                          </button>


                          {/* Toggle Active / Pause */}
                          {item.status === "active" ? (
                            <button
                              onClick={() => handleToggleStatus(item, "paused")}
                              disabled={isToggling}
                              className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl transition-all shadow-xs text-xs font-bold"
                              title="Pause Subscription"
                            >
                              Pause
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(item, "active")}
                              disabled={isToggling}
                              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-all shadow-xs text-xs font-bold"
                              title="Activate Subscription"
                            >
                              Activate
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingItem(item)}
                            className="p-2 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 rounded-xl transition-all shadow-xs"
                            title="Delete Subscription"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-xs text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-800">{subscriptions.length}</span> of{" "}
              <span className="font-bold text-gray-800">{meta.total}</span> subscriptions
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
              Page {page} of {meta.totalPage || 1}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPage || 1, p + 1))}
              disabled={page >= (meta.totalPage || 1) || isLoading}
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
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <FiAlertCircle size={24} />
              <h3 className="text-lg font-bold text-gray-900">Cancel & Remove Subscription?</h3>
            </div>
            <p className="text-sm text-gray-500">
              Are you sure you want to remove the subscription of{" "}
              <span className="font-bold text-gray-800">{deletingItem.customerName}</span> for{" "}
              <span className="font-bold text-gray-800">{deletingItem.productName}</span>?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Keep Active
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
              >
                {isDeleting ? "Removing..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Payment Tracking Modal */}
      {paymentModalItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-150">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-1 border border-emerald-200">
                  Monthly Payment Tracking (মাসিক বিল ট্র্যাকিং)
                </span>
                <h3 className="text-lg font-black text-gray-900">
                  {paymentModalItem.customerName}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {paymentModalItem.productName} • {paymentModalItem.customerPhone} • ৳{paymentModalItem.totalPerDelivery} / cycle
                </p>
              </div>
              <button
                onClick={() => setPaymentModalItem(null)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-all"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
              {/* Existing Cycles List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                  <FiClock size={13} />
                  Recorded Billing Cycles ({paymentModalItem.payments?.length || 0})
                </h4>

                {(!paymentModalItem.payments || paymentModalItem.payments.length === 0) ? (
                  <div className="p-6 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">No payment cycle records added yet for this subscription.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {paymentModalItem.payments.map((p) => {
                      const isPaid = p.paymentStatus === "paid";
                      return (
                        <div
                          key={p._id}
                          className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                            isPaid
                              ? "bg-emerald-50/50 border-emerald-200"
                              : "bg-white border-gray-200 shadow-2xs"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-gray-900">
                                Cycle #{p.cycleNumber}: {p.billingMonth}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  isPaid
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {isPaid ? "PAID" : "UNPAID"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 flex-wrap">
                              <span>Due: {formatDate(p.dueDate)}</span>
                              <span>•</span>
                              <span className="font-bold text-gray-800">৳{p.amount}</span>
                              <span>•</span>
                              <span className="capitalize">{p.paymentMethod || "COD"}</span>
                              {p.paidAt && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-700 font-medium">
                                    Paid on {formatDate(p.paidAt)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div>
                            <button
                              type="button"
                              disabled={isUpdatingPayment}
                              onClick={() =>
                                handleTogglePaymentRecord(
                                  paymentModalItem._id,
                                  p._id,
                                  p.paymentStatus
                                )
                              }
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isPaid
                                  ? "bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-600 border border-gray-200"
                                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                              }`}
                            >
                              {isPaid ? "Mark as Unpaid" : "✓ Mark Paid (টাকা দিয়েছে)"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add Next Cycle Form */}
              <div className="pt-4 border-t border-gray-150">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-1.5">
                  <FiPlus size={14} className="text-emerald-600" />
                  Add New Month / Cycle (পরবর্তী মাসের বিল রেকর্ড যুক্ত করুন)
                </h4>

                <form
                  onSubmit={handleAddCyclePayment}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Billing Month *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. November 2026"
                      value={newMonthName}
                      onChange={(e) => setNewMonthName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      Amount (৳)
                    </label>
                    <input
                      type="number"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div className="sm:col-span-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-gray-700">Payment Status:</label>
                      <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                        <input
                          type="radio"
                          name="modalPaymentStatus"
                          checked={newPaymentStatus === "unpaid"}
                          onChange={() => setNewPaymentStatus("unpaid")}
                        />
                        <span>Unpaid (বাকি)</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                        <input
                          type="radio"
                          name="modalPaymentStatus"
                          checked={newPaymentStatus === "paid"}
                          onChange={() => setNewPaymentStatus("paid")}
                        />
                        <span>Already Paid (পরিশোধিত)</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isAddingPayment}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {isAddingPayment ? "Adding..." : "+ Add Cycle Record"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

