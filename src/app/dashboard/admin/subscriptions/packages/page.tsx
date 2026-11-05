"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiBox,
  FiPackage,
  FiCheckCircle,
  FiRefreshCw,
  FiStar,
  FiCheck,
  FiX,
} from "react-icons/fi";
import {
  useGetSubscriptionPackagesQuery,
  useTogglePinnedPackageMutation,
  useDeleteSubscriptionPackageMutation,
  SubscriptionPackageItem,
} from "@/redux/api/subscriptionApi";
import toast from "react-hot-toast";

export default function SubscriptionPackagesAdminPage() {
  const [search, setSearch] = useState("");
  const [boxTypeFilter, setBoxTypeFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    data: packagesData,
    isLoading,
    refetch,
  } = useGetSubscriptionPackagesQuery({
    search: search.trim() || undefined,
    boxType: boxTypeFilter !== "all" ? boxTypeFilter : undefined,
  });

  const [togglePinned, { isLoading: isToggling }] = useTogglePinnedPackageMutation();
  const [deletePackage, { isLoading: isDeleting }] = useDeleteSubscriptionPackageMutation();

  const packages = packagesData?.data || [];

  const handleTogglePinned = async (id: string, currentStatus: boolean) => {
    try {
      await togglePinned(id).unwrap();
      toast.success(currentStatus ? "Unpinned from homepage" : "Pinned to homepage!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to toggle pinned status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription package?")) return;
    try {
      setDeletingId(id);
      await deletePackage(id).unwrap();
      toast.success("Package deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete package");
    } finally {
      setDeletingId(null);
    }
  };

  // Quick stats
  const totalPackages = packages.length;
  const activeCount = packages.filter((p) => p.status === "active").length;
  const pinnedCount = packages.filter((p) => p.isPinnedToHome).length;

  const uniqueCategories = Array.from(
    new Set(
      packages
        .map((p) => p.category || p.boxType)
        .filter((c): c is string => Boolean(c && c.trim().length > 0))
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <FiBox size={22} />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Subscription Packages</h1>
              <p className="text-gray-500 text-sm">
                Manage weekly and monthly recurring packages, included item lists & homepage pinned boxes
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
            title="Refresh list"
          >
            <FiRefreshCw size={18} />
          </button>
          <Link
            href="/dashboard/admin/subscriptions/packages/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-sm shadow-sm transition-all"
          >
            <FiPlus size={18} />
            Add New Package
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold">
            <FiBox />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium block">Total Packages</span>
            <span className="text-lg font-black text-gray-800">{totalPackages}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FiCheck />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium block">Active Packages</span>
            <span className="text-lg font-black text-gray-800">{activeCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <FiStar />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-medium block">Pinned to Home</span>
            <span className="text-lg font-black text-gray-800">{pinnedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by package name or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:border-emerald-600 border-gray-200"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={boxTypeFilter}
            onChange={(e) => setBoxTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-xl text-sm bg-white border-gray-200 focus:outline-none focus:border-emerald-600"
          >
            <option value="all">All Categories ({totalPackages})</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Packages Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400">Loading packages...</div>
        ) : packages.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            No subscription packages found. Click "Add New Package" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Package</th>
                  <th className="px-6 py-4">Box Type</th>
                  <th className="px-6 py-4">Pricing</th>
                  <th className="px-6 py-4">Items Included</th>
                  <th className="px-6 py-4 text-center">Home Pin</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {packages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-gray-50/60 transition-colors">
                    {/* Package Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={pkg.thumbnail || "/images/monthly_cleaning_box.jpg"}
                          alt={pkg.name}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-gray-800 line-clamp-1">{pkg.name}</p>
                          <span className="text-xs text-gray-400 font-mono">
                            {pkg.frequencyText || (pkg.frequency === "weekly" ? "Weekly (1x)" : "Monthly (1x)")}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Box Category */}
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20">
                        {pkg.category || pkg.boxType || "General"}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-extrabold text-[#2563EB]">৳{pkg.subscriptionPrice}</span>
                          <span className="text-xs text-gray-400 line-through">৳{pkg.regularPrice}</span>
                        </div>
                        <span className="text-[10px] text-red-600 font-bold block">
                          {pkg.discountPercent || 8}% Discount
                        </span>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <span className="text-xs font-bold text-gray-700 block mb-1">
                          {pkg.items?.length || 0} items in box
                        </span>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {pkg.items?.map((it) => `${it.itemName}${it.quantity ? ` (${it.quantity})` : ""}`).join(", ")}
                        </p>
                      </div>
                    </td>

                    {/* Pinned to Homepage Switch */}
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePinned(pkg._id, pkg.isPinnedToHome)}
                        disabled={isToggling}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          pkg.isPinnedToHome
                            ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                        title="Click to toggle pin on homepage"
                      >
                        <FiStar className={pkg.isPinnedToHome ? "fill-purple-600" : ""} size={12} />
                        <span>{pkg.isPinnedToHome ? "Pinned" : "No"}</span>
                      </button>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          pkg.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {pkg.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/admin/subscriptions/packages/${pkg._id}/edit`}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit package"
                        >
                          <FiEdit2 size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(pkg._id)}
                          disabled={isDeleting && deletingId === pkg._id}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete package"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
