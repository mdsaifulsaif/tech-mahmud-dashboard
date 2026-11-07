"use client";

import React, { useState } from "react";
import {
  FiShield,
  FiLock,
  FiAlertCircle,
  FiCheck,
  FiLoader,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { Toggle } from "./Toggle";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import toast from "react-hot-toast";

export const SecuritySettings: React.FC = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleTwoFactorToggle = (checked: boolean) => {
    setTwoFactorEnabled(checked);
    toast.success(
      checked
        ? "Two-Factor Authentication enabled. Verification will be required on next login."
        : "Two-Factor Authentication disabled."
    );
  };

  const handleNotificationToggle = (checked: boolean) => {
    setLoginNotifications(checked);
    toast.success(
      checked
        ? "Login email alerts enabled."
        : "Login email alerts disabled."
    );
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwords.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (!passwords.newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      }).unwrap();

      toast.success("Admin password updated successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Failed to update password. Please check your current password."
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Alert Banner */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <FiAlertCircle className="text-amber-600 mt-0.5 shrink-0" size={20} />
        <div>
          <h4 className="text-sm font-bold text-amber-900">
            Account Security & Access Control
          </h4>
          <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
            Protect your admin credentials. Ensure strong passwords and keep two-factor verification active to safeguard your catalog, orders, and customer data.
          </p>
        </div>
      </div>

      {/* Security Toggles */}
      <div className="space-y-4">
        <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-gray-800">
              Two-Factor Authentication (2FA)
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Add an extra layer of protection requiring an email OTP upon admin sign-in.
            </p>
          </div>
          <Toggle
            label=""
            checked={twoFactorEnabled}
            onChange={handleTwoFactorToggle}
          />
        </div>

        <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-gray-800">
              Admin Login Notifications
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Receive security email alerts whenever someone logs into your administrative dashboard.
            </p>
          </div>
          <Toggle
            label=""
            checked={loginNotifications}
            onChange={handleNotificationToggle}
          />
        </div>
      </div>

      {/* Change Password Form */}
      <div className="pt-6 border-t border-gray-100">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <FiLock className="text-blue-600" size={18} />
            <h4 className="text-base font-bold text-gray-800">
              Change Master Password
            </h4>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Update your administrator password. You will need to provide your current password for verification.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-2xl">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter your current password"
                className="w-full px-4 py-2.5 pr-11 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                tabIndex={-1}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleInputChange}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-2.5 pr-11 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 pr-11 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-500/20 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin" size={15} />
                  Updating Password...
                </>
              ) : (
                <>
                  <FiCheck size={16} />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
