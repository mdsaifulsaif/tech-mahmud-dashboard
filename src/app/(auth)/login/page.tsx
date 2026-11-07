"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiMail,
  FiLock,
  FiLoader,
  FiShield,
  FiEye,
  FiEyeOff,
  FiLayers,
  FiShoppingBag,
  FiTrendingUp,
  FiCheckCircle,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error(res.error || "Invalid credentials");
      } else {
        toast.success("Welcome back, Admin!");
        router.push("/dashboard/admin");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* ============================================================== */}
      {/* LEFT SIDE: Brand Showcase & Hero Section (Desktop)            */}
      {/* ============================================================== */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-10 xl:p-14 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 border-r border-slate-800/70">
        {/* Ambient Decorative Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle Geometric Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Header / Brand Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/30">
              TM
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">
                Tech Mahmud
              </h1>
              <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-widest mt-1">
                Management Portal
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            System Live & Secure
          </div>
        </div>

        {/* Center: Punchy Hero & Feature Highlights */}
        <div className="relative z-10 my-auto py-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold tracking-wide mb-5">
            <FiShield size={13} />
            Enterprise E-Commerce Operations
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-[1.2]">
            Streamlined Control Over Inventory, Orders & Storefront.
          </h2>

          <p className="mt-4 text-sm xl:text-base text-slate-400 leading-relaxed">
            Welcome to the centralized management hub for Tech Mahmud. Monitor
            real-time transactions, manage multi-tier categories, toggle promotional
            tags, and handle fulfillment seamlessly.
          </p>

          {/* Feature List */}
          <div className="mt-8 space-y-3.5">
            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                <FiLayers size={18} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">
                  Dynamic Catalog & Tag Management
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Instant toggles for Featured, Trending, and New Collection badges directly from tables.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                <FiShoppingBag size={18} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">
                  Order Dispatch & Tracking
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Automated status progression, invoice downloads, and courier tracking synchronizations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-lg bg-cyan-600/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                <FiTrendingUp size={18} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">
                  Real-Time Sales & Stock Velocity
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Live revenue breakdowns, popular search tags, and rapid restock indicators.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Banner */}
          <div className="mt-7 grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Catalog</div>
              <div className="text-lg font-bold text-white mt-0.5">100% Synced</div>
            </div>
            <div className="border-x border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Security Engine</div>
              <div className="text-lg font-bold text-emerald-400 mt-0.5">TLS Encrypted</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Portal Access</div>
              <div className="text-lg font-bold text-blue-400 mt-0.5">Admin Only</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800/60">
          <span>&copy; {new Date().getFullYear()} Tech Mahmud Ltd.</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <FiCheckCircle size={13} className="text-emerald-400" />
            Verified Secure Endpoint
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT SIDE: Admin Login Form                                   */}
      {/* ============================================================== */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 xl:p-16 relative overflow-hidden">
        {/* Glow behind the login box */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Brand Header (Visible only on mobile/tablet) */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-13 h-13 mx-auto rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-blue-500/25 mb-3">
              TM
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Tech Mahmud
            </h2>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mt-1">
              Gadget & Clothing Management Portal
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-7 sm:p-9 border border-slate-800/90 relative">
            {/* Header */}
            <div className="mb-7">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-2.5">
                <FiLock size={12} />
                Restricted Access
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Sign In to Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                Enter your administrative credentials to manage store operations.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <FiMail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={17}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Master key
                  </span>
                </div>
                <div className="relative">
                  <FiLock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={17}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me row */}
              <div className="flex items-center justify-between pt-1 pb-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/40 focus:ring-offset-0 cursor-pointer"
                  />
                  Remember my session
                </label>
                <span className="text-xs text-slate-500">
                  Protected portal
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 active:scale-[0.99] disabled:opacity-60 text-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" size={17} />
                    Authenticating Credentials...
                  </>
                ) : (
                  <>
                    <FiShield size={16} />
                    Sign In to Admin Panel
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Helper Hint */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <FiLock size={12} className="text-blue-400" />
                256-Bit SSL Encrypted
              </span>
              <span>Tech Mahmud Portal</span>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="mt-5 text-center text-xs text-slate-500">
            Protected by Tech Mahmud Security Engine & NextAuth
          </div>
        </div>
      </div>
    </div>
  );
}
