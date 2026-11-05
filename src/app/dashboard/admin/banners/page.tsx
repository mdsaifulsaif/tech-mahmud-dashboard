"use client";

import React, { useState } from "react";
import {
  FiPlus,
  FiImage,
  FiLink,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiUploadCloud,
  FiSliders,
  FiLayout,
  FiLayers,
  FiExternalLink,
} from "react-icons/fi";
import {
  useGetAdminBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  IBanner,
} from "@/redux/api/bannerApi";
import toast from "react-hot-toast";

type PlacementType =
  | "slider"
  | "side_top"
  | "side_middle"
  | "side_bottom"
  | "festive_1"
  | "festive_2"
  | "festive_3";

const BannersPage = () => {
  const { data: response, isLoading, refetch } = useGetAdminBannersQuery();
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const banners: IBanner[] = response?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | PlacementType>("all");

  // Form State
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [placement, setPlacement] = useState<PlacementType>("slider");
  const [order, setOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");

  const resetForm = () => {
    setTitle("");
    setLink("");
    setPlacement("slider");
    setOrder(0);
    setIsActive(true);
    setImageUrl("");
    setSelectedFile(null);
    setFilePreview("");
    setEditingBanner(null);
  };

  const handleOpenAdd = (preferredPlacement: PlacementType = "slider") => {
    resetForm();
    setPlacement(preferredPlacement);
    const existingInSlot = banners.filter(
      (b) => (b.placement || "slider") === preferredPlacement
    );
    setOrder(existingInSlot.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: IBanner) => {
    setEditingBanner(banner);
    setTitle(banner.title || "");
    setLink(banner.link || "");
    setPlacement((banner.placement as PlacementType) || "slider");
    setOrder(banner.order ?? 0);
    setIsActive(banner.isActive);
    setImageUrl(banner.image || "");
    setSelectedFile(null);
    setFilePreview(banner.image || "");
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

    if (!selectedFile && !imageUrl.trim() && !editingBanner) {
      toast.error("Please provide a banner image file or image URL");
      return;
    }

    try {
      const formData = new FormData();
      if (title.trim()) formData.append("title", title.trim());
      if (link.trim()) formData.append("link", link.trim());
      formData.append("placement", placement);
      formData.append("order", String(order));
      formData.append("isActive", String(isActive));

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (imageUrl.trim()) {
        formData.append("image", imageUrl.trim());
      }

      if (editingBanner) {
        await updateBanner({ id: editingBanner._id, data: formData }).unwrap();
        toast.success("Banner updated successfully! 🎉");
      } else {
        await createBanner(formData).unwrap();
        toast.success("Banner created successfully! 🚀");
      }

      setIsModalOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to save banner");
    }
  };

  const handleToggleStatus = async (banner: IBanner) => {
    try {
      const formData = new FormData();
      formData.append("isActive", String(!banner.isActive));
      await updateBanner({ id: banner._id, data: formData }).unwrap();
      toast.success(
        `Banner marked as ${!banner.isActive ? "Active" : "Inactive"}`
      );
      refetch();
    } catch (err: any) {
      toast.error("Failed to update banner status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await deleteBanner(id).unwrap();
      toast.success("Banner deleted successfully");
      refetch();
    } catch (err: any) {
      toast.error("Failed to delete banner");
    }
  };

  // Groupings for Hero Layout Simulation (1 Slider on left, 3 Stacked Side Banners on right)
  const sliderBanners = banners.filter((b) => (b.placement || "slider") === "slider");
  const sideTopBanners = banners.filter((b) => b.placement === "side_top");
  const sideMiddleBanners = banners.filter((b) => b.placement === "side_middle");
  const sideBottomBanners = banners.filter((b) => b.placement === "side_bottom");

  // Groupings for Gadget Festive / Promo Grid (3 Cards above Trending Now)
  const festive1Banners = banners.filter((b) => b.placement === "festive_1");
  const festive2Banners = banners.filter((b) => b.placement === "festive_2");
  const festive3Banners = banners.filter((b) => b.placement === "festive_3");

  const activeSliderBanners = sliderBanners.filter((b) => b.isActive);
  const activeSideTop = sideTopBanners.find((b) => b.isActive);
  const activeSideMiddle = sideMiddleBanners.find((b) => b.isActive);
  const activeSideBottom = sideBottomBanners.find((b) => b.isActive);

  const activeFestive1 = festive1Banners.find((b) => b.isActive);
  const activeFestive2 = festive2Banners.find((b) => b.isActive);
  const activeFestive3 = festive3Banners.find((b) => b.isActive);

  // Filtered banners for the list
  const filteredBanners = banners.filter((b) => {
    if (activeTab === "all") return true;
    const currentPlacement = b.placement || "slider";
    return currentPlacement === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiImage className="text-blue-600" />
            Hero Banner Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Hero layout: Main Sliding Carousel on the left (~68%), 3 static promo cards on the right (Top, Middle, Bottom).
          </p>
        </div>

        <button
          onClick={() => handleOpenAdd("slider")}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
        >
          <FiPlus size={16} />
          Add New Banner
        </button>
      </div>

      {/* ===== STAR TECH HERO LAYOUT PREVIEW / QUICK STATUS ===== */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase flex items-center gap-1.5">
              <FiLayout size={12} /> Live Frontend Layout Preview
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              Homepage Hero Section Configuration
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live rendering according to slots below</span>
          </div>
        </div>

        {/* Visual Mockup matching Star Tech reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mt-4">
          {/* LEFT: SLIDER MOCKUP (col-span-8) */}
          <div className="lg:col-span-8 bg-slate-800/80 rounded-2xl border border-slate-700 p-4 relative overflow-hidden group min-h-[300px] flex flex-col justify-between">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                  <FiLayers size={11} /> Main Slider (Left ~68%)
                </span>
                <span className="text-[11px] text-slate-400">
                  {activeSliderBanners.length} active slide{activeSliderBanners.length !== 1 ? "s" : ""}
                </span>
              </div>
              <button
                onClick={() => handleOpenAdd("slider")}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 transition"
              >
                <FiPlus size={12} /> Add Slide
              </button>
            </div>

            {/* Slider Thumbnail Preview */}
            <div className="my-3">
              {activeSliderBanners.length > 0 ? (
                <div className="relative h-40 sm:h-48 rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                  <img
                    src={activeSliderBanners[0].image}
                    alt="Active Slide Preview"
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                    <p className="text-xs font-semibold text-white truncate">
                      {activeSliderBanners[0].title || "Slide 1 (First Slide)"}
                    </p>
                  </div>
                  {activeSliderBanners.length > 1 && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-white">
                      +{activeSliderBanners.length - 1} more rotating
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-40 sm:h-48 rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-400 text-xs">
                  <FiImage size={24} className="mb-1 opacity-50" />
                  <p>No active slider banners configured</p>
                  <span className="text-[10px] text-slate-500">Frontend will use default slider template</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 z-10 flex items-center gap-1">
              • Auto-slides every 5s • Swipeable on touch • Recommended: ~1000x520px
            </p>
          </div>

          {/* RIGHT: THREE STATIC STACKED BANNERS (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            {/* 1. TOP SIDE BANNER */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-2.5 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  1. Right - Side Top
                </span>
                {activeSideTop ? (
                  <button
                    onClick={() => handleOpenEdit(activeSideTop)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <FiEdit2 size={11} /> Edit
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenAdd("side_top")}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <FiPlus size={11} /> Set Banner
                  </button>
                )}
              </div>

              {activeSideTop ? (
                <div className="relative h-16 sm:h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 group">
                  <img
                    src={activeSideTop.image}
                    alt={activeSideTop.title || "Side Top"}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />
                </div>
              ) : (
                <div
                  onClick={() => handleOpenAdd("side_top")}
                  className="h-16 sm:h-20 rounded-lg border border-dashed border-slate-700 hover:border-blue-500 cursor-pointer flex flex-col items-center justify-center text-slate-400 text-xs transition"
                >
                  <FiPlus size={14} className="mb-0.5 text-blue-400" />
                  <span className="text-[11px]">Upload Side Top Banner</span>
                  <span className="text-[9px] text-slate-500">(~450x160px)</span>
                </div>
              )}
            </div>

            {/* 2. MIDDLE SIDE BANNER */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-2.5 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  2. Right - Side Middle
                </span>
                {activeSideMiddle ? (
                  <button
                    onClick={() => handleOpenEdit(activeSideMiddle)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <FiEdit2 size={11} /> Edit
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenAdd("side_middle")}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <FiPlus size={11} /> Set Banner
                  </button>
                )}
              </div>

              {activeSideMiddle ? (
                <div className="relative h-16 sm:h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 group">
                  <img
                    src={activeSideMiddle.image}
                    alt={activeSideMiddle.title || "Side Middle"}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />
                </div>
              ) : (
                <div
                  onClick={() => handleOpenAdd("side_middle")}
                  className="h-16 sm:h-20 rounded-lg border border-dashed border-slate-700 hover:border-blue-500 cursor-pointer flex flex-col items-center justify-center text-slate-400 text-xs transition"
                >
                  <FiPlus size={14} className="mb-0.5 text-blue-400" />
                  <span className="text-[11px]">Upload Side Middle Banner</span>
                  <span className="text-[9px] text-slate-500">(~450x160px)</span>
                </div>
              )}
            </div>

            {/* 3. BOTTOM SIDE BANNER */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-2.5 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  3. Right - Side Bottom
                </span>
                {activeSideBottom ? (
                  <button
                    onClick={() => handleOpenEdit(activeSideBottom)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <FiEdit2 size={11} /> Edit
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenAdd("side_bottom")}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <FiPlus size={11} /> Set Banner
                  </button>
                )}
              </div>

              {activeSideBottom ? (
                <div className="relative h-16 sm:h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 group">
                  <img
                    src={activeSideBottom.image}
                    alt={activeSideBottom.title || "Side Bottom"}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />
                </div>
              ) : (
                <div
                  onClick={() => handleOpenAdd("side_bottom")}
                  className="h-16 sm:h-20 rounded-lg border border-dashed border-slate-700 hover:border-blue-500 cursor-pointer flex flex-col items-center justify-center text-slate-400 text-xs transition"
                >
                  <FiPlus size={14} className="mb-0.5 text-blue-400" />
                  <span className="text-[11px]">Upload Side Bottom Banner</span>
                  <span className="text-[9px] text-slate-500">(~450x160px)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== GADGET FESTIVE / 3 COLLECTION CARDS PREVIEW ===== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 rounded-3xl shadow-sm border border-slate-700/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/60 gap-3">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-pink-400 uppercase flex items-center gap-1.5">
              <FiLayout size={12} /> Gadget Festive / Promo Cards Preview
            </span>
            <h2 className="text-base font-bold text-white mt-0.5">
              Homepage 3-Grid Promotional Banners (Exclusive Collections)
            </h2>
          </div>
          <span className="text-xs text-slate-300">
            Upload custom banner artwork & link to any category, subcategory, or deal page
          </span>
        </div>

        {/* 3 Festive Cards Grid Preview matching user reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Card 1: Left */}
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-3.5 flex flex-col justify-between min-h-[170px]">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                1. Festive Left (Earbuds / Audio)
              </span>
              {activeFestive1 ? (
                <button
                  onClick={() => handleOpenEdit(activeFestive1)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                >
                  <FiEdit2 size={11} /> Edit
                </button>
              ) : (
                <button
                  onClick={() => handleOpenAdd("festive_1")}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                >
                  <FiPlus size={11} /> Set Banner
                </button>
              )}
            </div>

            {activeFestive1 ? (
              <div className="relative h-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group">
                <img
                  src={activeFestive1.image}
                  alt={activeFestive1.title || "Festive Left"}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <p className="text-[11px] text-white font-medium truncate">
                    {activeFestive1.title || "Festive 1"} &bull; {activeFestive1.link || "No link"}
                  </p>
                </div>
              </div>
            ) : (
              <div
                onClick={() => handleOpenAdd("festive_1")}
                className="h-24 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500 cursor-pointer flex flex-col items-center justify-center text-slate-400 text-xs transition"
              >
                <FiPlus size={16} className="mb-1 text-cyan-400" />
                <span className="text-[11px] font-semibold text-slate-300">Set Festive Banner 1</span>
                <span className="text-[9px] text-slate-500">(~450x220px)</span>
              </div>
            )}
          </div>

          {/* Card 2: Middle */}
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-3.5 flex flex-col justify-between min-h-[170px]">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                2. Festive Middle (Watches)
              </span>
              {activeFestive2 ? (
                <button
                  onClick={() => handleOpenEdit(activeFestive2)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                >
                  <FiEdit2 size={11} /> Edit
                </button>
              ) : (
                <button
                  onClick={() => handleOpenAdd("festive_2")}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                >
                  <FiPlus size={11} /> Set Banner
                </button>
              )}
            </div>

            {activeFestive2 ? (
              <div className="relative h-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group">
                <img
                  src={activeFestive2.image}
                  alt={activeFestive2.title || "Festive Middle"}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <p className="text-[11px] text-white font-medium truncate">
                    {activeFestive2.title || "Festive 2"} &bull; {activeFestive2.link || "No link"}
                  </p>
                </div>
              </div>
            ) : (
              <div
                onClick={() => handleOpenAdd("festive_2")}
                className="h-24 rounded-xl border border-dashed border-slate-700 hover:border-amber-500 cursor-pointer flex flex-col items-center justify-center text-slate-400 text-xs transition"
              >
                <FiPlus size={16} className="mb-1 text-amber-400" />
                <span className="text-[11px] font-semibold text-slate-300">Set Festive Banner 2</span>
                <span className="text-[9px] text-slate-500">(~450x220px)</span>
              </div>
            )}
          </div>

          {/* Card 3: Right */}
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-3.5 flex flex-col justify-between min-h-[170px]">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                3. Festive Right (Backpacks)
              </span>
              {activeFestive3 ? (
                <button
                  onClick={() => handleOpenEdit(activeFestive3)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                >
                  <FiEdit2 size={11} /> Edit
                </button>
              ) : (
                <button
                  onClick={() => handleOpenAdd("festive_3")}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                >
                  <FiPlus size={11} /> Set Banner
                </button>
              )}
            </div>

            {activeFestive3 ? (
              <div className="relative h-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group">
                <img
                  src={activeFestive3.image}
                  alt={activeFestive3.title || "Festive Right"}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <p className="text-[11px] text-white font-medium truncate">
                    {activeFestive3.title || "Festive 3"} &bull; {activeFestive3.link || "No link"}
                  </p>
                </div>
              </div>
            ) : (
              <div
                onClick={() => handleOpenAdd("festive_3")}
                className="h-24 rounded-xl border border-dashed border-slate-700 hover:border-rose-500 cursor-pointer flex flex-col items-center justify-center text-slate-400 text-xs transition"
              >
                <FiPlus size={16} className="mb-1 text-rose-400" />
                <span className="text-[11px] font-semibold text-slate-300">Set Festive Banner 3</span>
                <span className="text-[9px] text-slate-500">(~450x220px)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== FILTER TABS & BANNER LIST ===== */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "all"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All ({banners.length})
            </button>
            <button
              onClick={() => setActiveTab("slider")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "slider"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Main Slider ({sliderBanners.length})
            </button>
            <button
              onClick={() => setActiveTab("side_top")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "side_top"
                  ? "bg-white text-amber-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Side Top ({sideTopBanners.length})
            </button>
            <button
              onClick={() => setActiveTab("side_middle")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "side_middle"
                  ? "bg-white text-teal-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Side Middle ({sideMiddleBanners.length})
            </button>
            <button
              onClick={() => setActiveTab("side_bottom")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "side_bottom"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Side Bottom ({sideBottomBanners.length})
            </button>
            <button
              onClick={() => setActiveTab("festive_1")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "festive_1"
                  ? "bg-white text-cyan-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Festive 1 ({festive1Banners.length})
            </button>
            <button
              onClick={() => setActiveTab("festive_2")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "festive_2"
                  ? "bg-white text-amber-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Festive 2 ({festive2Banners.length})
            </button>
            <button
              onClick={() => setActiveTab("festive_3")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "festive_3"
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Festive 3 ({festive3Banners.length})
            </button>
          </div>

          <span className="text-xs text-gray-400">
            Total {filteredBanners.length} banner(s) listed
          </span>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-gray-400">
            Loading banners...
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto text-gray-400">
              <FiImage size={24} />
            </div>
            <p className="text-sm font-bold text-gray-700">No Banners In This Slot</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Upload a banner for this slot to configure the Star Tech homepage layout.
            </p>
            <button
              onClick={() => handleOpenAdd(activeTab === "all" ? "slider" : activeTab)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700"
            >
              <FiPlus size={14} /> Add Banner
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredBanners.map((banner) => {
              const currentPlacement = banner.placement || "slider";
              return (
                <div
                  key={banner._id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Banner Thumbnail & Info */}
                  <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    <div className="relative w-36 sm:w-44 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                      <img
                        src={banner.image}
                        alt={banner.title || "Banner"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Placement Badge */}
                        {currentPlacement === "slider" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            Main Slider (Left)
                          </span>
                        )}
                        {currentPlacement === "side_top" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Side Top (Right 1)
                          </span>
                        )}
                        {currentPlacement === "side_middle" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                            Side Middle (Right 2)
                          </span>
                        )}
                        {currentPlacement === "side_bottom" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            Side Bottom (Right 3)
                          </span>
                        )}
                        {currentPlacement === "festive_1" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                            Festive Left (Card 1)
                          </span>
                        )}
                        {currentPlacement === "festive_2" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Festive Middle (Card 2)
                          </span>
                        )}
                        {currentPlacement === "festive_3" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Festive Right (Card 3)
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200 font-mono">
                          Order #{banner.order ?? 0}
                        </span>

                        {banner.isActive ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <FiCheckCircle size={10} /> Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200 flex items-center gap-1">
                            <FiXCircle size={10} /> Inactive
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {banner.title || "Untitled Banner"}
                      </h3>

                      {banner.link ? (
                        <p className="text-xs text-blue-600 flex items-center gap-1 truncate font-mono">
                          <FiLink size={12} className="shrink-0" />
                          <span>{banner.link}</span>
                        </p>
                      ) : (
                        <p className="text-[11px] text-gray-400 italic">No redirect link</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleToggleStatus(banner)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        banner.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {banner.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => handleOpenEdit(banner)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-xl transition"
                      title="Edit Banner"
                    >
                      <FiEdit2 size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                      title="Delete Banner"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== CREATE / EDIT MODAL ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingBanner ? "Edit Hero Banner" : "Add New Hero Banner"}
                </h3>
                <p className="text-xs text-gray-400">
                  Configure banner slot, upload creative and set optional click action.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Placement Selector (STAR TECH LAYOUT SLOTS) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  Select Banner Slot / Placement *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Slider */}
                  <label
                    className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      placement === "slider"
                        ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900">Main Slider</span>
                      <input
                        type="radio"
                        name="placement"
                        value="slider"
                        checked={placement === "slider"}
                        onChange={() => setPlacement("slider")}
                        className="text-blue-600"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">
                      Left Carousel. Auto-slides if 2+ added.
                    </p>
                    <span className="text-[9px] font-mono text-blue-600 mt-2 font-bold">
                      Rec: ~1000x520 px
                    </span>
                  </label>

                  {/* Option 2: Side Top */}
                  <label
                    className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      placement === "side_top"
                        ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900">Side Top (1st)</span>
                      <input
                        type="radio"
                        name="placement"
                        value="side_top"
                        checked={placement === "side_top"}
                        onChange={() => setPlacement("side_top")}
                        className="text-amber-500"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">
                      Right Upper static promo card.
                    </p>
                    <span className="text-[9px] font-mono text-amber-600 mt-2 font-bold">
                      Rec: ~450x160 px
                    </span>
                  </label>

                  {/* Option 3: Side Middle */}
                  <label
                    className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      placement === "side_middle"
                        ? "border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900">Side Middle (2nd)</span>
                      <input
                        type="radio"
                        name="placement"
                        value="side_middle"
                        checked={placement === "side_middle"}
                        onChange={() => setPlacement("side_middle")}
                        className="text-teal-500"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">
                      Right Middle static promo card.
                    </p>
                    <span className="text-[9px] font-mono text-teal-600 mt-2 font-bold">
                      Rec: ~450x160 px
                    </span>
                  </label>

                  {/* Option 4: Side Bottom */}
                  <label
                    className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      placement === "side_bottom"
                        ? "border-purple-600 bg-purple-50/50 ring-2 ring-purple-600/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900">Side Bottom (3rd)</span>
                      <input
                        type="radio"
                        name="placement"
                        value="side_bottom"
                        checked={placement === "side_bottom"}
                        onChange={() => setPlacement("side_bottom")}
                        className="text-purple-600"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">
                      Right Lower static promo card.
                    </p>
                    <span className="text-[9px] font-mono text-purple-600 mt-2 font-bold">
                      Rec: ~450x160 px
                    </span>
                  </label>

                  {/* Option 5: Festive 1 (Left) */}
                  <label
                    className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      placement === "festive_1"
                        ? "border-cyan-600 bg-cyan-50/50 ring-2 ring-cyan-600/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900">Festive Card 1 (Left)</span>
                      <input
                        type="radio"
                        name="placement"
                        value="festive_1"
                        checked={placement === "festive_1"}
                        onChange={() => setPlacement("festive_1")}
                        className="text-cyan-600"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">
                      Homepage Festive Left card (e.g. Earbuds / Audio collection).
                    </p>
                    <span className="text-[9px] font-mono text-cyan-600 mt-2 font-bold">
                      Rec: ~450x220 px
                    </span>
                  </label>

                  {/* Option 6: Festive 2 (Middle) */}
                  <label
                    className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      placement === "festive_2"
                        ? "border-amber-600 bg-amber-50/50 ring-2 ring-amber-600/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900">Festive Card 2 (Middle)</span>
                      <input
                        type="radio"
                        name="placement"
                        value="festive_2"
                        checked={placement === "festive_2"}
                        onChange={() => setPlacement("festive_2")}
                        className="text-amber-600"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">
                      Homepage Festive Middle card (e.g. Watches collection).
                    </p>
                    <span className="text-[9px] font-mono text-amber-600 mt-2 font-bold">
                      Rec: ~450x220 px
                    </span>
                  </label>

                  {/* Option 7: Festive 3 (Right) */}
                  <label
                    className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      placement === "festive_3"
                        ? "border-rose-600 bg-rose-50/50 ring-2 ring-rose-600/20"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900">Festive Card 3 (Right)</span>
                      <input
                        type="radio"
                        name="placement"
                        value="festive_3"
                        checked={placement === "festive_3"}
                        onChange={() => setPlacement("festive_3")}
                        className="text-rose-600"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">
                      Homepage Festive Right card (e.g. Backpacks / Luggage).
                    </p>
                    <span className="text-[9px] font-mono text-rose-600 mt-2 font-bold">
                      Rec: ~450x220 px
                    </span>
                  </label>
                </div>
              </div>

              {/* Banner Image Upload / Preview */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">
                  Banner Image *
                </label>

                {filePreview ? (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                    <img
                      src={filePreview}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview("");
                        setImageUrl("");
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 hover:border-blue-600 rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-gray-50/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <FiUploadCloud
                      size={28}
                      className="mx-auto text-gray-400 mb-1"
                    />
                    <p className="text-xs font-bold text-gray-700">
                      Click or drag banner image here
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {placement === "slider"
                        ? "Slider: ~900x450 px or 16:9 (PNG, JPG, WebP)"
                        : "Side Card: ~400x215 px (PNG, JPG, WebP)"}
                    </p>
                  </div>
                )}

                {/* Or Direct Image URL */}
                <div className="pt-1">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (e.target.value.trim()) setFilePreview(e.target.value.trim());
                    }}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Title (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">
                  Banner Title (For Accessibility / Admin reference)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. End of Season Sale / Feedback / Career"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>

              {/* Redirect Link */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">
                  Redirect Link (Optional)
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="e.g. /shop?category=gadget or /offers"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition font-mono"
                />
              </div>

              {/* Order & Active Switch in 2 columns */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">
                    Display Order (Priority)
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition font-mono"
                  />
                  <p className="text-[10px] text-gray-400">Lower numbers appear first</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">
                    Status
                  </label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                    />
                    <span className="text-xs font-semibold text-gray-800">
                      Active (Show in Hero)
                    </span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition disabled:opacity-50"
                >
                  {isCreating || isUpdating
                    ? "Saving..."
                    : editingBanner
                    ? "Update Banner"
                    : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannersPage;
