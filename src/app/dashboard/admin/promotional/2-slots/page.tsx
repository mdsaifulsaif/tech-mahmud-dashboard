"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiLayout,
  FiUploadCloud,
  FiImage,
  FiLink,
  FiEdit3,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiExternalLink,
  FiLayers,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import {
  useGetAdminBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  IBanner,
} from "@/redux/api/bannerApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import toast from "react-hot-toast";

type PromoSlot2 = "slot_1" | "slot_2";

interface SlotConfig {
  key: PromoSlot2;
  order: number;
  label: string;
  badge: string;
  recommendedSize: string;
  description: string;
}

const PROMO_2_SLOTS: SlotConfig[] = [
  {
    key: "slot_1",
    order: 1,
    label: "Slot 1: Left Banner",
    badge: "Left Column",
    recommendedSize: "650 × 250 px (Approx 21:9 or 2.6:1 ratio)",
    description: "Positioned on the left side below Trending Now. Fully clickable to category or custom link.",
  },
  {
    key: "slot_2",
    order: 2,
    label: "Slot 2: Right Banner",
    badge: "Right Column",
    recommendedSize: "650 × 250 px (Approx 21:9 or 2.6:1 ratio)",
    description: "Positioned on the right side below Trending Now. Fully clickable to category or custom link.",
  },
];

export default function PromotionalTwoSlotsPage() {
  const { data: response, isLoading, refetch } = useGetAdminBannersQuery();
  const { data: catResponse } = useGetCategoriesQuery({ limit: 100 });
  const categories: any[] = catResponse?.data || [];

  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const allBanners: IBanner[] = response?.data || [];

  // Filter 2-slot promotional banners
  const promoTwoBanners = allBanners.filter(
    (b) =>
      b.placement === "promo_2_slot" ||
      b.placement === "promotional_2" ||
      b.slot === "slot_1" ||
      b.slot === "slot_2" ||
      b.slot === "left_2" ||
      b.slot === "right_2"
  );

  // Map banners to slots
  const getBannerForSlot = (slotKey: PromoSlot2): IBanner | undefined => {
    return promoTwoBanners.find(
      (b) =>
        b.slot === slotKey ||
        (slotKey === "slot_1" && (b.order === 1 || b.slot === "left_2")) ||
        (slotKey === "slot_2" && (b.order === 2 || b.slot === "right_2"))
    );
  };

  const slot1Banner = getBannerForSlot("slot_1");
  const slot2Banner = getBannerForSlot("slot_2");

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<PromoSlot2>("slot_1");
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [linkType, setLinkType] = useState<"category" | "custom">("category");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [customLink, setCustomLink] = useState("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");

  const openConfigModal = (slotKey: PromoSlot2) => {
    setActiveSlot(slotKey);
    const existing = getBannerForSlot(slotKey);

    if (existing) {
      setEditingBanner(existing);
      setTitle(existing.title || "");
      setIsActive(existing.isActive ?? true);
      setImageUrl(existing.image || "");
      setFilePreview(existing.image || "");
      setSelectedFile(null);

      if (existing.categoryID) {
        setLinkType("category");
        const cId = typeof existing.categoryID === "object" ? existing.categoryID._id : existing.categoryID;
        setSelectedCategoryId(cId || "");
        setCustomLink("");
      } else if (existing.link && existing.link.startsWith("/") && categories.some((c) => `/${c.slug}` === existing.link)) {
        setLinkType("category");
        const found = categories.find((c) => `/${c.slug}` === existing.link);
        setSelectedCategoryId(found?._id || "");
        setCustomLink("");
      } else {
        setLinkType("custom");
        setCustomLink(existing.link || "");
        setSelectedCategoryId("");
      }
    } else {
      setEditingBanner(null);
      setTitle("");
      setIsActive(true);
      setImageUrl("");
      setFilePreview("");
      setSelectedFile(null);
      setLinkType("category");
      setSelectedCategoryId("");
      setCustomLink("");
    }

    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !imageUrl.trim() && !editingBanner?.image) {
      toast.error("Please select a banner image file or enter an image URL");
      return;
    }

    // Determine final link and category
    let finalLink = "";
    let finalCatId: string | null = null;
    let finalCatSlug: string = "";

    if (linkType === "category") {
      if (selectedCategoryId) {
        const cat = categories.find((c) => c._id === selectedCategoryId);
        if (cat) {
          finalCatId = cat._id;
          finalCatSlug = cat.slug;
          finalLink = `/${cat.slug}`;
        }
      }
    } else {
      finalLink = customLink.trim();
    }

    const slotConfig = PROMO_2_SLOTS.find((s) => s.key === activeSlot);
    const orderNumber = slotConfig ? slotConfig.order : 1;

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("placement", "promo_2_slot");
      formData.append("slot", activeSlot);
      formData.append("order", String(orderNumber));
      formData.append("isActive", String(isActive));
      formData.append("link", finalLink);

      if (finalCatId) {
        formData.append("categoryID", finalCatId);
      } else {
        formData.append("categoryID", "");
      }
      formData.append("categorySlug", finalCatSlug);

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (imageUrl.trim()) {
        formData.append("image", imageUrl.trim());
      }

      if (editingBanner) {
        await updateBanner({ id: editingBanner._id, data: formData }).unwrap();
        toast.success(`${slotConfig?.label} updated successfully!`);
      } else {
        await createBanner(formData).unwrap();
        toast.success(`${slotConfig?.label} uploaded successfully!`);
      }

      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || err?.message || "Failed to save promotional banner");
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!window.confirm(`Are you sure you want to delete ${label}?`)) return;
    try {
      await deleteBanner(id).unwrap();
      toast.success(`${label} deleted successfully`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete banner");
    }
  };

  const handleToggleStatus = async (banner: IBanner) => {
    try {
      const formData = new FormData();
      formData.append("isActive", String(!banner.isActive));
      await updateBanner({ id: banner._id, data: formData }).unwrap();
      toast.success(`Banner is now ${!banner.isActive ? "Active" : "Inactive"}`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to toggle status");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* ============================================================ */}
      {/* 1. PAGE HEADER                                               */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FiLayout size={22} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Promotional Banners (2 Slots)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-2xl">
            Upload clean campaign banners (no button or title text overlays) displayed directly below the <strong>Trending Now</strong> section on the home page. Each banner is fully clickable to a category or custom link.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-white border border-gray-200 shadow-2xs hover:bg-gray-50 transition"
          >
            <FiExternalLink size={14} />
            <span>View Home Page</span>
          </Link>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. SUB-NAVIGATION TABS                                       */}
      {/* ============================================================ */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        <Link
          href="/dashboard/admin/promotional/2-slots"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-white text-blue-600 shadow-xs transition"
        >
          <span>2 Slots (Below Trending)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700">Active</span>
        </Link>
        <Link
          href="/dashboard/admin/promotional/3-slots"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-white/50 transition"
        >
          <span>3 Slots (Below New Collection)</span>
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 3. INTERACTIVE HOME PAGE PREVIEW                             */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>Home Page Live Preview</span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Position: Below Trending Now Section
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Two equal side-by-side banners. Click &ldquo;Configure&rdquo; to set up or change each slot&apos;s image and destination link.
            </p>
          </div>
          <span className="text-xs text-gray-400 font-medium">Recommended: 650 × 250 px each (21:9 or 2.6:1 ratio)</span>
        </div>

        {/* Dual Banner Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch pt-2">
          {/* ========================================== */}
          {/* SLOT 1 (LEFT)                              */}
          {/* ========================================== */}
          <div className="relative group bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex flex-col justify-between h-[180px] sm:h-[220px] p-4 transition-all hover:border-blue-400">
            {slot1Banner?.image ? (
              <img
                src={slot1Banner.image}
                alt={slot1Banner.title || "Slot 1 Left Banner"}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-102 transition duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                <FiUploadCloud size={32} className="text-gray-300 mb-1.5" />
                <span className="text-xs font-bold text-gray-700">Slot 1: Left Banner</span>
                <span className="text-[11px] text-gray-400 mt-0.5">Recommended: ~650 × 250 px (21:9)</span>
              </div>
            )}

            {/* Top badges */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs shadow-xs">
                Slot 1: Left Banner
              </span>
              {slot1Banner && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    slot1Banner.isActive
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {slot1Banner.isActive ? "Active" : "Inactive"}
                </span>
              )}
            </div>

            {/* Bottom info & actions */}
            <div className="relative z-10 pt-4 mt-auto flex items-center justify-between gap-3">
              <div className="min-w-0">
                {slot1Banner?.link ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/75 text-white text-[11px] font-bold truncate backdrop-blur-xs">
                    <FiLink size={12} className="text-blue-400 shrink-0" />
                    <span className="truncate max-w-[200px]">{slot1Banner.link}</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-gray-500 font-bold bg-white/80 px-2.5 py-1 rounded-lg">
                    No Link Assigned
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => openConfigModal("slot_1")}
                className="shrink-0 py-2 px-3.5 rounded-xl bg-white hover:bg-blue-600 text-gray-900 hover:text-white text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <FiEdit3 size={13} />
                <span>{slot1Banner ? "Configure" : "Upload Banner"}</span>
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* SLOT 2 (RIGHT)                             */}
          {/* ========================================== */}
          <div className="relative group bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex flex-col justify-between h-[180px] sm:h-[220px] p-4 transition-all hover:border-blue-400">
            {slot2Banner?.image ? (
              <img
                src={slot2Banner.image}
                alt={slot2Banner.title || "Slot 2 Right Banner"}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-102 transition duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                <FiUploadCloud size={32} className="text-gray-300 mb-1.5" />
                <span className="text-xs font-bold text-gray-700">Slot 2: Right Banner</span>
                <span className="text-[11px] text-gray-400 mt-0.5">Recommended: ~650 × 250 px (21:9)</span>
              </div>
            )}

            {/* Top badges */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs shadow-xs">
                Slot 2: Right Banner
              </span>
              {slot2Banner && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    slot2Banner.isActive
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {slot2Banner.isActive ? "Active" : "Inactive"}
                </span>
              )}
            </div>

            {/* Bottom info & actions */}
            <div className="relative z-10 pt-4 mt-auto flex items-center justify-between gap-3">
              <div className="min-w-0">
                {slot2Banner?.link ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/75 text-white text-[11px] font-bold truncate backdrop-blur-xs">
                    <FiLink size={12} className="text-blue-400 shrink-0" />
                    <span className="truncate max-w-[200px]">{slot2Banner.link}</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-gray-500 font-bold bg-white/80 px-2.5 py-1 rounded-lg">
                    No Link Assigned
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => openConfigModal("slot_2")}
                className="shrink-0 py-2 px-3.5 rounded-xl bg-white hover:bg-blue-600 text-gray-900 hover:text-white text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <FiEdit3 size={13} />
                <span>{slot2Banner ? "Configure" : "Upload Banner"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. SLOTS MANAGEMENT TABLE                                    */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Slot Configurations (2 Slots)</h3>
            <p className="text-xs text-gray-500">
              Direct overview of both campaign dual-banner slots positioned below Trending Now.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 w-fit">
            2 Slots Configured
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Slot Name</th>
                <th className="py-3 px-4">Banner Preview</th>
                <th className="py-3 px-4">Destination Link</th>
                <th className="py-3 px-4">Recommended Size</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {PROMO_2_SLOTS.map((slot) => {
                const banner = getBannerForSlot(slot.key);
                return (
                  <tr key={slot.key} className="hover:bg-gray-50/50 transition">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <div>{slot.label}</div>
                      <span className="text-[11px] font-medium text-gray-400">{slot.badge}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {banner?.image ? (
                        <div className="relative w-28 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                          <img
                            src={banner.image}
                            alt={banner.title || slot.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 font-semibold">
                          <FiImage size={12} /> No banner uploaded
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {banner?.link ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">
                            <FiLink size={11} /> {banner.link}
                          </span>
                          {banner.categorySlug && (
                            <span className="text-[10px] text-gray-400">Category: {banner.categorySlug}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No link configured</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                      {slot.recommendedSize}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {banner ? (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(banner)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                            banner.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          {banner.isActive ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}
                          <span>{banner.isActive ? "Active" : "Inactive"}</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openConfigModal(slot.key)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition cursor-pointer"
                      >
                        <FiEdit3 size={13} />
                        <span>Configure</span>
                      </button>
                      {banner && (
                        <button
                          type="button"
                          onClick={() => handleDelete(banner._id, slot.label)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition cursor-pointer"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. CONFIGURATION MODAL                                       */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-600">
                  {PROMO_2_SLOTS.find((s) => s.key === activeSlot)?.badge}
                </span>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                  {PROMO_2_SLOTS.find((s) => s.key === activeSlot)?.label}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              {/* Banner Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Banner Title (Internal / Alt text)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Exclusive Gadget Campaign 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>

              {/* Banner Image Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700">
                    Banner Graphic Image <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-gray-400">
                    {PROMO_2_SLOTS.find((s) => s.key === activeSlot)?.recommendedSize}
                  </span>
                </div>

                {/* Upload or Drop File */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-400 transition bg-gray-50/50">
                  <input
                    type="file"
                    id="promo2BannerFileInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="promo2BannerFileInput"
                    className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                  >
                    <FiUploadCloud size={30} className="text-blue-500" />
                    <span className="text-xs font-bold text-gray-700">
                      Click to upload banner image
                    </span>
                    <span className="text-[11px] text-gray-400">
                      JPG, PNG, WebP supported. High resolution banner graphics without buttons.
                    </span>
                  </label>
                </div>

                {/* Or Image URL */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Or provide an external Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (e.target.value) setFilePreview(e.target.value);
                    }}
                    placeholder="https://example.com/promo-banner.jpg"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                {/* Live Preview of Selected Image */}
                {filePreview && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                      Selected Banner Preview
                    </span>
                    <div className="relative w-full h-36 rounded-lg overflow-hidden border border-gray-200 bg-white">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Destination Link Selection */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700">
                  Click Destination (Category or Custom URL)
                </label>

                {/* Radio selection */}
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
                      linkType === "category"
                        ? "border-blue-500 bg-blue-50/50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="promo2LinkType"
                      checked={linkType === "category"}
                      onChange={() => setLinkType("category")}
                      className="text-blue-600 focus:ring-0"
                    />
                    <FiLayers size={14} />
                    <span>Category Route</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
                      linkType === "custom"
                        ? "border-blue-500 bg-blue-50/50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="promo2LinkType"
                      checked={linkType === "custom"}
                      onChange={() => setLinkType("custom")}
                      className="text-blue-600 focus:ring-0"
                    />
                    <FiLink size={14} />
                    <span>Custom URL / Link</span>
                  </label>
                </div>

                {/* Category Dropdown */}
                {linkType === "category" && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Select Target Category
                    </label>
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    >
                      <option value="">-- Choose Category --</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name} (/{cat.slug})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Custom Link Input */}
                {linkType === "custom" && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Enter Custom Link URL (Internal or External)
                    </label>
                    <input
                      type="text"
                      value={customLink}
                      onChange={(e) => setCustomLink(e.target.value)}
                      placeholder="e.g. /shop or https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    />
                  </div>
                )}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <span className="text-xs font-bold text-gray-800 block">Banner Active Status</span>
                  <span className="text-[11px] text-gray-400">
                    If inactive, this slot will show fallback campaign visuals.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {(isCreating || isUpdating) ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={14} />
                      <span>Save Banner</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
