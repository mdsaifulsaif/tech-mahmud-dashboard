"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiShield,
  FiEdit2,
  FiCopy,
  FiPackage,
  FiCreditCard,
  FiExternalLink,
} from "react-icons/fi";
import {
  useGetCustomerByIdQuery,
  useToggleCustomerStatusMutation,
  CustomerItem,
} from "@/redux/api/customerApi";
import toast from "react-hot-toast";
import CustomerEditModal from "../_components/CustomerEditModal";

export default function CustomerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const customerId = (params?.id as string) || "";

  const [activeTab, setActiveTab] = useState<"orders" | "address" | "account">("orders");
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, isError, refetch } = useGetCustomerByIdQuery(customerId, {
    skip: !customerId,
  });

  const [toggleStatus, { isLoading: isToggling }] = useToggleCustomerStatusMutation();

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
      toast.success(`Customer status changed to ${newStatus}`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to toggle status");
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

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse max-w-6xl mx-auto">
        <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
        <div className="grid grid-cols-4 gap-4">
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
          <div className="h-24 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="p-12 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <FiAlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Customer Not Found</h2>
        <p className="text-gray-500 text-sm">
          The customer profile you are looking for does not exist or could not be loaded.
        </p>
        <Link
          href="/dashboard/admin/customers"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition-all"
        >
          <FiArrowLeft size={16} />
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Navigation Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/admin/customers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#2563EB] transition-colors"
        >
          <FiArrowLeft size={16} />
          Back to Customers List
        </Link>
        <p className="text-xs text-gray-400 font-mono">ID: {customer._id}</p>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {customer.avatar ? (
              <img
                src={customer.avatar}
                alt={customer.firstName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center font-bold text-3xl shadow-md">
                {customer.firstName?.[0] || "C"}
                {customer.lastName?.[0] || ""}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                  {customer.firstName} {customer.lastName}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    customer.status === "active"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      customer.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {customer.status}
                </span>
                {customer.isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
                    <FiCheckCircle size={12} className="text-blue-600" />
                    Verified Customer
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                    <FiAlertCircle size={12} className="text-amber-600" />
                    Unverified Email
                  </span>
                )}
              </div>

              <div className="flex items-center gap-5 mt-3 text-sm text-gray-600 flex-wrap">
                <span
                  onClick={() => copyToClipboard(customer.email, "Email")}
                  className="flex items-center gap-1.5 hover:text-[#2563EB] cursor-pointer transition-colors"
                  title="Click to copy"
                >
                  <FiMail size={15} className="text-gray-400" />
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
                    <FiPhone size={15} className="text-gray-400" />
                    {customer.phoneNumber || customer.phone}
                    <FiCopy size={12} className="text-gray-300" />
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-gray-500">
                  <FiCalendar size={15} className="text-gray-400" />
                  Member since {formatDate(customer.createdAt).split(",")[0]}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-xs transition-all"
            >
              <FiEdit2 size={16} />
              Edit Profile
            </button>
            <button
              onClick={handleToggleStatus}
              disabled={isToggling}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-xs ${
                customer.status === "active"
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
              }`}
            >
              <FiShield size={16} />
              {isToggling
                ? "Updating..."
                : customer.status === "active"
                ? "Block Customer"
                : "Activate Customer"}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <FiShoppingBag size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{customer.totalOrders || 0}</p>
          <p className="text-xs text-gray-400 mt-1">Non-cancelled orders</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Spend</span>
            <div className="p-2.5 bg-emerald-50 text-[#2563EB] rounded-xl">
              <FiDollarSign size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#2563EB]">
            {formatCurrency(customer.totalSpent || 0)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Lifetime Gross Revenue</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <FiDollarSign size={18} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">
            {formatCurrency(
              customer.totalOrders > 0
                ? Math.round((customer.totalSpent || 0) / customer.totalOrders)
                : 0
            )}
          </p>
          <p className="text-xs text-gray-400 mt-1">Average per transaction</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">City / Region</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <FiMapPin size={18} />
            </div>
          </div>
          <p className="text-xl font-extrabold text-gray-900 truncate mt-1">
            {customer.shippingAddress?.city ||
              customer.addresses?.[0]?.city ||
              customer.shippingAddress?.district ||
              "Not set"}
          </p>
          <p className="text-xs text-gray-400 mt-1">Primary shipping zone</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center border-b border-gray-100 px-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-4 px-2 font-bold text-sm border-b-2 mr-6 transition-all ${
              activeTab === "orders"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Order History ({customer.orders?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("address")}
            className={`py-4 px-2 font-bold text-sm border-b-2 mr-6 transition-all ${
              activeTab === "address"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Shipping & Address
          </button>
          <button
            onClick={() => setActiveTab("account")}
            className={`py-4 px-2 font-bold text-sm border-b-2 transition-all ${
              activeTab === "account"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Account Details
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === "orders" && (
            <div>
              {!customer.orders || customer.orders.length === 0 ? (
                <div className="text-center py-16">
                  <FiShoppingBag size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-700 font-bold">No orders found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    This customer has not placed any orders yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                        <th className="px-5 py-3.5">Order ID</th>
                        <th className="px-5 py-3.5">Date</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5">Payment</th>
                        <th className="px-5 py-3.5 text-right">Total Amount</th>
                        <th className="px-5 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {customer.orders.map((order: any) => (
                        <tr key={order._id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-5 py-4 font-mono font-bold text-gray-900">
                            {order.orderNumber || order._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-600">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${getOrderStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs">
                            <div className="capitalize">
                              <span className="font-semibold text-gray-800">
                                {order.paymentMethod || "COD"}
                              </span>
                              {" • "}
                              <span
                                className={
                                  order.paymentStatus === "paid"
                                    ? "text-green-600 font-bold"
                                    : "text-amber-600 font-bold"
                                }
                              >
                                {order.paymentStatus}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right font-extrabold text-gray-900">
                            {formatCurrency(order.totalAmount)}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Link
                              href="/dashboard/admin/orders"
                              className="text-xs font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1"
                            >
                              View in Orders <FiExternalLink size={12} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESS */}
          {activeTab === "address" && (
            <div className="space-y-4">
              {customer.shippingAddress || (customer.addresses && customer.addresses.length > 0) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(customer.addresses && customer.addresses.length > 0
                    ? customer.addresses
                    : [customer.shippingAddress]
                  ).map((addr: any, idx: number) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-md">
                          {addr?.label || "Shipping Address"}
                        </span>
                        {idx === 0 && (
                          <span className="text-xs text-gray-400 font-medium">Default</span>
                        )}
                      </div>
                      <p className="font-bold text-gray-800 text-sm mt-2">
                        {addr?.name || `${customer.firstName} ${customer.lastName}`}
                      </p>
                      <p className="text-xs text-gray-600">
                        {addr?.houseNo ? `House ${addr.houseNo}, ` : ""}
                        {addr?.road ? `Road ${addr.road}, ` : ""}
                        {addr?.block ? `Block ${addr.block}` : ""}
                      </p>
                      <p className="text-xs text-gray-600">
                        {addr?.city || "City not set"}{" "}
                        {addr?.district ? `- ${addr.district}` : ""}{" "}
                        {addr?.postalCode ? `(${addr.postalCode})` : ""}
                      </p>
                      {addr?.deliveryNotes && (
                        <p className="text-xs text-gray-500 italic mt-2 bg-white p-2 rounded-lg border border-gray-100">
                          Note: {addr.deliveryNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FiMapPin size={36} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm font-medium">No saved shipping address</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT DETAILS */}
          {activeTab === "account" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Full Name</p>
                  <p className="font-bold text-gray-800 text-base mt-0.5">
                    {customer.firstName} {customer.lastName}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Email Address</p>
                  <p className="font-bold text-gray-800 text-base mt-0.5">{customer.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Phone Number</p>
                  <p className="font-bold text-gray-800 text-base mt-0.5">
                    {customer.phoneNumber || customer.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase font-semibold">System Role</p>
                  <p className="font-bold text-gray-800 text-base mt-0.5 capitalize">
                    {customer.role || "user"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Account Status</p>
                  <p className="font-bold text-gray-800 text-base mt-0.5 capitalize">
                    {customer.status}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400 uppercase font-semibold">Registration Date</p>
                  <p className="font-bold text-gray-800 text-base mt-0.5">
                    {formatDate(customer.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <CustomerEditModal
          customer={customer}
          onClose={() => setIsEditing(false)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
