"use client";

import React, { useState, useEffect } from "react";
import {
  FiTruck,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiPackage,
  FiCheckCircle,
  FiInfo,
  FiSave,
  FiRefreshCw,
  FiShield,
  FiHome,
} from "react-icons/fi";
import {
  useGetDeliverySettingsQuery,
  useUpdateDeliverySettingsMutation,
} from "@/redux/api/shippingApi";
import toast from "react-hot-toast";

const BANGLADESH_DIVISIONS = [
  "Barisal",
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Rangpur",
  "Mymensingh",
  "Sylhet",
];

export default function ShippingManagementPage() {
  const { data: settingsData, isLoading, refetch } =
    useGetDeliverySettingsQuery(undefined);
  const [updateDeliverySettings, { isLoading: isSaving }] =
    useUpdateDeliverySettingsMutation();

  const [formData, setFormData] = useState({
    baseLocation: "Barisal",
    insideCharge: 60,
    outsideCharge: 150,
    insideEstimatedDays: "24 - 48 Hours",
    outsideEstimatedDays: "2 - 4 Days",
    isFreeShippingActive: false,
    freeShippingMinAmount: 2000,
    isStorePickupActive: true,
    storePickupAddress: "Tech Mahmud Main Store, Sadar Road, Barisal",
    storePickupCharge: 0,
  });

  useEffect(() => {
    if (settingsData?.data) {
      setFormData({
        baseLocation: settingsData.data.baseLocation || "Barisal",
        insideCharge: settingsData.data.insideCharge ?? 60,
        outsideCharge: settingsData.data.outsideCharge ?? 150,
        insideEstimatedDays:
          settingsData.data.insideEstimatedDays || "24 - 48 Hours",
        outsideEstimatedDays:
          settingsData.data.outsideEstimatedDays || "2 - 4 Days",
        isFreeShippingActive: Boolean(settingsData.data.isFreeShippingActive),
        freeShippingMinAmount: settingsData.data.freeShippingMinAmount ?? 2000,
        isStorePickupActive:
          settingsData.data.isStorePickupActive !== undefined
            ? Boolean(settingsData.data.isStorePickupActive)
            : true,
        storePickupAddress:
          settingsData.data.storePickupAddress ||
          "Tech Mahmud Main Store, Sadar Road, Barisal",
        storePickupCharge: settingsData.data.storePickupCharge ?? 0,
      });
    }
  }, [settingsData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDeliverySettings(formData).unwrap();
      toast.success("Delivery & shipping settings updated successfully! 🚀");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update shipping settings");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-blue-50 text-[#2563EB]">
              <FiTruck size={22} />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Delivery & Shipping Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Set base city/division location, inside city delivery charge, and nationwide courier delivery rate.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition self-start md:self-auto"
        >
          <FiRefreshCw className={isLoading ? "animate-spin" : ""} size={14} />
          <span>Reload</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Base Location Selection */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <FiMapPin className="text-[#2563EB]" size={18} />
              <h2 className="text-base font-bold text-gray-900">
                1. Base Division / City (আপনার ব্যবসার প্রধান শহর/বিভাগ)
              </h2>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              যে জেলা বা বিভাগে আপনার মূল হাব/অফিস অবস্থিত। গ্রাহকের ঠিকানা এই বেস সিটির মধ্যে হলে লোকাল ডেলিভারি চার্জ প্রযোজ্য হবে, অন্যথায় সারা বাংলাদেশ আউটসাইড ডেলিভারি রেট প্রযোজ্য হবে।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Select Base Division
                </label>
                <select
                  name="baseLocation"
                  value={formData.baseLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                >
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div} Division
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Custom Base City / District Name
                </label>
                <input
                  type="text"
                  name="baseLocation"
                  value={formData.baseLocation}
                  onChange={handleChange}
                  placeholder="e.g. Barisal, Dhaka, etc."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Inside vs Outside Delivery Charges */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <FiDollarSign className="text-emerald-600" size={18} />
              <h2 className="text-base font-bold text-gray-900">
                2. Delivery Charges & Timelines (ডেলিভারি চার্জ ও সময়সীমা)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Inside Base City */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Inside {formData.baseLocation}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    Local Rate
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Delivery Charge (৳)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-sm">৳</span>
                    <input
                      type="number"
                      name="insideCharge"
                      value={formData.insideCharge}
                      onChange={handleChange}
                      min={0}
                      className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-black text-gray-900 focus:outline-none focus:border-[#2563EB]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    name="insideEstimatedDays"
                    value={formData.insideEstimatedDays}
                    onChange={handleChange}
                    placeholder="e.g. 24 - 48 Hours"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Outside Base City */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Outside {formData.baseLocation}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-800">
                    Nationwide
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Delivery Charge (৳)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-sm">৳</span>
                    <input
                      type="number"
                      name="outsideCharge"
                      value={formData.outsideCharge}
                      onChange={handleChange}
                      min={0}
                      className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-black text-gray-900 focus:outline-none focus:border-[#2563EB]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    name="outsideEstimatedDays"
                    value={formData.outsideEstimatedDays}
                    onChange={handleChange}
                    placeholder="e.g. 2 - 4 Days"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Free Shipping & Store Pickup */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <FiPackage className="text-amber-500" size={18} />
              <h2 className="text-base font-bold text-gray-900">
                3. Additional Options (ফ্রি ডেলিভারি ও স্টোর পিকআপ)
              </h2>
            </div>

            {/* Free Shipping Toggle */}
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-bold text-gray-900 block">
                    Free Delivery Threshold
                  </span>
                  <span className="text-xs text-gray-500">
                    নির্দিষ্ট পরিমাণের বেশি মূল্যের অর্ডারে স্বয়ংক্রিয়ভাবে ডেলিভারি চার্জ ফ্রি হবে।
                  </span>
                </div>
                <input
                  type="checkbox"
                  name="isFreeShippingActive"
                  checked={formData.isFreeShippingActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#2563EB] rounded focus:ring-0 cursor-pointer"
                />
              </label>

              {formData.isFreeShippingActive && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Minimum Order Amount for Free Shipping (৳)
                  </label>
                  <input
                    type="number"
                    name="freeShippingMinAmount"
                    value={formData.freeShippingMinAmount}
                    onChange={handleChange}
                    min={0}
                    className="w-full max-w-xs px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-800 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              )}
            </div>

            {/* Store Pickup Toggle */}
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-bold text-gray-900 block">
                    Store / Outlet Pickup
                  </span>
                  <span className="text-xs text-gray-500">
                    গ্রাহক সরাসরি আপনার আউটলেট/দোকান থেকে ফ্রি ডেলিভারিতে পণ্য সংগ্রহ করতে পারবে।
                  </span>
                </div>
                <input
                  type="checkbox"
                  name="isStorePickupActive"
                  checked={formData.isStorePickupActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#2563EB] rounded focus:ring-0 cursor-pointer"
                />
              </label>

              {formData.isStorePickupActive && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Store Pickup Address / Instruction
                  </label>
                  <input
                    type="text"
                    name="storePickupAddress"
                    value={formData.storePickupAddress}
                    onChange={handleChange}
                    placeholder="e.g. Tech Mahmud Main Store, Sadar Road, Barisal"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition disabled:opacity-50"
            >
              <FiSave size={16} />
              <span>{isSaving ? "Saving Settings..." : "Save Delivery Settings"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Customer Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs sticky top-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <FiInfo className="text-[#2563EB]" /> Live Customer Checkout Preview
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1">
                <span className="font-bold text-blue-900 block">
                  📍 Active Base Location:
                </span>
                <span className="text-sm font-black text-[#2563EB]">
                  {formData.baseLocation}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">
                    Inside {formData.baseLocation}:
                  </span>
                  <span className="font-bold text-gray-900 text-sm">
                    ৳{formData.insideCharge}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 flex items-center gap-1">
                  <FiClock size={12} /> {formData.insideEstimatedDays}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">
                    Outside {formData.baseLocation}:
                  </span>
                  <span className="font-bold text-gray-900 text-sm">
                    ৳{formData.outsideCharge}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 flex items-center gap-1">
                  <FiClock size={12} /> {formData.outsideEstimatedDays}
                </div>
              </div>

              {formData.isStorePickupActive && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-900">
                      Store Pickup:
                    </span>
                    <span className="font-black text-emerald-700 text-sm">
                      FREE (৳0)
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-800 line-clamp-2">
                    {formData.storePickupAddress}
                  </div>
                </div>
              )}

              {formData.isFreeShippingActive && (
                <div className="p-3 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                  🎉 Free delivery on orders over ৳{formData.freeShippingMinAmount.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
