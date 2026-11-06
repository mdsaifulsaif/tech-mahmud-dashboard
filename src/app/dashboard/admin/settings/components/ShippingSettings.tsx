"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiTruck, FiMapPin, FiExternalLink, FiDollarSign, FiClock, FiPackage } from "react-icons/fi";
import {
  useGetDeliverySettingsQuery,
  useUpdateDeliverySettingsMutation,
} from "@/redux/api/shippingApi";
import toast from "react-hot-toast";

export const ShippingSettings = () => {
  const { data: settingsData, isLoading, refetch } = useGetDeliverySettingsQuery(undefined);
  const [updateDeliverySettings, { isLoading: isUpdating }] = useUpdateDeliverySettingsMutation();

  const [form, setForm] = useState({
    baseLocation: "Barisal",
    insideCharge: 60,
    outsideCharge: 150,
    insideEstimatedDays: "24 - 48 Hours",
    outsideEstimatedDays: "2 - 4 Days",
    isFreeShippingActive: false,
    freeShippingMinAmount: 2000,
    isStorePickupActive: true,
    storePickupAddress: "Tech Mahmud Main Store, Sadar Road, Barisal",
  });

  useEffect(() => {
    if (settingsData?.data) {
      setForm({
        baseLocation: settingsData.data.baseLocation || "Barisal",
        insideCharge: settingsData.data.insideCharge ?? 60,
        outsideCharge: settingsData.data.outsideCharge ?? 150,
        insideEstimatedDays: settingsData.data.insideEstimatedDays || "24 - 48 Hours",
        outsideEstimatedDays: settingsData.data.outsideEstimatedDays || "2 - 4 Days",
        isFreeShippingActive: Boolean(settingsData.data.isFreeShippingActive),
        freeShippingMinAmount: settingsData.data.freeShippingMinAmount ?? 2000,
        isStorePickupActive: settingsData.data.isStorePickupActive !== undefined ? Boolean(settingsData.data.isStorePickupActive) : true,
        storePickupAddress: settingsData.data.storePickupAddress || "Tech Mahmud Main Store, Sadar Road, Barisal",
      });
    }
  }, [settingsData]);

  const handleSave = async () => {
    try {
      await updateDeliverySettings(form).unwrap();
      toast.success("Shipping settings saved successfully! 🚀");
      refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to save settings");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-center gap-3">
          <FiTruck className="text-[#2563EB]" size={20} />
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              Active Delivery Architecture: Base City / Division
            </h4>
            <p className="text-xs text-gray-600">
              Inside base location = Local Rate (৳{form.insideCharge}), Outside = Nationwide (৳{form.outsideCharge}).
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/admin/shipping"
          className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
        >
          Open Full Shipping Manager <FiExternalLink size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Base Location */}
        <div className="border border-gray-100 rounded-2xl p-5 bg-white space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <FiMapPin className="text-[#2563EB]" /> Base City / Division
          </label>
          <input
            type="text"
            value={form.baseLocation}
            onChange={(e) => setForm({ ...form, baseLocation: e.target.value })}
            placeholder="e.g. Barisal or Dhaka"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-[#2563EB]"
          />
          <p className="text-[11px] text-gray-500">
            Customers in this location pay local delivery fee.
          </p>
        </div>

        {/* Free Shipping */}
        <div className="border border-gray-100 rounded-2xl p-5 bg-white space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <FiPackage className="text-amber-500" /> Free Shipping Threshold
            </span>
            <input
              type="checkbox"
              checked={form.isFreeShippingActive}
              onChange={(e) => setForm({ ...form, isFreeShippingActive: e.target.checked })}
              className="w-4 h-4 text-[#2563EB]"
            />
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-sm">৳</span>
            <input
              type="number"
              disabled={!form.isFreeShippingActive}
              value={form.freeShippingMinAmount}
              onChange={(e) => setForm({ ...form, freeShippingMinAmount: Number(e.target.value) })}
              className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 disabled:opacity-40"
            />
          </div>
        </div>

        {/* Inside Charge */}
        <div className="border border-blue-100 rounded-2xl p-5 bg-blue-50/40 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-blue-900">
            Inside {form.baseLocation} Delivery (৳)
          </label>
          <input
            type="number"
            value={form.insideCharge}
            onChange={(e) => setForm({ ...form, insideCharge: Number(e.target.value) })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-base font-black text-gray-900"
          />
          <input
            type="text"
            value={form.insideEstimatedDays}
            onChange={(e) => setForm({ ...form, insideEstimatedDays: e.target.value })}
            placeholder="Timeline: e.g. 24 - 48 Hours"
            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700"
          />
        </div>

        {/* Outside Charge */}
        <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-800">
            Outside {form.baseLocation} (Nationwide) (৳)
          </label>
          <input
            type="number"
            value={form.outsideCharge}
            onChange={(e) => setForm({ ...form, outsideCharge: Number(e.target.value) })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-base font-black text-gray-900"
          />
          <input
            type="text"
            value={form.outsideEstimatedDays}
            onChange={(e) => setForm({ ...form, outsideEstimatedDays: e.target.value })}
            placeholder="Timeline: e.g. 2 - 4 Days"
            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isUpdating || isLoading}
          className="px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
        >
          {isUpdating ? "Saving..." : "Save Delivery Settings"}
        </button>
      </div>
    </div>
  );
};
