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
  FiGrid,
  FiMaximize2,
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

type BottomPromoSlot =
  | "bottom_row1_col1"
  | "bottom_row1_col2"
  | "bottom_row2_col1"
  | "bottom_row2_col2"
  | "bottom_row2_col3"
  | "bottom_row2_col4";

interface SlotConfig {
  key: BottomPromoSlot;
  order: number;
  row: 1 | 2;
  label: string;
  badge: string;
  recommendedSize: string;
  description: string;
  fallbackImage: string;
  fallbackLink: string;
}

const BOTTOM_PROMO_SLOTS: SlotConfig[] = [
  {
    key: "bottom_row1_col1",
    order: 1,
    row: 1,
    label: "Row 1 Left: 2/3 Width Banner",
    badge: "Row 1 (2/3 Width)",
    recommendedSize: "1000 × 500 px • Height 326px",
    description: "Wide showcase banner on the left side of Row 1 (spanning 2/3 of the container width).",
    fallbackImage: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop",
    fallbackLink: "/lifestyle",
  },
  {
    key: "bottom_row1_col2",
    order: 2,
    row: 1,
    label: "Row 1 Right: 1/3 Width Banner",
    badge: "Row 1 (1/3 Width)",
    recommendedSize: "500 × 500 px • Height 326px",
    description: "Compact promotional banner on the right side of Row 1 (spanning 1/3 of the container width).",
    fallbackImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    fallbackLink: "/accessories",
  },
  {
    key: "bottom_row2_col1",
    order: 3,
    row: 2,
    label: "Row 2: Column 1 Banner (Tall)",
    badge: "Row 2 (Col 1 of 4)",
    recommendedSize: "400 × 550 px • Height 326px",
    description: "First tall promotional banner in Row 2.",
    fallbackImage: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=800&auto=format&fit=crop",
    fallbackLink: "/fashion",
  },
  {
    key: "bottom_row2_col2",
    order: 4,
    row: 2,
    label: "Row 2: Column 2 Banner (Tall)",
    badge: "Row 2 (Col 2 of 4)",
    recommendedSize: "400 × 550 px • Height 326px",
    description: "Second tall promotional banner in Row 2.",
    fallbackImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    fallbackLink: "/lifestyle",
  },
  {
    key: "bottom_row2_col3",
    order: 5,
    row: 2,
    label: "Row 2: Column 3 Banner (Tall)",
    badge: "Row 2 (Col 3 of 4)",
    recommendedSize: "400 × 550 px • Height 326px",
    description: "Third tall promotional banner in Row 2.",
    fallbackImage: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop",
    fallbackLink: "/lifestyle",
  },
  {
    key: "bottom_row2_col4",
    order: 6,
    row: 2,
    label: "Row 2: Column 4 Banner (Tall)",
    badge: "Row 2 (Col 4 of 4)",
    recommendedSize: "400 × 550 px • Height 326px",
    description: "Fourth tall promotional banner in Row 2.",
    fallbackImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    fallbackLink: "/fashion",
  },
];

export default function BottomPromoPage() {
  const { data: response, isLoading, refetch } = useGetAdminBannersQuery();
  const { data: catResponse } = useGetCategoriesQuery({ limit: 100 });
  const categories: any[] = catResponse?.data || [];

  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const allBanners: IBanner[] = response?.data || [];

  // Filter bottom promo banners
  const bottomPromos = allBanners.filter(
    (b) =>
      b.placement === "bottom_promo" ||
      b.slot === "bottom_row1_full" ||
      b.slot === "bottom_row1_col1" ||
      b.slot === "bottom_row1_col2" ||
      b.slot === "bottom_row2_col1" ||
      b.slot === "bottom_row2_col2" ||
      b.slot === "bottom_row2_col3" ||
      b.slot === "bottom_row2_col4"
  );

  // Helper to get banner for slot with backwards compatibility
  const getBannerForSlot = (slotKey: BottomPromoSlot): IBanner | undefined => {
    return bottomPromos.find(
      (b) =>
        b.slot === slotKey ||
        (slotKey === "bottom_row1_col1" && (b.slot === "bottom_row1_full" || b.order === 1)) ||
        (slotKey === "bottom_row1_col2" && b.order === 2) ||
        (slotKey === "bottom_row2_col1" && b.order === 3) ||
        (slotKey === "bottom_row2_col2" && b.order === 4) ||
        (slotKey === "bottom_row2_col3" && b.order === 5) ||
        (slotKey === "bottom_row2_col4" && b.order === 6)
    );
  };

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<BottomPromoSlot>("bottom_row1_col1");
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

  const currentSlotConfig = BOTTOM_PROMO_SLOTS.find((s) => s.key === activeSlot);

  const openConfigModal = (slotKey: BottomPromoSlot) => {
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
        const cId =
          typeof existing.categoryID === "object"
            ? existing.categoryID._id
            : existing.categoryID;
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
      const slotConfig = BOTTOM_PROMO_SLOTS.find((s) => s.key === slotKey);
      setTitle(slotConfig?.label || "");
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

    if (!selectedFile && !imageUrl.trim() && !editingBanner) {
      toast.error("Please provide a banner image file or image URL");
      return;
    }

    if (linkType === "category" && !selectedCategoryId) {
      toast.error("Please select a target category for this banner");
      return;
    }

    if (linkType === "custom" && !customLink.trim()) {
      toast.error("Please enter a custom URL link for this banner");
      return;
    }

    try {
      const slotConfig = BOTTOM_PROMO_SLOTS.find((s) => s.key === activeSlot);
      const formData = new FormData();

      formData.append("title", title.trim() || slotConfig?.label || "");
      formData.append("placement", "bottom_promo");
      formData.append("slot", activeSlot);
      formData.append("order", String(slotConfig?.order || 1));
      formData.append("isActive", String(isActive));

      if (linkType === "category") {
        formData.append("categoryID", selectedCategoryId);
        const cat = categories.find((c) => c._id === selectedCategoryId);
        if (cat?.slug) {
          formData.append("categorySlug", cat.slug);
          formData.append("link", `/${cat.slug}`);
        }
      } else {
        formData.append("link", customLink.trim());
      }

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
      toast.error(err?.data?.message || "Failed to save promotional banner");
    }
  };

  const handleDelete = async (bannerId: string, slotLabel: string) => {
    if (
      !confirm(
        `Are you sure you want to remove the custom banner for "${slotLabel}"? The slot will automatically fallback to standard design.`
      )
    ) {
      return;
    }

    try {
      await deleteBanner(bannerId).unwrap();
      toast.success("Banner removed. Slot reverted to default fallback.");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove banner");
    }
  };

  const row1Slots = BOTTOM_PROMO_SLOTS.filter((s) => s.row === 1);
  const row2Slots = BOTTOM_PROMO_SLOTS.filter((s) => s.row === 2);

  return (
    <div className="space-y-7 pb-20">
      {/* ============================================================ */}
      {/* 1. PAGE HEADER & BREADCRUMBS                                 */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1.5">
            <Link href="/dashboard/admin" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/dashboard/admin/promotional" className="hover:text-blue-600 transition">
              Promotional Banners
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Bottom Promo Grid (2 Rows / 6 Slots)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FiLayout className="text-blue-600" />
            Bottom Promo Grid Management
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Configure the 6 promotional banners displayed right below Featured Products on the home page.
            Row 1 features 2 banners (Left 2/3 and Right 1/3, height 326px). Row 2 features 4 tall portrait banners (height 326px).
            Clicking each banner navigates directly to a selected category or custom link.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="http://localhost:3000"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition shadow-2xs"
          >
            <FiExternalLink size={14} className="text-slate-500" />
            View Live Shop
          </Link>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition shadow-xs"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. VISUAL LAYOUT PREVIEW & SLOT CONTROLS                     */}
      {/* ============================================================ */}
      <div className="space-y-6">
        {/* ---------------- ROW 1: 2 BANNERS (2/3 + 1/3) ---------------- */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  ROW 1 (2 Banners • Left 2/3, Right 1/3 • Height: 326px)
                </span>
                <span className="text-xs text-slate-400 font-medium">Slots 1 & 2</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                Row 1 Showcase Banners
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Left: 2/3 Width (col-span-8) | Right: 1/3 Width (col-span-4)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            {/* Slot 1: Left 2/3 */}
            {(() => {
              const slotConfig = row1Slots[0];
              const banner = getBannerForSlot(slotConfig.key);
              const isCustom = Boolean(banner);
              const displayImg = banner?.image || slotConfig.fallbackImage;
              const linkHref =
                banner?.categorySlug
                  ? `/${banner.categorySlug}`
                  : banner?.link || slotConfig.fallbackLink;

              return (
                <div className="md:col-span-8 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs group">
                  <div className="relative w-full h-[220px] bg-slate-900 overflow-hidden">
                    <img
                      src={displayImg}
                      alt={banner?.title || slotConfig.label}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-blue-600 text-white uppercase tracking-wider shadow-sm">
                        {slotConfig.badge}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 z-10">
                      {isCustom ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-white shadow-xs flex items-center gap-1">
                          <FiCheck size={11} /> Custom Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 text-white shadow-xs">
                          Default Fallback
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 inset-x-2.5 z-10">
                      <p className="text-[10px] text-slate-300 font-medium">Link Destination:</p>
                      <p className="text-xs font-bold text-white truncate font-mono bg-black/40 px-2 py-0.5 rounded border border-white/10 mt-0.5">
                        {linkHref}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white flex items-center justify-between gap-2 border-t border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{slotConfig.label}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{slotConfig.recommendedSize}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => openConfigModal(slotConfig.key)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <FiEdit3 size={12} /> Configure
                      </button>
                      {isCustom && (
                        <button
                          onClick={() => handleDelete(banner!._id, slotConfig.label)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Reset to fallback"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Slot 2: Right 1/3 */}
            {(() => {
              const slotConfig = row1Slots[1];
              const banner = getBannerForSlot(slotConfig.key);
              const isCustom = Boolean(banner);
              const displayImg = banner?.image || slotConfig.fallbackImage;
              const linkHref =
                banner?.categorySlug
                  ? `/${banner.categorySlug}`
                  : banner?.link || slotConfig.fallbackLink;

              return (
                <div className="md:col-span-4 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs group">
                  <div className="relative w-full h-[220px] bg-slate-900 overflow-hidden">
                    <img
                      src={displayImg}
                      alt={banner?.title || slotConfig.label}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-blue-600 text-white uppercase tracking-wider shadow-sm">
                        {slotConfig.badge}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 z-10">
                      {isCustom ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-white shadow-xs flex items-center gap-1">
                          <FiCheck size={11} /> Custom Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 text-white shadow-xs">
                          Default Fallback
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 inset-x-2.5 z-10">
                      <p className="text-[10px] text-slate-300 font-medium">Link Destination:</p>
                      <p className="text-xs font-bold text-white truncate font-mono bg-black/40 px-2 py-0.5 rounded border border-white/10 mt-0.5">
                        {linkHref}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white flex items-center justify-between gap-2 border-t border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{slotConfig.label}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{slotConfig.recommendedSize}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => openConfigModal(slotConfig.key)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <FiEdit3 size={12} /> Configure
                      </button>
                      {isCustom && (
                        <button
                          onClick={() => handleDelete(banner!._id, slotConfig.label)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Reset to fallback"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* ---------------- ROW 2: 4 TALL PORTRAIT BANNERS ---------------- */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  ROW 2 (4 Tall Portrait Columns • Height: 326px)
                </span>
                <span className="text-xs text-slate-400 font-medium">Slots 3, 4, 5 & 6</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                4-Column Tall Promotional Banners
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Recommended: 400 × 550 px portrait per banner • Height 326px
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {row2Slots.map((slotConfig) => {
              const banner = getBannerForSlot(slotConfig.key);
              const isCustom = Boolean(banner);
              const displayImg = banner?.image || slotConfig.fallbackImage;
              const linkHref =
                banner?.categorySlug
                  ? `/${banner.categorySlug}`
                  : banner?.link || slotConfig.fallbackLink;

              return (
                <div
                  key={slotConfig.key}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs group"
                >
                  <div className="relative w-full h-[220px] bg-slate-900 overflow-hidden">
                    <img
                      src={displayImg}
                      alt={banner?.title || slotConfig.label}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-900/80 text-white backdrop-blur-xs border border-white/10 uppercase tracking-wider">
                        {slotConfig.badge}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 z-10">
                      {isCustom ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-white shadow-xs flex items-center gap-1">
                          <FiCheck size={11} /> Custom
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 text-white shadow-xs">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 inset-x-2.5 z-10">
                      <p className="text-[10px] text-slate-300 font-medium">Link Target:</p>
                      <p className="text-xs font-bold text-white truncate font-mono bg-black/40 px-2 py-0.5 rounded border border-white/10 mt-0.5">
                        {linkHref}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white flex items-center justify-between gap-2 border-t border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{slotConfig.label}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{slotConfig.recommendedSize}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => openConfigModal(slotConfig.key)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <FiEdit3 size={12} /> Configure
                      </button>
                      {isCustom && (
                        <button
                          onClick={() => handleDelete(banner!._id, slotConfig.label)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
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
      </div>

      {/* ============================================================ */}
      {/* 3. CONFIGURATION MODAL (UPLOAD & ACTION CONFIG)              */}
      {/* ============================================================ */}
      {isModalOpen && currentSlotConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                    {currentSlotConfig.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Slot Configuration</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {currentSlotConfig.label}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-5 pt-4">
              {/* Internal Note / Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Banner Note / Title <span className="text-slate-400 font-normal">(Internal Dashboard Reference)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Wilderness Camp Promo or Backpack Collection"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Notice: No text or buttons are rendered on the live banner image, ensuring a 100% clean aesthetic.
                </p>
              </div>

              {/* Banner Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Banner Image <span className="text-red-500">*</span>
                  <span className="ml-2 font-normal text-slate-400">
                    (Recommended: {currentSlotConfig.recommendedSize})
                  </span>
                </label>

                {/* Upload Zone */}
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-5 text-center transition bg-slate-50/50">
                  <input
                    type="file"
                    id="promo-file-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="promo-file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
                      <FiUploadCloud size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        Click to upload new banner image
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  </label>
                </div>

                {/* Direct Image URL input as alternative */}
                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-slate-500 mb-1">Or paste image URL:</p>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setFilePreview(e.target.value);
                      setSelectedFile(null);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>

                {/* Image Preview */}
                {filePreview && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 relative bg-slate-900">
                    <img
                      src={filePreview}
                      alt="Banner Preview"
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Live Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Click Action Type: Category vs Custom Link */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  When User Clicks This Banner:
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => setLinkType("category")}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      linkType === "category"
                        ? "border-blue-600 bg-blue-50/60 text-blue-900 ring-1 ring-blue-600"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <FiLayers className={linkType === "category" ? "text-blue-600" : "text-slate-400"} />
                    <div>
                      <p className="text-xs font-bold leading-tight">Open Category</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Filter category products</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLinkType("custom")}
                    className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                      linkType === "custom"
                        ? "border-blue-600 bg-blue-50/60 text-blue-900 ring-1 ring-blue-600"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <FiLink className={linkType === "custom" ? "text-blue-600" : "text-slate-400"} />
                    <div>
                      <p className="text-xs font-bold leading-tight">Custom URL</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Direct to specific page</p>
                    </div>
                  </button>
                </div>

                {linkType === "category" ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Select Target Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-600"
                      required={linkType === "category"}
                    >
                      <option value="">-- Choose Category --</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name} (/{cat.slug})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Clicking the banner will automatically open this category in the store.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Custom URL Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customLink}
                      onChange={(e) => setCustomLink(e.target.value)}
                      placeholder="e.g. /offers or /deals or /product/smart-watch"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-mono"
                      required={linkType === "custom"}
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Relative paths (like <code className="bg-slate-100 px-1 rounded">/shop</code>) or full external links (like <code className="bg-slate-100 px-1 rounded">https://...</code>).
                    </p>
                  </div>
                )}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <p className="text-xs font-bold text-slate-800">Banner Status</p>
                  <p className="text-[11px] text-slate-500">
                    When inactive, fallback graphic will be displayed instead
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer"
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
