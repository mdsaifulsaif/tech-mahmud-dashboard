

"use client";

import React from "react";
import {
  FiX,
  FiMapPin,
  FiPhone,
  FiPackage,
  FiTruck,
  FiCalendar,
  FiClock,
  FiUser,
  FiCreditCard,
  FiInfo,
  FiGift,
  FiAlertTriangle,
} from "react-icons/fi";
import { useGetAdminOrderByIdQuery } from "@/redux/api/orderApi";

const BRAND = "#2563EB";

interface Props {
  orderId: string;
  onClose: () => void;
}

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

const statusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "confirmed":
    case "processing":
      return "bg-blue-100 text-blue-700";
    case "shipped":
    case "out_for_delivery":
      return "bg-indigo-100 text-indigo-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function OrderDetailsModal({ orderId, onClose }: Props) {
  const { data, isLoading, error } = useGetAdminOrderByIdQuery(orderId);
  const order = data?.data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Order Details {order?.orderNumber && `— ${order.orderNumber}`}
            </h2>
            {order?.status && (
              <span
                className={`inline-block mt-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${statusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2563EB] rounded-full animate-spin" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500 py-10">Failed to load order details</p>
          ) : !order ? (
            <p className="text-center text-gray-400 py-10">Order not found</p>
          ) : (
            <>
              {/* Outside Location Warning - Super Admin Verification */}
              {order?.isOutsideLocation && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FiAlertTriangle size={18} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-bold text-xs uppercase tracking-wide">
                        Outside Barisal Coverage
                      </span>
                      <span className="text-xs text-amber-800 font-semibold">
                        Call Confirmation Required
                      </span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      This order was placed from outside the local Barisal area. Please call the recipient or customer at{" "}
                      <a
                        href={`tel:${order?.deliveryAddress?.phone}`}
                        className="font-bold underline text-amber-900 hover:text-black"
                      >
                        {order?.deliveryAddress?.phone || "Phone"}
                      </a>{" "}
                      to confirm delivery details before handing over to courier.
                    </p>
                    {order?.orderPlacedCoords && (
                      <p className="text-[11px] font-mono text-amber-700">
                        Device GPS Coordinates: {order.orderPlacedCoords.lat?.toFixed(4)}, {order.orderPlacedCoords.lng?.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Info */}
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiUser size={13} /> Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                  <div>
                    <p className="text-[11px] text-gray-400">Name</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {order?.deliveryAddress?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Phone</p>
                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                      <FiPhone size={12} className="text-gray-400" />
                      {order?.deliveryAddress?.phone || "N/A"}
                    </p>
                  </div>
                  {order?.deliveryAddress?.label && (
                    <div>
                      <p className="text-[11px] text-gray-400">Address Label</p>
                      <p className="text-sm font-semibold text-gray-800 capitalize">
                        {order.deliveryAddress.label}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Delivery Address */}
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiMapPin size={13} /> Delivery Address
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-1.5">
                  <p className="font-medium">
                    {order?.deliveryType === "local"
                      ? "Local Delivery"
                      : "Nationwide Delivery"}
                  </p>
                  <p>
                    {[
                      order?.deliveryAddress?.area?.name,
                      order?.deliveryAddress?.city,
                    ]
                      .filter(Boolean)
                      .join(", ") || "No address provided"}
                  </p>
                </div>
              </section>

              {/* Delivery Info */}
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiTruck size={13} /> Delivery Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 text-sm">
                  <div>
                    <p className="text-[11px] text-gray-400">Estimated Delivery</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1.5">
                      <FiCalendar size={12} className="text-gray-400" />
                      {formatDateTime(order?.estimatedDelivery)}
                    </p>
                  </div>
                  {order?.deliveryDate && (
                    <div>
                      <p className="text-[11px] text-gray-400">Delivery Date</p>
                      <p className="font-medium text-gray-800">
                        {formatDateTime(order.deliveryDate)}
                      </p>
                    </div>
                  )}
                  {order?.deliveryTime && (
                    <div>
                      <p className="text-[11px] text-gray-400">Delivery Time</p>
                      <p className="font-medium text-gray-800 flex items-center gap-1.5">
                        <FiClock size={12} className="text-gray-400" />
                        {order.deliveryTime}
                      </p>
                    </div>
                  )}
                  {order?.courierName && (
                    <div>
                      <p className="text-[11px] text-gray-400">Courier Partner</p>
                      <p className="font-semibold text-blue-600 flex items-center gap-1.5">
                        <FiTruck size={12} />
                        {order.courierName}
                      </p>
                    </div>
                  )}
                  {order?.trackingCode && (
                    <div>
                      <p className="text-[11px] text-gray-400">Tracking Code</p>
                      <p className="font-mono font-medium text-gray-800 text-xs">
                        {order.trackingCode}
                      </p>
                    </div>
                  )}
                  {order?.consignmentId && (
                    <div>
                      <p className="text-[11px] text-gray-400">Consignment ID / Note</p>
                      <p className="font-medium text-gray-800 text-xs">
                        {order.consignmentId}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Items */}
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiPackage size={13} /> Items ({order?.items?.length || 0})
                </h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  {order?.items?.map((item: any, i: number) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-4 py-3 text-sm ${i !== order.items.length - 1 ? "border-b border-gray-100" : ""
                        }`}
                    >
                      {item.thumbnail && (
                        <img
                          src={item.thumbnail}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          SKU: {item.sku || "N/A"} · Qty: {item.quantity}
                          {item.unit ? ` ${item.unit}` : ""}
                          {item.weightOrVolume
                            ? ` · ${item.weightOrVolume}${item.unit || ""}`
                            : ""}
                        </p>
                        {item.selectedAttributes && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.selectedAttributes.color && (
                              <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                                Color: {item.selectedAttributes.color}
                              </span>
                            )}
                            {item.selectedAttributes.size && (
                              <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-medium">
                                Size: {item.selectedAttributes.size}
                              </span>
                            )}
                            {item.selectedAttributes.storage && (
                              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                                Storage: {item.selectedAttributes.storage}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          ৳{item.salePrice ?? item.unitPrice}
                          {item.unitPrice !== item.salePrice && (
                            <span className="line-through ml-1 text-gray-300">
                              ৳{item.unitPrice}
                            </span>
                          )}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-800 flex-shrink-0">
                        ৳{item.totalPrice}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Payment Summary */}
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiCreditCard size={13} /> Payment Summary
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">৳{order?.subtotal ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">৳{order?.shippingCharge ?? 0}</span>
                  </div>
                  {(order?.discountAmount > 0 || order?.couponDiscount > 0) && (
                    <>
                      {order?.discountAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Discount</span>
                          <span className="font-medium text-green-600">
                            -৳{order.discountAmount}
                          </span>
                        </div>
                      )}
                      {order?.couponDiscount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Coupon Discount</span>
                          <span className="font-medium text-green-600">
                            -৳{order.couponDiscount}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-gray-800">
                      ৳{order?.totalAmount ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 text-xs text-gray-500">
                    <span>Payment Method</span>
                    <span className="uppercase font-semibold">
                      {order?.paymentMethod || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Payment Status</span>
                    <span className="capitalize font-semibold">
                      {order?.paymentStatus || "N/A"}
                    </span>
                  </div>
                </div>
              </section>

              {/* Extra Info */}
              <section>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiInfo size={13} /> Additional Info
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 text-sm">
                  <div>
                    <p className="text-[11px] text-gray-400">Order Created</p>
                    <p className="font-medium text-gray-800">
                      {formatDateTime(order?.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Last Updated</p>
                    <p className="font-medium text-gray-800">
                      {formatDateTime(order?.updatedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400">Gift Order</p>
                    <p className="font-medium text-gray-800 flex items-center gap-1">
                      {order?.isGift ? (
                        <>
                          <FiGift size={13} className="text-[#2563EB]" /> Yes
                        </>
                      ) : (
                        "No"
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {/* Status Timeline */}
              {order?.statusTimeline?.length > 0 && (
                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Status Timeline
                  </h3>
                  <div className="space-y-3">
                    {order.statusTimeline.map((entry: any, i: number) => (
                      <div
                        key={i}
                        className="flex gap-3 items-start bg-gray-50 rounded-xl p-3"
                      >
                        <div
                          className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${i === 0 ? "bg-[#2563EB]" : "bg-gray-300"
                            }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 capitalize">
                            {entry.status}
                          </p>
                          {entry.note && (
                            <p className="text-xs text-gray-500 mt-0.5">{entry.note}</p>
                          )}
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {formatDateTime(entry.changedAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Special Instructions */}
              {order?.specialInstructions && (
                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Special Instructions
                  </h3>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
                    {order.specialInstructions}
                  </p>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}