"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FiGlobe,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUploadCloud,
  FiCheck,
  FiLoader,
  FiTrash2,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
  FaTwitter,
} from "react-icons/fa";
import toast from "react-hot-toast";
import {
  useGetStoreSettingsQuery,
  useUpdateStoreSettingsMutation,
} from "@/redux/api/storeSettingApi";

export const GeneralSettings: React.FC = () => {
  const { data: settingsResponse, isLoading, refetch } =
    useGetStoreSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateStoreSettingsMutation();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    siteName: "",
    tagline: "",
    siteURL: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    currency: "BDT - Bangladeshi Taka",
    currencySymbol: "৳",
    symbolPosition: "before",
    facebook: "",
    youtube: "",
    instagram: "",
    twitter: "",
  });

  const [currentLogo, setCurrentLogo] = useState<string>("");
  const [currentFavicon, setCurrentFavicon] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [faviconPreview, setFaviconPreview] = useState<string>("");

  useEffect(() => {
    const data = settingsResponse?.data;
    if (data) {
      setFormData({
        siteName: data.siteName || "",
        tagline: data.tagline || "",
        siteURL: data.siteURL || "",
        email: data.email || "",
        phone: data.phone || "",
        whatsapp: data.whatsapp || "",
        address: data.address || "",
        currency: data.currency || "BDT - Bangladeshi Taka",
        currencySymbol: data.currencySymbol || "৳",
        symbolPosition: data.symbolPosition || "before",
        facebook: data.socialLinks?.facebook || "",
        youtube: data.socialLinks?.youtube || "",
        instagram: data.socialLinks?.instagram || "",
        twitter: data.socialLinks?.twitter || "",
      });

      if (data.logo) setCurrentLogo(data.logo);
      if (data.favicon) setCurrentFavicon(data.favicon);
    }
  }, [settingsResponse]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFaviconFile(file);
      setFaviconPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append("siteName", formData.siteName);
      payload.append("tagline", formData.tagline);
      payload.append("siteURL", formData.siteURL);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("whatsapp", formData.whatsapp);
      payload.append("address", formData.address);
      payload.append("currency", formData.currency);
      payload.append("currencySymbol", formData.currencySymbol);
      payload.append("symbolPosition", formData.symbolPosition);

      const socialLinks = {
        facebook: formData.facebook,
        youtube: formData.youtube,
        instagram: formData.instagram,
        twitter: formData.twitter,
      };
      payload.append("socialLinks", JSON.stringify(socialLinks));

      if (logoFile) {
        payload.append("logo", logoFile);
      }
      if (faviconFile) {
        payload.append("favicon", faviconFile);
      }

      await updateSettings(payload).unwrap();
      toast.success("General settings updated successfully!");
      refetch();
      setLogoFile(null);
      setFaviconFile(null);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to update settings");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <FiLoader className="animate-spin mr-2" size={24} />
        Loading settings...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* ============================================================== */}
      {/* 1. BRAND IDENTITY & LOGO UPLOAD                                */}
      {/* ============================================================== */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Brand Identity & Logo</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure your store title, tagline, logo and favicon displayed on navbar and footer.
            </p>
          </div>
        </div>

        {/* Logo and Favicon Upload Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Main Logo Upload */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Store Logo (Header & Navbar)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-28 h-20 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden p-2 shadow-2xs shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : currentLogo ? (
                  <img
                    src={currentLogo}
                    alt="Current Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-[11px] text-gray-400 font-medium text-center">
                    No Logo Uploaded
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoChange}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 hover:border-blue-500 rounded-xl text-xs font-semibold text-gray-700 hover:text-blue-600 transition shadow-2xs cursor-pointer"
                >
                  <FiUploadCloud size={16} />
                  {logoPreview ? "Change Selected Logo" : "Upload New Logo"}
                </button>
                <p className="text-[11px] text-gray-400">
                  PNG, SVG, or WEBP (Recommended: transparent background, 240x60px)
                </p>
              </div>
            </div>
          </div>

          {/* Favicon Upload */}
          <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Website Favicon (Browser Tab Icon)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden p-2 shadow-2xs shrink-0">
                {faviconPreview ? (
                  <img
                    src={faviconPreview}
                    alt="Favicon Preview"
                    className="w-10 h-10 object-contain"
                  />
                ) : currentFavicon ? (
                  <img
                    src={currentFavicon}
                    alt="Current Favicon"
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <span className="text-[11px] text-gray-400 font-medium text-center">
                    No Favicon
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={faviconInputRef}
                  onChange={handleFaviconChange}
                  accept="image/png,image/x-icon,image/svg+xml"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => faviconInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 hover:border-blue-500 rounded-xl text-xs font-semibold text-gray-700 hover:text-blue-600 transition shadow-2xs cursor-pointer"
                >
                  <FiUploadCloud size={16} />
                  {faviconPreview ? "Change Favicon" : "Upload Favicon"}
                </button>
                <p className="text-[11px] text-gray-400">
                  ICO, PNG, or SVG (Recommended: 32x32px or 64x64px)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Site Name, Tagline, URL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Site Name
            </label>
            <input
              type="text"
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              placeholder="e.g. Tech Mahmud"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="e.g. Tech & Lifestyle"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Live Site URL
            </label>
            <input
              type="url"
              name="siteURL"
              value={formData.siteURL}
              onChange={handleChange}
              placeholder="https://tech-mahmud-frontend.vercel.app"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. CONTACT INFORMATION                                         */}
      {/* ============================================================== */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Contact & Support Details</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Public contact info shown in the Footer helpline and customer support links.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Support Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="support@techmahmud.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Helpline Phone Number
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01783176838"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              WhatsApp Support Number
            </label>
            <div className="relative">
              <FaWhatsapp className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="8801783176838"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Office / Business Address
          </label>
          <div className="relative">
            <FiMapPin className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              placeholder="Head Office: 28 Kazi Nazrul Islam Ave, Navana Zohura Square, Dhaka 1000"
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. SOCIAL MEDIA PROFILES (Reflected in Footer)                 */}
      {/* ============================================================== */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Social Media Links</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              These links directly power the circular social buttons in the website footer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Facebook */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Facebook Page URL
            </label>
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-[#1877F2]/10 text-[#1877F2] absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <FaFacebookF size={14} />
              </div>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/techmahmud"
                className="w-full pl-12 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>

          {/* YouTube */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              YouTube Channel URL
            </label>
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-[#FF0000]/10 text-[#FF0000] absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <FaYoutube size={15} />
              </div>
              <input
                type="url"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/@techmahmud"
                className="w-full pl-12 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Instagram Profile URL
            </label>
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-[#E4405F]/10 text-[#E4405F] absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <FaInstagram size={15} />
              </div>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/techmahmud"
                className="w-full pl-12 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Twitter / X */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              X (Twitter) Profile URL
            </label>
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gray-900/10 text-gray-900 absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <FaTwitter size={14} />
              </div>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="https://x.com/techmahmud"
                className="w-full pl-12 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. CURRENCY SETTINGS                                           */}
      {/* ============================================================== */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Currency & Formatting</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Default currency symbol and display layout for product prices.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              <option value="BDT - Bangladeshi Taka">BDT - Bangladeshi Taka</option>
              <option value="USD - US Dollar">USD - US Dollar</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Currency Symbol
            </label>
            <input
              type="text"
              name="currencySymbol"
              value={formData.currencySymbol}
              onChange={handleChange}
              placeholder="৳"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Symbol Position
            </label>
            <select
              name="symbolPosition"
              value={formData.symbolPosition}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              <option value="before">Before Price (৳100)</option>
              <option value="after">After Price (100৳)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
        <button
          type="submit"
          disabled={isUpdating}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-60 cursor-pointer"
        >
          {isUpdating ? (
            <>
              <FiLoader className="animate-spin" size={17} />
              Saving Settings...
            </>
          ) : (
            <>
              <FiCheck size={17} />
              Save General Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
};
