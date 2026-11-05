"use client";

import React from "react";
import Link from "next/link";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiExternalLink,
  FiEdit2,
  FiShield,
  FiClock,
  FiCopy,
} from "react-icons/fi";
import {
  useGetCustomerByIdQuery,
  useToggleCustomerStatusMutation,
  CustomerItem,
} from "@/redux/api/customerApi";
import toast from "react-hot-toast";

interface CustomerDetailsModalProps {
  customerId: string | null;
  onClose: () => void;
  onEdit: (customer: CustomerItem) => void;
}

const BRAND = "#2563EB";

export default function CustomerDetailsModal({
  customerId,
  onClose,
  onEdit,
}: CustomerDetailsModalProps) {
  const { data, isLoading, isError, refetch } = useGetCustomerByIdQuery(
    customerId || "",
    { skip: !customerId }
  );

  const [toggleStatus, { isLoading: isToggling }] = useToggleCustomerStatusMutation();

  if (!customerId) return null;

  const customer = data?.data;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleToggleStatus = async () => {
    if (!customer) return;
    const newStatus = customer.status === "active" ? "blocked" : "active";
    try {
      await toggleStatus({ id: customer._id, status: newStatus }).unwrap();
      toast.success(`Customer status updated to ${newStatus}`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const formatCurrency = (amount: number) => {
    return `৳${(amount || 0).toLocaleString("en-BD")}`;
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

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "shipped":
      case "out_for_delivery":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing":
      case "confirmed":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "cancelled":
      case "returned":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
              <FiUser size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Customer Profile</h2>
              <p className="text-xs text-gray-400 font-mono">ID: {customerId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-24 bg-gray-100 rounded-xl"></div>
              <div className="grid grid-cols-4 gap-4">
                <div className="h-20 bg-gray-100 rounded-xl"></div>
                <div className="h-20 bg-gray-100 rounded-xl"></div>
                <div className="h-20 bg-gray-100 rounded-xl"></div>
                <div className="h-20 bg-gray-100 rounded-xl"></div>
              </div>
              <div className="h-48 bg-gray-100 rounded-xl"></div>
            </div>
          ) : isError || !customer ? (
            <div className="text-center py-12">
              <FiAlertCircle size={44} className="mx-auto text-red-500 mb-2" />
              <p className="text-gray-700 font-semibold">Failed to load customer profile</p>
              <button
                onClick={() => refetch()}
                className="mt-4 px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Profile Card Header */}
              <div className="bg-gradient-to-br from-emerald-50/50 via-white to-gray-50 rounded-2xl border border-emerald-100/60 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {customer.avatar ? (
                      <img
                        src={customer.avatar}
                        alt={customer.firstName}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center font-bold text-2xl shadow-md">
                        {customer.firstName?.[0] || "U"}
                        {customer.lastName?.[0] || ""}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            customer.status === "active"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              customer.status === "active" ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {customer.status}
                        </span>
                        {customer.isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">
                            <FiCheckCircle size={12} className="text-blue-600" />
                            Verified Email
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">
                            <FiAlertCircle size={12} className="text-amber-600" />
                            Unverified
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                        <span
                          onClick={() => copyToClipboard(customer.email, "Email")}
                          className="flex items-center gap-1.5 hover:text-[#2563EB] cursor-pointer transition-colors"
                          title="Click to copy"
                        >
                          <FiMail size={14} className="text-gray-400" />
                          {customer.email}
                          <FiCopy size={12} className="text-gray-300" />
                        </span>
                        {(customer.phoneNumber || customer.phone) && (
                          <span
                            onClick={() =>
                              copyToClipboard(customer.phoneNumber || customer.phone || "", "Phone")
                            }
                            className="flex items-center gap-1.5 hover:text-[#2563EB] cursor-pointer transition-colors"
                            title="Click to copy"
                          >
                            <FiPhone size={14} className="text-gray-400" />
                            {customer.phoneNumber || customer.phone}
                            <FiCopy size={12} className="text-gray-300" />
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <FiCalendar size={14} className="text-gray-400" />
                          Joined {formatDate(customer.createdAt).split(",")[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                    <button
                      onClick={() => onEdit(customer)}
                      className="px-3.5 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <FiEdit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={handleToggleStatus}
                      disabled={isToggling}
                      className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                        customer.status === "active"
                          ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                          : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                      }`}
                    >
                      <FiShield size={14} />
                      {isToggling
                        ? "Updating..."
                        : customer.status === "active"
                        ? "Block Customer"
                        : "Activate Customer"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FiShoppingBag size={16} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{customer.totalOrders || 0}</p>
                  <p className="text-xs text-gray-400 mt-1">Confirmed & Delivered</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Spent</span>
                    <div className="p-2 bg-emerald-50 text-[#2563EB] rounded-lg">
                      <FiDollarSign size={16} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-[#2563EB]">
                    {formatCurrency(customer.totalSpent || 0)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Lifetime Value</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Avg Order Value</span>
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <FiDollarSign size={16} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      customer.totalOrders > 0
                        ? Math.round((customer.totalSpent || 0) / customer.totalOrders)
                        : 0
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Per Order</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Last Order</span>
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                      <FiClock size={16} />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mt-1 truncate">
                    {customer.lastOrderDate ? formatDate(customer.lastOrderDate).split(",")[0] : "No orders yet"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Recent activity</p>
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <FiMapPin className="text-[#2563EB]" />
                  Shipping Address
                </h4>
                {customer.shippingAddress || (customer.addresses && customer.addresses[0]) ? (
                  (() => {
                    const addr = customer.shippingAddress || customer.addresses?.[0];
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700 bg-gray-50/70 p-4 rounded-xl">
                        <div>
                          <p className="text-xs text-gray-400 font-medium">Street / House</p>
                          <p className="font-semibold text-gray-800">
                            {addr?.houseNo || ""} {addr?.road || ""} {addr?.block || ""}
                            {!addr?.houseNo && !addr?.road && !addr?.block && "Not specified"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">City / District</p>
                          <p className="font-semibold text-gray-800">
                            {addr?.city || "N/A"} {addr?.district ? `, ${addr.district}` : ""}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">Postal / Notes</p>
                          <p className="font-semibold text-gray-800">
                            {addr?.postalCode || "N/A"} {addr?.deliveryNotes ? `(${addr.deliveryNotes})` : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-sm text-gray-400 italic">No delivery address recorded yet.</p>
                )}
              </div>

              {/* Order History */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                    <FiShoppingBag className="text-[#2563EB]" />
                    Order History ({customer.orders?.length || 0})
                  </h4>
                  <Link
                    href={`/dashboard/admin/orders`}
                    className="text-xs text-[#2563EB] hover:underline flex items-center gap-1 font-semibold"
                  >
                    All Orders <FiExternalLink size={12} />
                  </Link>
                </div>

                {!customer.orders || customer.orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No orders placed by this customer yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50/80 text-xs font-semibold text-gray-500 uppercase">
                        <tr>
                          <th className="px-5 py-3">Order Number</th>
                          <th className="px-5 py-3">Date</th>
                          <th className="px-5 py-3">Status</th>
                          <th className="px-5 py-3">Payment</th>
                          <th className="px-5 py-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {customer.orders.map((order: any) => (
                          <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="px-5 py-3 font-mono font-medium text-gray-800">
                              {order.orderNumber || order._id.slice(-8).toUpperCase()}
                            </td>
                            <td className="px-5 py-3 text-gray-600 text-xs">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="px-5 py-3">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getOrderStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-xs capitalize text-gray-600">
                              <span className="font-medium text-gray-800">{order.paymentMethod || "COD"}</span>
                              {" • "}
                              <span
                                className={
                                  order.paymentStatus === "paid" ? "text-green-600 font-semibold" : "text-amber-600"
                                }
                              >
                                {order.paymentStatus}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right font-bold text-gray-900">
                              {formatCurrency(order.totalAmount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Powered by Tech Mahmud Customer Intelligence
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
