"use client";

import React, { useState, useEffect } from "react";
import {
  FiTarget,
  FiCheck,
  FiSave,
  FiEye,
  FiEyeOff,
  FiActivity,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiExternalLink,
  FiZap,
} from "react-icons/fi";
import { FaFacebook, FaGoogle, FaTiktok } from "react-icons/fa";
import { SiGoogleanalytics, SiGoogletagmanager } from "react-icons/si";
import toast from "react-hot-toast";
import {
  useGetMarketingSettingsQuery,
  useUpdateMarketingSettingsMutation,
  useGetTrackingLogsQuery,
  useTestTrackingEventMutation,
} from "@/redux/api/marketingApi";

export default function MarketingPage() {
  const { data: settingsData, isLoading: isFetching, refetch } = useGetMarketingSettingsQuery();
  const [updateMarketingSettings, { isLoading: isSaving }] = useUpdateMarketingSettingsMutation();
  const { data: logsData, isLoading: isLoadingLogs, refetch: refetchLogs } = useGetTrackingLogsQuery(10);
  const [testTrackingEvent, { isLoading: isTesting }] = useTestTrackingEventMutation();

  // Form State
  const [form, setForm] = useState({
    meta: {
      isEnabled: false,
      pixelId: "",
      accessToken: "",
      testEventCode: "",
    },
    gtm: {
      isEnabled: false,
      containerId: "",
    },
    ga4: {
      isEnabled: false,
      measurementId: "",
      apiSecret: "",
    },
    tiktok: {
      isEnabled: false,
      pixelCode: "",
      accessToken: "",
    },
  });

  // Visibility states for secret tokens
  const [showTokens, setShowTokens] = useState({
    metaToken: false,
    ga4Secret: false,
    tiktokToken: false,
  });

  // Populate form when data arrives
  useEffect(() => {
    if (settingsData?.data) {
      setForm({
        meta: {
          isEnabled: Boolean(settingsData.data.meta?.isEnabled),
          pixelId: settingsData.data.meta?.pixelId || "",
          accessToken: settingsData.data.meta?.accessToken || "",
          testEventCode: settingsData.data.meta?.testEventCode || "",
        },
        gtm: {
          isEnabled: Boolean(settingsData.data.gtm?.isEnabled),
          containerId: settingsData.data.gtm?.containerId || "",
        },
        ga4: {
          isEnabled: Boolean(settingsData.data.ga4?.isEnabled),
          measurementId: settingsData.data.ga4?.measurementId || "",
          apiSecret: settingsData.data.ga4?.apiSecret || "",
        },
        tiktok: {
          isEnabled: Boolean(settingsData.data.tiktok?.isEnabled),
          pixelCode: settingsData.data.tiktok?.pixelCode || "",
          accessToken: settingsData.data.tiktok?.accessToken || "",
        },
      });
    }
  }, [settingsData]);

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateMarketingSettings(form).unwrap();
      if (res.success) {
        toast.success("Marketing & Tracking settings saved successfully! Changes active immediately.");
        refetch();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update marketing settings");
    }
  };

  // Handle Test Event Dispatch
  const handleTestEvent = async () => {
    try {
      const res = await testTrackingEvent({ eventName: "PageView" }).unwrap();
      if (res.success) {
        toast.success("Test event successfully sent! Check tracking logs below.");
        refetchLogs();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Test event failed");
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">Loading Marketing & Tracking Settings...</p>
      </div>
    );
  }

  const activeCount = [
    form.meta.isEnabled,
    form.gtm.isEnabled,
    form.ga4.isEnabled,
    form.tiktok.isEnabled,
  ].filter(Boolean).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-[#1e3a1f] to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-300 mb-3 border border-white/10">
            <FiTarget className="animate-pulse" />
            <span>Multi-Channel Server & Client Tracking</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Marketing, Pixels & Conversions API (CAPI)
          </h1>
          <p className="text-sm md:text-base text-gray-300 mt-2 leading-relaxed">
            Configure Meta Pixel & CAPI, Google Tag Manager, GA4, and TikTok Events API.
            Toggle providers on/off dynamically without touching server code or restarting.
          </p>
          <div className="flex items-center gap-4 mt-4 text-xs font-medium text-gray-300">
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/5">
              <span className={`w-2 h-2 rounded-full ${activeCount > 0 ? "bg-emerald-400" : "bg-gray-400"}`} />
              {activeCount} of 4 Channels Active
            </span>
            <span className="text-emerald-400">Database-Driven & Zero-Downtime</span>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={handleTestEvent}
            disabled={isTesting}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition border border-white/10 shadow-sm disabled:opacity-50"
            title="Dispatch a real test event to enabled providers"
          >
            <FiZap className={`text-yellow-400 ${isTesting ? "animate-spin" : ""}`} />
            {isTesting ? "Testing..." : "Send Test Event"}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-sm font-semibold shadow-lg shadow-[#2563EB]/30 transition disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <FiRefreshCw className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <FiSave /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Meta (Facebook) Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 transition-all hover:shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shadow-inner">
                <FaFacebook />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">Meta (Facebook) Pixel & Conversions API (CAPI)</h3>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${form.meta.isEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {form.meta.isEnabled ? "Active" : "Disabled"}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                  Sends browser pixel events and high-accuracy server-side CAPI events directly to Meta Events Manager.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.meta.isEnabled}
                onChange={(e) =>
                  setForm({ ...form, meta: { ...form.meta, isEnabled: e.target.checked } })
                }
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#2563EB]"></div>
              <span className="ml-3 text-sm font-semibold text-gray-700">
                {form.meta.isEnabled ? "On" : "Off"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Meta Pixel ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.meta.pixelId}
                onChange={(e) =>
                  setForm({ ...form, meta: { ...form.meta, pixelId: e.target.value.trim() } })
                }
                placeholder="e.g. 123456789012345"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Found under Events Manager &gt; Data Sources &gt; Settings &gt; Dataset ID / Pixel ID.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Conversions API (CAPI) Access Token <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showTokens.metaToken ? "text" : "password"}
                  value={form.meta.accessToken}
                  onChange={(e) =>
                    setForm({ ...form, meta: { ...form.meta, accessToken: e.target.value.trim() } })
                  }
                  placeholder="EAAG..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowTokens({ ...showTokens, metaToken: !showTokens.metaToken })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showTokens.metaToken ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Generated under Events Manager &gt; Settings &gt; Conversions API &gt; Generate Access Token.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Test Event Code <span className="text-gray-400 font-normal">(Optional for Debugging)</span>
              </label>
              <input
                type="text"
                value={form.meta.testEventCode}
                onChange={(e) =>
                  setForm({ ...form, meta: { ...form.meta, testEventCode: e.target.value.trim() } })
                }
                placeholder="e.g. TEST12345 (Leave empty in production)"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Found in Meta Events Manager &gt; "Test Events" tab. Use to verify live CAPI dispatches in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Google Tag Manager (GTM) Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 transition-all hover:shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl shadow-inner">
                <SiGoogletagmanager />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">Google Tag Manager (GTM)</h3>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${form.gtm.isEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {form.gtm.isEnabled ? "Active" : "Disabled"}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                  Injects the official GTM container script into the storefront head and body for tag orchestration.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.gtm.isEnabled}
                onChange={(e) =>
                  setForm({ ...form, gtm: { ...form.gtm, isEnabled: e.target.checked } })
                }
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#2563EB]"></div>
              <span className="ml-3 text-sm font-semibold text-gray-700">
                {form.gtm.isEnabled ? "On" : "Off"}
              </span>
            </label>
          </div>

          <div className="mt-6">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              GTM Container ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.gtm.containerId}
              onChange={(e) =>
                setForm({ ...form, gtm: { ...form.gtm, containerId: e.target.value.trim().toUpperCase() } })
              }
              placeholder="e.g. GTM-XXXXXXX"
              className="w-full max-w-lg px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition uppercase"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Available at the top right of your Google Tag Manager dashboard.
            </p>
          </div>
        </div>

        {/* 3. Google Analytics 4 (GA4) Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 transition-all hover:shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl shadow-inner">
                <SiGoogleanalytics />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">Google Analytics 4 (GA4)</h3>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${form.ga4.isEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {form.ga4.isEnabled ? "Active" : "Disabled"}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                  Injects gtag.js client-side tracking and dispatches GA4 Measurement Protocol server-side transactions.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.ga4.isEnabled}
                onChange={(e) =>
                  setForm({ ...form, ga4: { ...form.ga4, isEnabled: e.target.checked } })
                }
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#2563EB]"></div>
              <span className="ml-3 text-sm font-semibold text-gray-700">
                {form.ga4.isEnabled ? "On" : "Off"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                GA4 Measurement ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.ga4.measurementId}
                onChange={(e) =>
                  setForm({ ...form, ga4: { ...form.ga4, measurementId: e.target.value.trim().toUpperCase() } })
                }
                placeholder="e.g. G-XXXXXXXXXX"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition uppercase"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Admin &gt; Data Streams &gt; Web Stream &gt; Measurement ID.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Measurement Protocol API Secret <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showTokens.ga4Secret ? "text" : "password"}
                  value={form.ga4.apiSecret}
                  onChange={(e) =>
                    setForm({ ...form, ga4: { ...form.ga4, apiSecret: e.target.value.trim() } })
                  }
                  placeholder="e.g. 12AbCdEfGhIjKlMnOpQrSt"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowTokens({ ...showTokens, ga4Secret: !showTokens.ga4Secret })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showTokens.ga4Secret ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Admin &gt; Data Streams &gt; Measurement Protocol API secrets &gt; Create Secret.
              </p>
            </div>
          </div>
        </div>

        {/* 4. TikTok Pixel & Events API Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 transition-all hover:shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center text-2xl shadow-inner">
                <FaTiktok />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">TikTok Pixel & Events API</h3>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${form.tiktok.isEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {form.tiktok.isEnabled ? "Active" : "Disabled"}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                  Tracks conversion and catalog activities for TikTok Ads Manager via browser and server-side Events API.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.tiktok.isEnabled}
                onChange={(e) =>
                  setForm({ ...form, tiktok: { ...form.tiktok, isEnabled: e.target.checked } })
                }
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#2563EB]"></div>
              <span className="ml-3 text-sm font-semibold text-gray-700">
                {form.tiktok.isEnabled ? "On" : "Off"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                TikTok Pixel Code / ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.tiktok.pixelCode}
                onChange={(e) =>
                  setForm({ ...form, tiktok: { ...form.tiktok, pixelCode: e.target.value.trim() } })
                }
                placeholder="e.g. C5XXXXXXXXXXXXXXX"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                TikTok Ads Manager &gt; Assets &gt; Events &gt; Web Events &gt; Pixel Code.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                TikTok Events API Access Token <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showTokens.tiktokToken ? "text" : "password"}
                  value={form.tiktok.accessToken}
                  onChange={(e) =>
                    setForm({ ...form, tiktok: { ...form.tiktok, accessToken: e.target.value.trim() } })
                  }
                  placeholder="e.g. 7c9a..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowTokens({ ...showTokens, tiktokToken: !showTokens.tiktokToken })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showTokens.tiktokToken ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Settings &gt; Events API &gt; Generate Access Token.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-base font-bold shadow-lg shadow-[#2563EB]/25 transition disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <FiRefreshCw className="animate-spin" /> Saving Changes...
              </>
            ) : (
              <>
                <FiSave /> Save Marketing & Tracking Settings
              </>
            )}
          </button>
        </div>
      </form>

      {/* Live Server Tracking Log Stream */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
              <FiActivity />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Tracking Activity Logs</h3>
              <p className="text-xs text-gray-500">Live server audit trail of dispatched CAPI / GA4 / TikTok events</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refetchLogs()}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition"
            title="Refresh logs"
          >
            <FiRefreshCw size={16} className={isLoadingLogs ? "animate-spin" : ""} />
          </button>
        </div>

        {logsData?.data && logsData.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Order / User ID</th>
                  <th className="py-3 px-4">Meta CAPI</th>
                  <th className="py-3 px-4">GA4</th>
                  <th className="py-3 px-4">TikTok</th>
                  <th className="py-3 px-4">Dispatched At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logsData.data.map((log) => {
                  const metaRes = log.providers.find((p) => p.provider === "facebook");
                  const ga4Res = log.providers.find((p) => p.provider === "ga4");
                  const ttRes = log.providers.find((p) => p.provider === "tiktok");

                  return (
                    <tr key={log._id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3 px-4 font-semibold text-gray-800">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">
                          {log.eventName}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-500">
                        {log.orderId ? `Order #${log.orderId.slice(-6)}` : log.userIdentifier || "Guest"}
                      </td>
                      <td className="py-3 px-4">
                        {metaRes ? (
                          metaRes.success ? (
                            <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                              <FiCheckCircle size={14} /> 200 OK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-500 font-medium" title={metaRes.error}>
                              <FiXCircle size={14} /> Failed
                            </span>
                          )
                        ) : (
                          <span className="text-gray-300">Disabled</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {ga4Res ? (
                          ga4Res.success ? (
                            <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                              <FiCheckCircle size={14} /> 204 OK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-500 font-medium" title={ga4Res.error}>
                              <FiXCircle size={14} /> Failed
                            </span>
                          )
                        ) : (
                          <span className="text-gray-300">Disabled</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {ttRes ? (
                          ttRes.success ? (
                            <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                              <FiCheckCircle size={14} /> 200 OK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-500 font-medium" title={ttRes.error}>
                              <FiXCircle size={14} /> Failed
                            </span>
                          )
                        ) : (
                          <span className="text-gray-300">Disabled</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-gray-400">
            No tracking logs recorded yet. Send a test event or place an order to see live activity here!
          </div>
        )}
      </div>
    </div>
  );
}
