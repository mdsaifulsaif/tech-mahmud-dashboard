"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FiSave,
  FiPlus,
  FiTrash2,
  FiBox,
  FiArrowLeft,
  FiImage,
  FiUploadCloud,
  FiCheckCircle,
  FiRepeat,
  FiShoppingBag,
  FiStar,
  FiInfo,
  FiX,
  FiLayers,
  FiTag,
  FiCalendar,
} from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  useUploadPackageImageMutation,
  useGetPackageCategoriesQuery,
} from "@/redux/api/subscriptionApi";

interface PackageFormProps {
  initialData?: any;
  onSubmit: (formData: any) => Promise<void>;
  isLoading?: boolean;
  isEdit?: boolean;
}

export default function PackageForm({
  initialData,
  onSubmit,
  isLoading = false,
  isEdit = false,
}: PackageFormProps) {
  const router = useRouter();
  const [uploadImage, { isLoading: isUploadingImage }] = useUploadPackageImageMutation();
  const { data: categoriesRes } = useGetPackageCategoriesQuery();

  const defaultCategories = [
    "Household & Cleaning",
    "Weekly Fresh Vegetables",
    "Monthly Grocery & Staples",
    "Office Essentials",
    "Organic Fruits",
    "Meat & Fish",
  ];

  const availableCategories = useMemo(() => {
    if (categoriesRes?.data && Array.isArray(categoriesRes.data)) {
      return Array.from(new Set([...defaultCategories, ...categoriesRes.data]));
    }
    return defaultCategories;
  }, [categoriesRes]);

  const initialCat = initialData?.category || (initialData?.boxType === "vegetable" ? "Weekly Fresh Vegetables" : "Household & Cleaning");
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(
    Boolean(initialData?.category && !defaultCategories.includes(initialData.category))
  );

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    boxType: initialData?.boxType || "cleaning",
    category: initialCat,
    frequency: initialData?.frequency || "monthly",
    frequencyText: initialData?.frequencyText || (initialData?.frequency === "weekly" ? "Every Week (1x)" : "Every Month (1x)"),
    badge: initialData?.badge || "Popular Choice",
    thumbnail: initialData?.thumbnail || "/images/monthly_cleaning_box.jpg",
    regularPrice: initialData?.regularPrice || 950,
    subscriptionPrice: initialData?.subscriptionPrice || 875,
    idealFor: initialData?.idealFor || "Ideal for 3–4 member households",
    shortDescription: initialData?.shortDescription || "Monthly doorstep delivery of all essential cleaning supplies.",
    description: initialData?.description || "",
    isPinnedToHome: initialData?.isPinnedToHome !== undefined ? initialData.isPinnedToHome : true,
    sortOrder: initialData?.sortOrder || 1,
    status: initialData?.status || "active",
    allowOneTimePurchase: initialData?.allowOneTimePurchase !== undefined ? initialData.allowOneTimePurchase : true,
    items: initialData?.items && initialData.items.length > 0
      ? initialData.items
      : [
          { itemName: "Surf Excel / Wheel Detergent", quantity: "1 KG" },
          { itemName: "Harpic Toilet Cleaner", quantity: "750 ML" },
          { itemName: "Vim Dishwash Liquid", quantity: "500 ML" },
          { itemName: "Dettol / Lifebuoy Bath Soap", quantity: "2 Pcs" },
          { itemName: "Colgate Toothpaste", quantity: "120 GM" },
        ],
  });

  const [imagePreview, setImagePreview] = useState<string>(
    initialData?.thumbnail || "/images/monthly_cleaning_box.jpg"
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev: any) => ({
      ...prev,
      name: val,
      slug: !isEdit
        ? val
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
        : prev.slug,
    }));
  };

  const handleFrequencyChange = (freq: string) => {
    setFormData((prev: any) => ({
      ...prev,
      frequency: freq,
      frequencyText: freq === "weekly" ? "Every Week (1x)" : "Every Month (1x)",
    }));
  };

  const handleAddItem = () => {
    setFormData((prev: any) => ({
      ...prev,
      items: [...prev.items, { itemName: "", quantity: "" }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      items: prev.items.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: "itemName" | "quantity", val: string) => {
    setFormData((prev: any) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, items: updated };
    });
  };

  // Direct Cloudinary Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload a valid image file (PNG, JPG, WebP)");
    }

    // Local preview immediately
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    // Upload to Cloudinary via backend
    const uploadToast = toast.loading("Uploading image to Cloudinary...");
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await uploadImage(data).unwrap();

      if (res?.data?.url) {
        setFormData((prev: any) => ({ ...prev, thumbnail: res.data.url }));
        setImagePreview(res.data.url);
        toast.success("Image uploaded to Cloudinary successfully!", { id: uploadToast });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to upload image to Cloudinary", { id: uploadToast });
    }
  };

  const calculatedDiscount =
    formData.regularPrice && formData.subscriptionPrice
      ? Math.max(
          0,
          Math.round(
            ((Number(formData.regularPrice) - Number(formData.subscriptionPrice)) /
              Number(formData.regularPrice)) *
              100
          )
        )
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return toast.error("Package name is required");
    }
    if (!formData.regularPrice || !formData.subscriptionPrice) {
      return toast.error("Regular price and subscription price are required");
    }
    if (!formData.thumbnail) {
      return toast.error("Please upload a thumbnail image");
    }

    const cleanedItems = formData.items.filter((it: any) => it.itemName.trim() !== "");

    const payload = {
      ...formData,
      regularPrice: Number(formData.regularPrice),
      subscriptionPrice: Number(formData.subscriptionPrice),
      sortOrder: Number(formData.sortOrder) || 0,
      discountPercent: calculatedDiscount,
      items: cleanedItems,
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      // handled in parent
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <Link
          href="/dashboard/admin/subscriptions/packages"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#2563EB] transition-colors"
        >
          <FiArrowLeft size={16} /> Back to Package List
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/admin/subscriptions/packages"
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-sm transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading || isUploadingImage}
            className="inline-flex items-center gap-2 px-7 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-sm shadow-md shadow-[#2563EB]/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            <FiSave size={18} />
            {isLoading ? "Saving Package..." : isEdit ? "Update Package" : "Publish Package"}
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Grid (Full Width) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        {/* Left Columns: Form Fields (7 Columns on large screens) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. General Information Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <span className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                <FiBox size={18} />
              </span>
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">General Information</h3>
                <p className="text-xs text-gray-400">Basic identification and categorization of the subscription box</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Package Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="e.g. Family Basic Hygiene Box"
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#2563EB] transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Package Slug (URL Key)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((p: any) => ({ ...p, slug: e.target.value }))}
                  placeholder="e.g. family-basic-hygiene-box"
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-mono text-gray-600 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Box Category
                  </label>
                  {!isCustomCategory && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(true);
                        setFormData((p: any) => ({ ...p, category: "", boxType: "custom" }));
                      }}
                      className="text-[11px] text-[#2563EB] hover:text-[#1D4ED8] font-bold cursor-pointer"
                    >
                      + Add New Category
                    </button>
                  )}
                </div>

                {!isCustomCategory ? (
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "__custom__") {
                        setIsCustomCategory(true);
                        setFormData((p: any) => ({ ...p, category: "", boxType: "custom" }));
                      } else {
                        const slugType = val.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                        setFormData((p: any) => ({ ...p, category: val, boxType: slugType }));
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#2563EB]"
                  >
                    {availableCategories.map((cat: string) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__custom__">+ Enter Custom Category...</option>
                  </select>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.category}
                        autoFocus
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData((p: any) => ({
                            ...p,
                            category: val,
                            boxType: val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") || "custom",
                          }));
                        }}
                        placeholder="e.g. Baby Care Box, Fitness Nutrition, Ramadan Pack..."
                        className="flex-1 px-4 py-2.5 bg-white border border-[#2563EB] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomCategory(false);
                          setFormData((p: any) => ({
                            ...p,
                            category: "Household & Cleaning",
                            boxType: "cleaning",
                          }));
                        }}
                        className="px-3 py-2.5 text-xs text-gray-500 hover:text-gray-700 bg-gray-100 rounded-xl font-medium cursor-pointer"
                      >
                        Select from list
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Type any custom category name. It will be saved and can be reused anytime.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Delivery Schedule
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => handleFrequencyChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="monthly">Monthly Cycle (1 Delivery / Month)</option>
                  <option value="weekly">Weekly Cycle (1 Delivery / Week)</option>
                  <option value="both">Both (User Choice)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Frequency Badge Label
                </label>
                <input
                  type="text"
                  value={formData.frequencyText}
                  onChange={(e) => setFormData((p: any) => ({ ...p, frequencyText: e.target.value }))}
                  placeholder="e.g. Every Month (1x)"
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Promotional Tag / Badge
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData((p: any) => ({ ...p, badge: e.target.value }))}
                  placeholder="e.g. Popular Choice, 10% Off"
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Target Audience / Subtitle
                </label>
                <input
                  type="text"
                  value={formData.idealFor}
                  onChange={(e) => setFormData((p: any) => ({ ...p, idealFor: e.target.value }))}
                  placeholder="e.g. Ideal for 3–4 member households"
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Short Overview / Benefits
              </label>
              <textarea
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData((p: any) => ({ ...p, shortDescription: e.target.value }))}
                placeholder="Brief summary explaining what makes this package convenient and cost-saving..."
                className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* 2. Direct Cloudinary Image Upload Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <span className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                <FiImage size={18} />
              </span>
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">Media & Thumbnail</h3>
                <p className="text-xs text-gray-400">Upload package cover image directly to Cloudinary</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative border-2 border-dashed border-gray-200 hover:border-[#2563EB] rounded-2xl p-6 text-center bg-gray-50/50 hover:bg-[#2563EB]/5 transition-all cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  disabled={isUploadingImage}
                />
                <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-gray-200 flex items-center justify-center text-[#2563EB] group-hover:scale-110 transition-transform">
                    <FiUploadCloud size={24} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-800 block">
                      {isUploadingImage ? "Uploading to Cloudinary..." : "Click or Drag & Drop image here"}
                    </span>
                    <span className="text-xs text-gray-400">
                      Supports JPG, PNG, WebP (Square or 16:9 ratio recommended)
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Image Thumbnail preview */}
              {imagePreview && (
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Uploaded preview"
                      className="w-14 h-14 object-cover rounded-lg border border-gray-200 bg-white"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Current Thumbnail</span>
                      <span className="text-[11px] text-[#2563EB] font-mono break-all line-clamp-1 max-w-sm">
                        {formData.thumbnail}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md">
                    Ready
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 3. Included Items Builder (Flexible Quantities) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                  <FiLayers size={18} />
                </span>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">Package Included Items</h3>
                  <p className="text-xs text-gray-400">
                    Add individual items. Quantity is optional (leave blank for flexible items)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB]/10 hover:bg-[#2563EB]/20 text-[#2563EB] rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                <FiPlus size={15} /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2 bg-gray-50/80 border border-gray-200/70 rounded-xl group hover:border-[#2563EB]/50 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Item name (e.g. Surf Excel Detergent)"
                      value={item.itemName}
                      onChange={(e) => handleItemChange(idx, "itemName", e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#2563EB]"
                      required
                    />
                  </div>
                  <div className="w-36">
                    <input
                      type="text"
                      placeholder="Qty (e.g. 1 KG)"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    title="Remove Item"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}

              {formData.items.length === 0 && (
                <div className="p-6 text-center text-gray-400 text-xs border border-dashed border-gray-200 rounded-xl">
                  No items added yet. Click "+ Add Item" to list products included in this box.
                </div>
              )}
            </div>
          </div>

          {/* 4. Pricing & Visibility */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <span className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
                <FiTag size={18} />
              </span>
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">Pricing & Visibility Control</h3>
                <p className="text-xs text-gray-400">Define subscriber pricing, discounts and homepage pinning</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Regular Price (One-time Buy) ৳ <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.regularPrice}
                  onChange={(e) => setFormData((p: any) => ({ ...p, regularPrice: e.target.value }))}
                  placeholder="950"
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold text-gray-800 focus:bg-white focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Subscription Price (Recurring) ৳ <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.subscriptionPrice}
                  onChange={(e) => setFormData((p: any) => ({ ...p, subscriptionPrice: e.target.value }))}
                  placeholder="875"
                  className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold text-[#2563EB] focus:bg-white focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>
            </div>

            {/* Calculated Discount highlight */}
            <div className="p-3.5 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-xl flex items-center justify-between text-xs font-bold text-[#2563EB]">
              <span className="flex items-center gap-1.5">
                <FiInfo /> Subscriber Discount Calculated:
              </span>
              <span className="text-base font-black bg-white px-2.5 py-0.5 rounded-lg border border-[#2563EB]/20 shadow-2xs">
                {calculatedDiscount}% OFF + FREE DELIVERY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Pin to Home Switch */}
              <label className="flex items-center justify-between p-3.5 bg-purple-50/80 border border-purple-200 rounded-xl cursor-pointer hover:bg-purple-100/50 transition-colors">
                <div>
                  <span className="text-xs font-black text-purple-900 block flex items-center gap-1">
                    <FiStar className="fill-purple-600 text-purple-600" size={13} />
                    Pin to Homepage
                  </span>
                  <span className="text-[10px] text-purple-700">Display on Home package section</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isPinnedToHome}
                  onChange={(e) => setFormData((p: any) => ({ ...p, isPinnedToHome: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                />
              </label>

              {/* Sort Order */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Display Priority (Sort Order)
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData((p: any) => ({ ...p, sortOrder: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Publish Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((p: any) => ({ ...p, status: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Sticky Real-time Customer Live Preview (5 Columns on large screens) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-md">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse"></span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                  Live Customer Preview
                </span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                Website View
              </span>
            </div>

            {/* Render Exact Card Simulation */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group hover:border-[#2563EB] transition-all">
              {/* Banner */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                <img
                  src={imagePreview || "/images/monthly_cleaning_box.jpg"}
                  alt={formData.name || "Package"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"></div>

                {/* Badge */}
                {formData.badge && (
                  <span className="absolute top-3 left-3 bg-[#2563EB] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md">
                    {formData.badge}
                  </span>
                )}

                {/* Frequency Pill */}
                <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#2563EB] text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <FiRepeat size={11} /> {formData.frequencyText}
                </span>

                {/* Bottom title */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 block">
                    {formData.category || formData.idealFor || "General Household"}
                  </span>
                  <h3 className="text-base sm:text-lg font-black line-clamp-1">
                    {formData.name || "Untitled Package Box"}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Items checklist */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Included in this box:
                    </p>
                    <span className="text-[11px] text-[#2563EB] font-bold">
                      {formData.items.filter((it: any) => it.itemName.trim() !== "").length} items
                    </span>
                  </div>

                  <ul className="space-y-1.5">
                    {formData.items
                      .filter((it: any) => it.itemName.trim() !== "")
                      .slice(0, 5)
                      .map((item: any, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                          <FiCheckCircle className="text-[#2563EB] shrink-0 mt-0.5 text-xs" />
                          <span className="line-clamp-1">
                            {item.itemName} {item.quantity ? `(${item.quantity})` : ""}
                          </span>
                        </li>
                      ))}

                    {formData.items.filter((it: any) => it.itemName.trim() !== "").length > 5 && (
                      <li className="text-[11px] text-[#2563EB] font-bold pl-4">
                        + {formData.items.filter((it: any) => it.itemName.trim() !== "").length - 5} more items in full box
                      </li>
                    )}
                  </ul>
                </div>

                {/* Pricing Strip */}
                <div className="bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-2xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Subscription Price</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-[#2563EB]">
                        ৳{formData.subscriptionPrice || 0}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ৳{formData.regularPrice || 0}
                      </span>
                    </div>
                  </div>
                  <span className="bg-[#2563EB] text-white text-xs font-extrabold px-2.5 py-1 rounded-xl shadow-xs">
                    {calculatedDiscount}% OFF + FREE DELIVERY
                  </span>
                </div>

                {/* Action buttons preview */}
                <div className="grid grid-cols-2 gap-2 pt-1 pointer-events-none opacity-90">
                  <div className="py-2.5 px-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs">
                    <FiShoppingBag size={14} />
                    <span>Buy Once</span>
                  </div>
                  <div className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#76b533] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#2563EB]/20">
                    <FiRepeat size={14} />
                    <span>Subscribe</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick status notes */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FiStar className={formData.isPinnedToHome ? "text-purple-600 fill-purple-600" : "text-gray-300"} size={14} />
                {formData.isPinnedToHome ? "Featured on Homepage" : "Not Pinned"}
              </span>
              <span className={`font-bold capitalize ${formData.status === "active" ? "text-emerald-600" : "text-gray-400"}`}>
                ● {formData.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
