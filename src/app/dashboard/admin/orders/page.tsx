"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiDownload,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiTruck,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiCopy,
  FiMessageSquare,
  FiPlus,
  FiSliders,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useUpdateCourierInfoMutation,
} from "@/redux/api/orderApi";
import { toast } from "react-hot-toast";
import OrderEditModal from "./_components/OrderEditModal";
import OrderDetailsModal from "./_components/OrderDetailsModal";
import CreateOrderModal from "./_components/CreateOrderModal";

const BRAND = "#2563EB";
const BRAND_DARK = "#1D4ED8";

// ---- These MUST mirror your Order model enums exactly (order.model.ts) ----
const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
] as const;

const PAYMENT_STATUSES = [
  "unpaid",
  "paid",
  "partially_paid",
  "refunded",
] as const;

const DELIVERY_TYPES = ["local", "nationwide"] as const;

// -----------------------------------------------------------------------

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; icon: any }> = {
    pending: { bg: "bg-yellow-50", text: "text-yellow-700", icon: FiClock },
    confirmed: { bg: "bg-blue-50", text: "text-blue-700", icon: FiCheckCircle },
    processing: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      icon: FiPackage,
    },
    shipped: { bg: "bg-indigo-50", text: "text-indigo-700", icon: FiTruck },
    out_for_delivery: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      icon: FiTruck,
    },
    delivered: {
      bg: "bg-green-50",
      text: "text-green-700",
      icon: FiCheckCircle,
    },
    cancelled: { bg: "bg-red-50", text: "text-red-700", icon: FiXCircle },
    returned: { bg: "bg-gray-50", text: "text-gray-700", icon: FiRefreshCw },
  };
  const {
    bg,
    text,
    icon: Icon,
  } = config[status?.toLowerCase()] || config.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold ${bg} ${text}`}
    >
      <Icon size={12} />
      <span className="capitalize">{status?.replace(/_/g, " ") || "N/A"}</span>
    </span>
  );
};

const PaymentBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    unpaid: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    partially_paid: "bg-orange-100 text-orange-700",
    refunded: "bg-purple-100 text-purple-700",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize ${colors[status?.toLowerCase()] || "bg-gray-100 text-gray-700"}`}
    >
      {status?.replace(/_/g, " ") || "N/A"}
    </span>
  );
};

const daysAgo = (dateString?: string) => {
  if (!dateString) return null;
  const diffMs = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 0) return null;
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

// Full date + time — used for "Order placed at" and rider-assigned-at
const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid Date";
  }
};

// Date only — used for the delivery slot's date part
const formatDateOnly = (dateString?: string | null) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

const formatTimeOnly = (dateString?: string | null) => {
  if (!dateString) return null;
  try {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [deliveryType, setDeliveryType] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const {
    data: ordersData,
    isLoading,
    refetch,
    error,
  } = useGetAdminOrdersQuery({
    page,
    limit,
    status: statusFilter !== "all" ? statusFilter : undefined,
    paymentStatus: paymentFilter !== "all" ? paymentFilter : undefined,
    search: search || undefined,
    deliveryType: deliveryType !== "all" ? deliveryType : undefined,
  });

  const [updateStatus] = useUpdateOrderStatusMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
  const [updateCourierInfo] = useUpdateCourierInfoMutation();

  const orders = Array.isArray(ordersData?.data?.orders)
    ? ordersData.data.orders
    : [];
  const totalOrders = ordersData?.data?.total || 0;
  const currentPage = ordersData?.data?.page || 1;
  const totalPages = Math.ceil(totalOrders / limit) || 1;

  const [detailsOrderId, setDetailsOrderId] = useState<string | null>(null);
  const [editOrderId, setEditOrderId] = useState<string | null>(null);

  // custom order state
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Courier tracking modal state
  const [courierModalOpen, setCourierModalOpen] = useState(false);
  const [selectedOrderForCourier, setSelectedOrderForCourier] = useState<any>(null);
  const [courierName, setCourierName] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [consignmentId, setConsignmentId] = useState("");
  const [isSubmittingCourier, setIsSubmittingCourier] = useState(false);

  const openCourierModal = (order: any) => {
    setSelectedOrderForCourier(order);
    setCourierName(order?.courierName || "Steadfast");
    setTrackingCode(order?.trackingCode || "");
    setConsignmentId(order?.consignmentId || "");
    setCourierModalOpen(true);
  };

  const handleCourierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForCourier) return;
    try {
      setIsSubmittingCourier(true);
      await updateCourierInfo({
        id: selectedOrderForCourier._id,
        courierName,
        trackingCode,
        consignmentId,
      }).unwrap();
      toast.success("Courier tracking updated successfully");
      setCourierModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update courier info");
    } finally {
      setIsSubmittingCourier(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success(`Order status updated to ${newStatus.replace(/_/g, " ")}`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handlePaymentUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updatePaymentStatus({
        id: orderId,
        paymentStatus: newStatus,
      }).unwrap();
      toast.success(
        `Payment status updated to ${newStatus.replace(/_/g, " ")}`,
      );
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update payment status");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  // Quick-select counters — based on the currently loaded page.
  // Wire this up to a real /orders/stats endpoint for accurate totals across all pages.
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: totalOrders };
    ORDER_STATUSES.forEach((s) => {
      counts[s] = orders.filter((o: any) => o.status === s).length;
    });
    return counts;
  }, [orders, totalOrders]);

  const paymentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PAYMENT_STATUSES.forEach((s) => {
      counts[s] = orders.filter((o: any) => o.paymentStatus === s).length;
    });
    return counts;
  }, [orders]);

  const topStats = [
    {
      label: "Pending Order",
      sub: "Awaiting confirmation",
      value: statusCounts.pending || 0,
      icon: FiClock,
    },
    {
      label: "On The Way",
      sub: "Processing or in transit",
      value:
        (statusCounts.processing || 0) +
        (statusCounts.shipped || 0) +
        (statusCounts.out_for_delivery || 0),
      icon: FiTruck,
    },
    {
      label: "Done Order",
      sub: "Delivered",
      value: statusCounts.delivered || 0,
      icon: FiCheckCircle,
    },
    {
      label: "Order Rejected",
      sub: "Cancelled / returned",
      value: (statusCounts.cancelled || 0) + (statusCounts.returned || 0),
      icon: FiXCircle,
    },
  ];

  const quickSelectPills = [
    { key: "all", label: "All", count: statusCounts.all },
    ...ORDER_STATUSES.map((s) => ({
      key: s,
      label: s.replace(/_/g, " "),
      count: statusCounts[s],
    })),
  ];

  const paymentPills = PAYMENT_STATUSES.map((s) => ({
    key: s,
    label: s.replace(/_/g, " "),
    count: paymentCounts[s] || 0,
  }));

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg border border-red-200 shadow-sm">
        <div className="text-center py-12">
          <FiXCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-red-600">
            Failed to load orders
          </h3>
          <p className="text-gray-500 mt-2">Please try again later</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 rounded-md text-white transition-colors"
            style={{ backgroundColor: BRAND }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track, filter, and manage all store orders from one place.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => refetch()}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm"
          >
            <FiRefreshCw
              size={16}
              className={isLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
          <button
            className="px-5 py-2.5 text-white rounded-md text-sm font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
            style={{ backgroundColor: "#0f172a" }}
          >
            <FiDownload size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-md bg-gray-50 flex items-center justify-center text-gray-500">
                <stat.icon size={16} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {stat.value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Orders List</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:ring-1 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all outline-none text-sm w-48"
              />
            </div>

            <select
              value={deliveryType}
              onChange={(e) => {
                setDeliveryType(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2.5 border border-gray-200 rounded-md focus:ring-1 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all outline-none text-sm bg-white"
            >
              <option value="all">All Delivery</option>
              {DELIVERY_TYPES.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </select>

            <button className="px-4 py-2.5 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-all bg-white">
              <FiSliders size={16} />
              Filter
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 text-white rounded-md text-sm font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
              style={{ backgroundColor: BRAND }}
            >
              <FiPlus size={16} />
              Create Order
            </button>
          </div>
        </div>

        {/* Quick select pills */}
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Quick select
          </p>
          <div className="flex flex-wrap gap-2">
            {quickSelectPills.map((pill) => (
              <button
                key={pill.key}
                onClick={() => {
                  setStatusFilter(pill.key);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all ${
                  statusFilter === pill.key
                    ? "text-white border-transparent"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
                style={
                  statusFilter === pill.key
                    ? { backgroundColor: "#0f172a" }
                    : {}
                }
              >
                {pill.label} - ({pill.count})
              </button>
            ))}
            <span className="w-px bg-gray-200 mx-1" />
            {paymentPills.map((pill) => (
              <button
                key={pill.key}
                onClick={() => {
                  setPaymentFilter(
                    paymentFilter === pill.key ? "all" : pill.key,
                  );
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all ${
                  paymentFilter === pill.key
                    ? "border-transparent text-white"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
                style={
                  paymentFilter === pill.key ? { backgroundColor: BRAND } : {}
                }
              >
                {pill.label} - ({pill.count})
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1400px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-12">
                  #
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[140px]">
                  Order ID
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[180px]">
                  Customer
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[160px]">
                  Product
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[110px]">
                  Amount
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[170px]">
                  Courier & Tracking
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[130px]">
                  Delivery Slot
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-16">
                  SMS
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[150px]">
                  Order Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[140px]">
                  Payment
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[110px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 11 }).map((__, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-100 rounded w-16" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center">
                    <FiPackage
                      size={48}
                      className="mx-auto text-gray-200 mb-4"
                    />
                    <p className="text-gray-500">No orders found</p>
                  </td>
                </tr>
              ) : (
                orders.map((order: any, idx: number) => {
                  const ago = daysAgo(order?.createdAt);
                  const slotDate: string | null =
                    order?.deliveryDate || order?.estimatedDelivery || null;
                  const slotTime: string | null =
                    order?.deliveryTime || order?.preferredDeliveryTime || null;
                  const hasDeliverySlot = Boolean(slotDate || slotTime);
                  return (
                    <tr
                      key={order?._id}
                      className="hover:bg-gray-50/50 transition-colors align-top"
                    >
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {(currentPage - 1) * limit + idx + 1}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className="font-semibold" style={{ color: BRAND }}>
                          {order?.orderNumber || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDateTime(order?.createdAt)}
                        </p>
                        {ago && (
                          <p className="text-[10px] text-orange-500 font-medium">
                            {ago}
                          </p>
                        )}
                        <p className="text-[10px] text-gray-400 font-medium uppercase">
                          {order?.deliveryType || "N/A"}
                        </p>
                        <button
                          onClick={() => handleCopy(order?.orderNumber)}
                          className="mt-1 text-[11px] text-gray-400 hover:text-gray-600 flex items-center gap-1"
                        >
                          <FiCopy size={11} /> Copy
                        </button>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-800 whitespace-nowrap">
                          {order?.userID?.name ||
                            order?.deliveryAddress?.name ||
                            "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                          {order?.deliveryAddress?.phone ||
                            order?.userID?.phone ||
                            "No phone"}
                          {order?.deliveryAddress?.phone && (
                            <>
                              <FiCopy
                                size={11}
                                className="cursor-pointer hover:text-gray-600"
                                onClick={() =>
                                  handleCopy(order.deliveryAddress.phone)
                                }
                              />
                              <FaWhatsapp
                                size={12}
                                className="text-green-500"
                              />
                            </>
                          )}
                        </p>
                        {order?.isOutsideLocation && (
                          <div className="mt-1 flex items-center gap-1 w-max px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                            <span>🚩 Outside Area (Call)</span>
                          </div>
                        )}
                        <p className="text-[11px] text-gray-400 mt-1 max-w-[180px]">
                          {[
                            order?.deliveryAddress?.houseNo,
                            order?.deliveryAddress?.road,
                            order?.deliveryAddress?.upazila,
                            order?.deliveryAddress?.city,
                          ]
                            .filter(Boolean)
                            .join(", ") || "No address"}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {Array.isArray(order?.items) &&
                        order.items.length > 0 ? (
                          <ul className="space-y-0.5">
                            {order.items
                              .slice(0, 3)
                              .map((it: any, i: number) => (
                                <li key={i} className="whitespace-nowrap">
                                  {i + 1}. {it.productName}{" "}
                                  <span className="text-gray-400">
                                    x{it.quantity}
                                  </span>
                                </li>
                              ))}
                            {order.items.length > 3 && (
                              <li className="text-gray-400">
                                +{order.items.length - 3} more
                              </li>
                            )}
                          </ul>
                        ) : (
                          "N/A"
                        )}
                      </td>

                      <td className="px-4 py-4 text-xs text-gray-500 whitespace-nowrap">
                        <p>Ship: ৳{(order?.shippingCharge ?? 0).toFixed(2)}</p>
                        <p>Disc: ৳{(order?.discountAmount ?? 0).toFixed(2)}</p>
                        <p className="font-bold text-gray-800 text-sm mt-0.5">
                          Tot: ৳{(order?.totalAmount ?? 0).toFixed(2)}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        {order?.courierName ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <FiTruck size={12} /> {order.courierName}
                            </span>
                            {order?.trackingCode ? (
                              <div className="flex items-center gap-1 text-[11px] font-mono text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 w-max">
                                <span className="max-w-[100px] truncate">{order.trackingCode}</span>
                                <FiCopy
                                  size={11}
                                  className="cursor-pointer text-gray-400 hover:text-blue-600 shrink-0"
                                  onClick={() => handleCopy(order.trackingCode)}
                                  title="Copy tracking code"
                                />
                              </div>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => openCourierModal(order)}
                              className="text-[11px] text-blue-600 hover:underline block mt-0.5 font-medium"
                            >
                              Edit Tracking
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openCourierModal(order)}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded border border-dashed border-blue-400 text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                          >
                            <FiTruck size={12} /> + Courier
                          </button>
                        )}
                      </td>

                      <td className="px-4 py-4 text-xs text-gray-600 whitespace-nowrap">
                        {hasDeliverySlot ? (
                          <>
                            {slotDate && (
                              <p className="flex items-center gap-1 font-medium text-gray-700">
                                <FiCalendar size={11} />{" "}
                                {formatDateOnly(slotDate)}
                              </p>
                            )}
                            {slotTime && (
                              <p className="capitalize text-gray-500 flex items-center gap-1">
                                <FiClock size={11} /> {slotTime}
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">Not scheduled</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                          <FiMessageSquare size={16} />
                        </button>
                      </td>

                      <td className="px-4 py-4">
                        <select
                          value={order?.status || "pending"}
                          onChange={(e) =>
                            handleStatusUpdate(order?._id, e.target.value)
                          }
                          className="text-xs border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#2563EB] capitalize w-full min-w-[120px]"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s} className="capitalize">
                              {s.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                        <div className="mt-1.5">
                          <StatusBadge status={order?.status} />
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-xs font-semibold uppercase text-gray-600 whitespace-nowrap">
                          {order?.paymentMethod || "N/A"}
                        </p>
                        <select
                          value={order?.paymentStatus || "unpaid"}
                          onChange={(e) =>
                            handlePaymentUpdate(order?._id, e.target.value)
                          }
                          className="text-xs border border-gray-200 rounded-md px-2 py-1 mt-1 focus:outline-none focus:ring-1 focus:ring-[#2563EB] capitalize w-full min-w-[110px]"
                        >
                          {PAYMENT_STATUSES.map((s) => (
                            <option key={s} value={s} className="capitalize">
                              {s.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                        <div className="mt-1">
                          <PaymentBadge status={order?.paymentStatus} />
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDetailsOrderId(order?._id)}
                            className="p-2 hover:bg-white hover:shadow-md rounded-md text-gray-400 hover:text-[color:var(--brand)] transition-all"
                            style={{ ["--brand" as any]: BRAND }}
                          >
                            <FiEye size={16} />
                          </button>
                          <button
                            onClick={() => setEditOrderId(order?._id)}
                            className="p-2 hover:bg-white hover:shadow-md rounded-md text-gray-400 hover:text-blue-500 transition-all"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button className="p-2 hover:bg-white hover:shadow-md rounded-md text-gray-400 hover:text-red-500 transition-all">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                      {/* 
                            <td className="px-4 py-4">
                                <div className="flex items-center justify-end gap-1">
                                    <Link
                                        href={`/dashboard/admin/orders/${order?._id}`}
                                        className="p-2 hover:bg-white hover:shadow-md rounded-md text-gray-400 hover:text-[color:var(--brand)] transition-all"
                                        style={{ ["--brand" as any]: BRAND }}
                                    >
                                        <FiEye size={16} />
                                    </Link>
                                    <Link
                                        href={`/dashboard/admin/orders/${order?._id}/edit`}
                                        className="p-2 hover:bg-white hover:shadow-md rounded-md text-gray-400 hover:text-blue-500 transition-all"
                                    >
                                        <FiEdit2 size={16} />
                                    </Link>
                                    <button className="p-2 hover:bg-white hover:shadow-md rounded-md text-gray-400 hover:text-red-500 transition-all">
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </td> */}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/30">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Show</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-200 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span>Per Page</span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FiChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(totalPages, 10) },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-md text-sm font-medium transition-all"
                    style={
                      currentPage === p
                        ? {
                            backgroundColor: BRAND,
                            color: "white",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                          }
                        : { color: "#4B5563" }
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}

          {/* <p className="text-sm text-gray-500 font-medium">
            Showing {orders.length} of {totalOrders} orders
          </p>
        </div>
        
      </div>
      

      
    </div> */}
          <p className="text-sm text-gray-500 font-medium">
            Showing {orders.length} of {totalOrders} orders
          </p>
        </div>
      </div>

      {/* ✅ Order Details Modal */}
      {detailsOrderId && (
        <OrderDetailsModal
          orderId={detailsOrderId}
          onClose={() => setDetailsOrderId(null)}
        />
      )}

      {/* ✅ Order Edit Modal */}
      {editOrderId && (
        <OrderEditModal
          orderId={editOrderId}
          onClose={() => {
            setEditOrderId(null);
            refetch(); // ✅ edit শেষে table এর ডেটা রিফ্রেশ
          }}
        />
      )}

      {showCreateModal && (
        <CreateOrderModal
          onClose={() => {
            setShowCreateModal(false);
            refetch();
          }}
        />
      )}

      {/* Courier Tracking Modal */}
      {courierModalOpen && selectedOrderForCourier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Assign / Update Courier
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Order #{selectedOrderForCourier.orderNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCourierModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCourierSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Courier Partner
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="Steadfast">Steadfast Courier</option>
                  <option value="Pathao">Pathao Courier</option>
                  <option value="RedX">RedX Logistics</option>
                  <option value="Sundarban">Sundarban Courier</option>
                  <option value="Paperfly">Paperfly</option>
                  <option value="eCourier">eCourier</option>
                  <option value="SA Paribahan">SA Paribahan</option>
                  <option value="In-house">In-house Delivery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tracking Code / Consignment ID
                </label>
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  placeholder="e.g. STF-8492019"
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reference / Internal Note (Optional)
                </label>
                <input
                  type="text"
                  value={consignmentId}
                  onChange={(e) => setConsignmentId(e.target.value)}
                  placeholder="e.g. Memo #1029"
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCourierModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCourier}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50"
                >
                  {isSubmittingCourier ? "Saving..." : "Save Tracking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
