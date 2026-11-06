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
  FiCheck,
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

type PromoSlot = "left" | "right_top" | "right_bottom_left" | "right_bottom_right";

interface SlotConfig {
  key: PromoSlot;
  order: number;
  label: string;
  badge: string;
  recommendedSize: string;
  description: string;
  fallbackImage: string;
}

const PROMO_SLOTS: SlotConfig[] = [
  {
    key: "left",
    order: 1,
    label: "Left Banner (Tall)",
    badge: "Column 1 (Full Height)",
    recommendedSize: "Height: 744px (e.g. 600 × 744 px)",
    description: "Featured on the left side in full height matching right column. Clicking navigates directly to destination.",
    fallbackImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "right_top",
    order: 2,
    label: "Right Top Banner (Wide)",
    badge: "Column 2 (Top Wide)",
    recommendedSize: "Height: 362px (e.g. 650 × 362 px)",
    description: "Spans the full width of the right column above the two bottom cards.",
    fallbackImage: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    key: "right_bottom_left",
    order: 3,
    label: "Right Bottom-Left Banner",
    badge: "Column 2 (Bottom Left)",
    recommendedSize: "Height: 362px (e.g. 350 × 362 px)",
    description: "Bottom-left promotional card on the right side (e.g. Polo Collection).",
    fallbackImage: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop",
  },
  {
    key: "right_bottom_right",
    order: 4,
    label: "Right Bottom-Right Banner",
    badge: "Column 2 (Bottom Right)",
    recommendedSize: "Height: 362px (e.g. 350 × 362 px)",
    description: "Bottom-right promotional card on the right side (e.g. T-Shirts Collection).",
    fallbackImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
  },
];

export default function PromotionalBannersPage() {
  const { data: response, isLoading, refetch } = useGetAdminBannersQuery();
  const { data: catResponse } = useGetCategoriesQuery({ limit: 100 });
  const categories: any[] = catResponse?.data || [];

  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const allBanners: IBanner[] = response?.data || [];
  // Filter promotional banners
  const promoBanners = allBanners.filter(
    (b) =>
      b.placement === "promotional" ||
      b.placement === "promo_left" ||
      b.placement === "promo_right_top" ||
      b.placement === "promo_right_bottom_left" ||
      b.placement === "promo_right_bottom_right" ||
      b.slot === "left" ||
      b.slot === "right_top" ||
      b.slot === "right_bottom" ||
      b.slot === "right_bottom_left" ||
      b.slot === "right_bottom_right"
  );

  // Map banners to slots with backwards compatibility
  const getBannerForSlot = (slotKey: PromoSlot): IBanner | undefined => {
    return promoBanners.find(
      (b) =>
        b.slot === slotKey ||
        (slotKey === "left" && (b.order === 1 || b.placement === "promo_left")) ||
        (slotKey === "right_top" && (b.order === 2 || b.placement === "promo_right_top")) ||
        (slotKey === "right_bottom_left" &&
          (b.slot === "right_bottom" || b.order === 3 || b.placement === "promo_right_bottom_left")) ||
        (slotKey === "right_bottom_right" && (b.order === 4 || b.placement === "promo_right_bottom_right"))
    );
  };

  const leftBanner = getBannerForSlot("left");
  const rightTopBanner = getBannerForSlot("right_top");
  const rightBottomLeftBanner = getBannerForSlot("right_bottom_left");
  const rightBottomRightBanner = getBannerForSlot("right_bottom_right");

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<PromoSlot>("left");
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);

  // Form Fields (pure image and target link)
  const [linkType, setLinkType] = useState<"category" | "custom">("category");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [customLink, setCustomLink] = useState("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");

  const openConfigModal = (slotKey: PromoSlot) => {
    setActiveSlot(slotKey);
    const existing = getBannerForSlot(slotKey);

    if (existing) {
      setEditingBanner(existing);
      setIsActive(existing.isActive ?? true);
      setImageUrl(existing.image || "");
      setFilePreview(existing.image || "");
      setSelectedFile(null);

      if (existing.categoryID) {
        setLinkType("category");
        const cId =
          typeof existing.categoryID === "object" ? existing.categoryID._id : existing.categoryID;
        setSelectedCategoryId(cId || "");
        setCustomLink("");
      } else if (
        existing.link &&
        existing.link.startsWith("/") &&
        categories.some((c) => `/${c.slug}` === existing.link)
      ) {
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !imageUrl.trim() && !editingBanner?.image) {
      toast.error("Please select a banner image file or enter an image URL");
      return;
    }

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

    const slotConfig = PROMO_SLOTS.find((s) => s.key === activeSlot);
    const orderNumber = slotConfig ? slotConfig.order : 1;

    try {
      const formData = new FormData();
      formData.append("title", slotConfig?.label || "Promotional Banner");
      formData.append("placement", "promotional");
      formData.append("slot", activeSlot);
      formData.append("order", String(orderNumber));
      formData.append("isActive", String(isActive));

      if (finalLink) formData.append("link", finalLink);
      if (finalCatId) formData.append("categoryID", finalCatId);
      if (finalCatSlug) formData.append("categorySlug", finalCatSlug);

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (imageUrl.trim()) {
        formData.append("image", imageUrl.trim());
      }

      if (editingBanner) {
        await updateBanner({ id: editingBanner._id, data: formData }).unwrap();
        toast.success(`${slotConfig?.label} updated successfully`);
      } else {
        await createBanner(formData).unwrap();
        toast.success(`${slotConfig?.label} uploaded successfully`);
      }

      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save banner");
    }
  };

  const handleDelete = async (bannerId: string, label: string) => {
    if (!confirm(`Are you sure you want to remove the custom banner for ${label}?`)) return;

    try {
      await deleteBanner(bannerId).unwrap();
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
              Promotional Banners (4 Slots - Collection Grid)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 max-w-2xl">
            Upload custom designed promotional images displayed below <strong>New Collection</strong> on the home page.
            Features 1 tall banner on the left, 1 wide banner on the top-right, and 2 banners side-by-side on the bottom-right.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:text-blue-600 hover:border-blue-300 shadow-2xs transition"
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-white/50 transition"
        >
          <span>2 Slots (Below Trending)</span>
        </Link>
        <Link
          href="/dashboard/admin/promotional/3-slots"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-white text-blue-600 shadow-xs transition"
        >
          <span>4 Slots (Below Collection)</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700">Active</span>
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 3. VISUAL ARCHITECTURE PREVIEW                               */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-gray-900 flex items-center gap-2">
              <FiLayers className="text-blue-600" />
              <span>Layout Architecture (Left 1 + Right 1 Top & 2 Bottom)</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Click &quot;Configure Banner&quot; on any slot to upload your designed image and select target category or custom link.
            </p>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-50 text-blue-700">
            4 Slots Layout
          </span>
        </div>

        {/* 2-Column Grid matching Home Page Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 pt-2 items-stretch">
          {/* LEFT COLUMN: Slot 1 (Tall Banner) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="relative group bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex flex-col justify-between h-[280px] sm:h-[340px] lg:h-[396px] min-h-[300px] p-4 transition-all hover:border-blue-400">
              <img
                src={leftBanner?.image || PROMO_SLOTS[0].fallbackImage}
                alt={leftBanner?.title || "Left Banner"}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-102 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Top Slot Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs shadow-xs">
                  Slot 1: Left (Tall)
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    leftBanner ? (leftBanner.isActive ? "bg-emerald-500 text-white" : "bg-gray-700 text-gray-300") : "bg-amber-500 text-white"
                  }`}
                >
                  {leftBanner ? (leftBanner.isActive ? "Custom Active" : "Inactive") : "Default Fallback"}
                </span>
              </div>

              {/* Bottom Meta & Button */}
              <div className="relative z-10 pt-8 mt-auto space-y-2">
                {leftBanner?.link && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-black/75 text-white backdrop-blur-md shadow-xs">
                    <FiLink size={12} className="text-blue-400" />
                    <span className="truncate max-w-[260px]">{leftBanner.link}</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => openConfigModal("left")}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-blue-600 text-gray-900 hover:text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <FiEdit3 size={14} />
                  <span>Configure Left Banner</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 1 Wide Top Banner + 2 Side-by-Side Bottom Banners */}
          <div className="lg:col-span-6 flex flex-col gap-3.5 sm:gap-4 justify-between">
            {/* Slot 2: Right Top (Wide) */}
            <div className="relative group bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex flex-col justify-between h-[180px] sm:h-[190px] p-3.5 transition-all hover:border-blue-400">
              <img
                src={rightTopBanner?.image || PROMO_SLOTS[1].fallbackImage}
                alt={rightTopBanner?.title || "Right Top Banner"}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-102 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs">
                  Slot 2: Right Top (Wide)
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    rightTopBanner ? (rightTopBanner.isActive ? "bg-emerald-500 text-white" : "bg-gray-700 text-gray-300") : "bg-amber-500 text-white"
                  }`}
                >
                  {rightTopBanner ? (rightTopBanner.isActive ? "Active" : "Inactive") : "Default"}
                </span>
              </div>

              <div className="relative z-10 pt-4 mt-auto">
                <button
                  type="button"
                  onClick={() => openConfigModal("right_top")}
                  className="w-full py-1.5 px-3 rounded-lg bg-white/95 hover:bg-blue-600 text-gray-900 hover:text-white text-[11px] font-black transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FiEdit3 size={12} />
                  <span>Configure Right Top</span>
                </button>
              </div>
            </div>

            {/* Bottom 2 Banners: Slot 3 & Slot 4 */}
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
              {/* Slot 3: Right Bottom-Left (Polo) */}
              <div className="relative group bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex flex-col justify-between h-[180px] sm:h-[190px] p-3 transition-all hover:border-blue-400">
                <img
                  src={rightBottomLeftBanner?.image || PROMO_SLOTS[2].fallbackImage}
                  alt={rightBottomLeftBanner?.title || "Right Bottom Left Banner"}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-102 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-black/75 text-white">
                    Slot 3: Bottom Left
                  </span>
                </div>

                <div className="relative z-10 pt-2 mt-auto">
                  <button
                    type="button"
                    onClick={() => openConfigModal("right_bottom_left")}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-white/95 hover:bg-blue-600 text-gray-900 hover:text-white text-[10px] font-black transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FiEdit3 size={11} />
                    <span>Configure</span>
                  </button>
                </div>
              </div>

              {/* Slot 4: Right Bottom-Right (T-Shirts) */}
              <div className="relative group bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex flex-col justify-between h-[180px] sm:h-[190px] p-3 transition-all hover:border-blue-400">
                <img
                  src={rightBottomRightBanner?.image || PROMO_SLOTS[3].fallbackImage}
                  alt={rightBottomRightBanner?.title || "Right Bottom Right Banner"}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-102 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-black/75 text-white">
                    Slot 4: Bottom Right
                  </span>
                </div>

                <div className="relative z-10 pt-2 mt-auto">
                  <button
                    type="button"
                    onClick={() => openConfigModal("right_bottom_right")}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-white/95 hover:bg-blue-600 text-gray-900 hover:text-white text-[10px] font-black transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FiEdit3 size={11} />
                    <span>Configure</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. SLOT CONFIGURATION CARDS                                  */}
      {/* ============================================================ */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-900">Manage Slot Images & Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROMO_SLOTS.map((slot) => {
            const banner = getBannerForSlot(slot.key);
            const isCustom = Boolean(banner);

            return (
              <div
                key={slot.key}
                className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {slot.badge}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 mt-1">{slot.label}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{slot.recommendedSize}</p>
                  </div>
                  <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0 relative">
                    <img
                      src={banner?.image || slot.fallbackImage}
                      alt={slot.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-mono truncate max-w-[200px]">
                    {banner?.link || "/fashion"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openConfigModal(slot.key)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <FiEdit3 size={12} /> Configure Image
                    </button>
                    {isCustom && (
                      <button
                        onClick={() => handleDelete(banner!._id, slot.label)}
                        className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Reset to fallback"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. MODAL (CLEAN IMAGE UPLOAD ONLY - NO TITLES/DESC)          */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  {PROMO_SLOTS.find((s) => s.key === activeSlot)?.badge}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">
                  Upload Image: {PROMO_SLOTS.find((s) => s.key === activeSlot)?.label}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Image Upload Zone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Banner Image File <span className="text-red-500">*</span>
                  <span className="ml-2 font-normal text-gray-400">
                    ({PROMO_SLOTS.find((s) => s.key === activeSlot)?.recommendedSize})
                  </span>
                </label>
                <div className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl p-5 text-center transition bg-gray-50/50">
                  <input
                    type="file"
                    id="promo-slot-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="promo-slot-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
                      <FiUploadCloud size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700">Click to upload banner image</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  </label>
                </div>

                <div className="mt-2.5">
                  <p className="text-[11px] font-semibold text-gray-500 mb-1">Or paste Image URL:</p>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setFilePreview(e.target.value);
                      setSelectedFile(null);
                    }}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>

                {filePreview && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 relative bg-gray-900">
                    <img src={filePreview} alt="Preview" className="w-full h-36 object-cover" />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Live Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Destination Link */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  When Banner Is Clicked:
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => setLinkType("category")}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                      linkType === "category"
                        ? "border-blue-600 bg-blue-50/60 text-blue-900 ring-1 ring-blue-600"
                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <FiLayers className={linkType === "category" ? "text-blue-600" : "text-gray-400"} />
                    <div>
                      <p className="text-xs font-bold">Category</p>
                      <p className="text-[10px] text-gray-500">Go to category</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLinkType("custom")}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                      linkType === "custom"
                        ? "border-blue-600 bg-blue-50/60 text-blue-900 ring-1 ring-blue-600"
                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <FiLink className={linkType === "custom" ? "text-blue-600" : "text-gray-400"} />
                    <div>
                      <p className="text-xs font-bold">Custom URL</p>
                      <p className="text-[10px] text-gray-500">Direct page link</p>
                    </div>
                  </button>
                </div>

                {linkType === "category" ? (
                  <div>
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 bg-white focus:outline-none focus:border-blue-600"
                      required={linkType === "category"}
                    >
                      <option value="">-- Choose Target Category --</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name} (/{cat.slug})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={customLink}
                      onChange={(e) => setCustomLink(e.target.value)}
                      placeholder="/fashion or /offers or /product/slug"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-blue-600 font-mono"
                      required={linkType === "custom"}
                    />
                  </div>
                )}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <p className="text-xs font-bold text-gray-800">Banner Active Status</p>
                  <p className="text-[11px] text-gray-400">If inactive, fallback image will be shown</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
                >
                  {isCreating || isUpdating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck size={14} /> Save Banner
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
