"use client";

import React, { useEffect, useState } from "react";
import { FiX, FiSave } from "react-icons/fi";
import { useEditOrderAdminMutation, useGetAdminOrderByIdQuery } from "@/redux/api/orderApi";
import { toast } from "react-hot-toast";

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

// ✅ Partial payment বাদ দেওয়া হয়েছে
const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"] as const;

interface Props {
  orderId: string;
  onClose: () => void;
}

const inputClass =
  "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all";

export default function OrderEditModal({ orderId, onClose }: Props) {
  // ✅ skip guard + isFetching যোগ করা হলো, orderId change হলেও ঠিকভাবে refetch হবে
  const { data, isLoading, isFetching } = useGetAdminOrderByIdQuery(orderId, {
    skip: !orderId,
  });
  const [editOrder, { isLoading: isSaving }] = useEditOrderAdminMutation();

  // ✅ response shape defensive — { success, data: {...} } বা সরাসরি {...} দুটোই handle করবে
  const order = data?.data ?? data;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    houseNo: "",
    road: "",
    flatNo: "",
    deliveryNotes: "",
    deliveryDate: "",
    deliveryTime: "",
    specialInstructions: "",
    status: "pending",
    paymentStatus: "unpaid",
    paymentMethod: "cod",
    shippingCharge: 0,
  });

  useEffect(() => {
    if (!order) return;

    setForm({
      name: order?.deliveryAddress?.name || "",
      phone: order?.deliveryAddress?.phone || "",
      houseNo: order?.deliveryAddress?.houseNo || "",
      road: order?.deliveryAddress?.road || "",
      flatNo: order?.deliveryAddress?.flatNo || "",
      deliveryNotes: order?.deliveryAddress?.deliveryNotes || "",
      deliveryDate: order?.deliveryDate
        ? new Date(order.deliveryDate).toISOString().split("T")[0]
        : "",
      deliveryTime: order?.deliveryTime || "",
      specialInstructions: order?.specialInstructions || "",
      status: order?.status || "pending",
      paymentStatus: order?.paymentStatus || "unpaid",
      paymentMethod: order?.paymentMethod || "cod",
      shippingCharge: order?.shippingCharge ?? 0,
    });
  }, [order]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "shippingCharge" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    try {
      await editOrder({
        id: orderId,
        payload: {
          deliveryAddress: {
            name: form.name,
            phone: form.phone,
            houseNo: form.houseNo,
            road: form.road,
            flatNo: form.flatNo,
            deliveryNotes: form.deliveryNotes,
          },
          deliveryDate: form.deliveryDate || undefined,
          deliveryTime: form.deliveryTime || undefined,
          specialInstructions: form.specialInstructions,
          status: form.status,
          paymentStatus: form.paymentStatus,
          paymentMethod: form.paymentMethod,
          shippingCharge: form.shippingCharge,
        },
      }).unwrap();

      toast.success("Order updated successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update order");
    }
  };

  const loading = isLoading || isFetching;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-800">
            Edit Order {order?.orderNumber && `— ${order.orderNumber}`}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <FiX size={20} />
          </button>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2563EB] rounded-full animate-spin" />
          </div>
        ) : !order ? (
          <div className="py-16 text-center text-gray-400">Order not found</div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                  Customer Name
                </label>
                <input name="name" value={form.name} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">House No</label>
                <input name="houseNo" value={form.houseNo} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Road</label>
                <input name="road" value={form.road} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Flat No</label>
                <input name="flatNo" value={form.flatNo} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Delivery Notes</label>
              <textarea
                name="deliveryNotes"
                value={form.deliveryNotes}
                onChange={handleChange}
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Delivery slot */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Delivery Date</label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={form.deliveryDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Delivery Time</label>
                <input
                  type="time"
                  name="deliveryTime"
                  value={form.deliveryTime}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Status + Payment */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Order Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={`${inputClass} capitalize`}>
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Payment Status</label>
                <select
                  name="paymentStatus"
                  value={form.paymentStatus}
                  onChange={handleChange}
                  className={`${inputClass} capitalize`}
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Shipping Charge</label>
                <input
                  type="number"
                  name="shippingCharge"
                  value={form.shippingCharge}
                  onChange={handleChange}
                  className={inputClass}
                  min={0}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                Special Instructions
              </label>
              <textarea
                name="specialInstructions"
                value={form.specialInstructions}
                onChange={handleChange}
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || loading || !order}
            className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiSave size={15} />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}