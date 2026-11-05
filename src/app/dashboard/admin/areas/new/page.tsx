"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  FiSave, 
  FiInfo, 
  FiMapPin, 
  FiNavigation, 
  FiExternalLink, 
  FiCrosshair,
  FiArrowLeft 
} from "react-icons/fi";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  useCreateAreaMutation,
  useUpdateAreaMutation,
  useGetSingleAreaQuery,
} from "@/redux/api/areaApi";

// Known landmarks in Barisal for instant 1-click autofill
const BARISAL_COORDINATE_PRESETS = [
  { name: "Bangla Bazar", lat: 22.6950, lng: 90.3690 },
  { name: "Rupatoli", lat: 22.6780, lng: 90.3450 },
  { name: "Barisal Sadar", lat: 22.7055, lng: 90.3555 },
  { name: "Natullabad", lat: 22.6885, lng: 90.3625 },
  { name: "Kashipur", lat: 22.7185, lng: 90.3680 },
  { name: "Choumatha", lat: 22.7020, lng: 90.3580 },
  { name: "Amtala", lat: 22.6755, lng: 90.3745 },
  { name: "Notun Bazar", lat: 22.7080, lng: 90.3700 },
  { name: "C&B Road", lat: 22.7100, lng: 90.3600 },
  { name: "Launch Ghat", lat: 22.7060, lng: 90.3750 },
];

const AreaFormInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const areaId = searchParams.get("id");
  const isEditing = !!areaId;

  const [createArea, { isLoading: isCreating }] = useCreateAreaMutation();
  const [updateArea, { isLoading: isUpdating }] = useUpdateAreaMutation();
  const { data: areaToEdit, isLoading: isFetching } = useGetSingleAreaQuery(
    areaId,
    { skip: !isEditing }
  );

  const [formData, setFormData] = useState({
    name: "",
    city: "Barisal",
    description: "",
    isActive: true,
    latitude: "" as string | number,
    longitude: "" as string | number,
    radius: 1500,
  });

  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (isEditing && areaToEdit?.data) {
      const area = areaToEdit.data;
      // Support latitude/longitude or legacy coordinates array
      const latVal = area.latitude ?? area.coordinates?.[0]?.lat ?? "";
      const lngVal = area.longitude ?? area.coordinates?.[0]?.lng ?? "";
      
      setFormData({
        name: area.name || "",
        city: area.city || "Barisal",
        description: area.description || "",
        isActive: area.isActive ?? true,
        latitude: latVal,
        longitude: lngVal,
        radius: area.radius ?? 1500,
      });
    } else if (!isEditing) {
      const prefillName = searchParams.get("name");
      if (prefillName) {
        setFormData((prev) => ({ ...prev, name: prefillName }));
      }
    }
  }, [isEditing, areaToEdit, searchParams]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPreset = (preset: typeof BARISAL_COORDINATE_PRESETS[0]) => {
    setFormData((prev) => ({
      ...prev,
      name: prev.name.trim() === "" ? preset.name : prev.name,
      latitude: preset.lat,
      longitude: preset.lng,
    }));
    toast.success(`Coordinates applied for ${preset.name}`);
  };

  const handleGetDeviceLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        toast.success(`Current GPS detected: ${lat}, ${lng}`);
      },
      (err) => {
        setIsLocating(false);
        toast.error(`GPS Error: ${err.message || "Failed to get location"}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Area name is required");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      city: formData.city.trim() || "Barisal",
      description: formData.description.trim(),
      isActive: formData.isActive,
      latitude:
        formData.latitude !== "" &&
        formData.latitude !== null &&
        !isNaN(Number(formData.latitude))
          ? Number(formData.latitude)
          : null,
      longitude:
        formData.longitude !== "" &&
        formData.longitude !== null &&
        !isNaN(Number(formData.longitude))
          ? Number(formData.longitude)
          : null,
      radius: formData.radius ? Number(formData.radius) : 1500,
    };

    try {
      if (isEditing) {
        await updateArea({ id: areaId, data: payload }).unwrap();
        toast.success("Area updated successfully");
      } else {
        await createArea(payload).unwrap();
        toast.success("Area created successfully");
      }
      router.push("/dashboard/admin/areas");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong saving area");
    }
  };

  const hasValidCoords =
    formData.latitude !== "" &&
    formData.longitude !== "" &&
    !isNaN(Number(formData.latitude)) &&
    !isNaN(Number(formData.longitude));

  if (isEditing && isFetching) {
    return (
      <div className="p-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Loading area data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard/admin/areas"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiArrowLeft size={18} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEditing ? "Edit Delivery Area" : "Create New Delivery Area"}
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            {isEditing
              ? `Manage zone & GPS coordinates for: ${formData.name || "Area"}`
              : "Add new delivery zone and map coordinates for Barisal"}
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isCreating || isUpdating}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-md font-bold hover:bg-[#1D4ED8] transition-all shadow-md disabled:opacity-50"
        >
          <FiSave size={20} />
          {isCreating || isUpdating
            ? "Saving..."
            : isEditing
            ? "Update Area"
            : "Save Area"}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <FiMapPin className="text-[#2563EB]" size={20} />
            <h2 className="font-bold text-gray-800">Basic Area Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Area Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Rupatoli, Bangla Bazar, Natullabad"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] transition-all text-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                City
              </label>
              <input
                type="text"
                name="city"
                placeholder="Barisal"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] transition-all text-sm"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows={2}
              placeholder="Short notes or landmark information for this delivery zone..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] transition-all text-sm resize-y"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-700">Area Status</p>
              <p className="text-xs text-gray-400">
                When active, customers can select this area during checkout
              </p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="isActive"
                  className="sr-only"
                  checked={formData.isActive}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }));
                  }}
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${
                    formData.isActive ? "bg-[#2563EB]" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-md transition-all ${
                    formData.isActive ? "translate-x-5" : ""
                  }`}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-700 select-none">
                {formData.isActive ? "Active Zone" : "Inactive Zone"}
              </span>
            </label>
          </div>
        </div>

        {/* Map Coordinates & Coverage Card */}
        <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-100 gap-2">
            <div className="flex items-center gap-2">
              <FiNavigation className="text-[#2563EB]" size={20} />
              <div>
                <h2 className="font-bold text-gray-800">
                  GPS Coordinates & Landing Page Map
                </h2>
                <p className="text-xs text-gray-400">
                  These coordinates pin and highlight this zone on the customer landing page map
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGetDeviceLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-all self-start sm:self-auto disabled:opacity-50"
            >
              <FiCrosshair size={14} className={isLocating ? "animate-spin text-[#2563EB]" : ""} />
              {isLocating ? "Detecting GPS..." : "Detect Current GPS"}
            </button>
          </div>

          {/* Quick presets for common Barisal locations */}
          <div className="space-y-2 bg-emerald-50/40 p-4 rounded-md border border-emerald-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Quick Barisal Location Presets
              </span>
              <span className="text-[11px] text-emerald-700">
                Click any zone to autofill coordinates
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {BARISAL_COORDINATE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 text-xs bg-white text-gray-700 border border-emerald-200 rounded-md hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all font-medium shadow-2xs"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Coordinate Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                <span>Latitude (Lat)</span>
                <span className="text-[11px] text-gray-400 font-normal">e.g. 22.6950</span>
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                placeholder="22.6950"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] transition-all text-sm font-mono"
                value={formData.latitude}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                <span>Longitude (Lng)</span>
                <span className="text-[11px] text-gray-400 font-normal">e.g. 90.3690</span>
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                placeholder="90.3690"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] transition-all text-sm font-mono"
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                <span>Radius (Meters)</span>
                <span className="text-[11px] text-gray-400 font-normal">e.g. 1500m</span>
              </label>
              <input
                type="number"
                step="50"
                name="radius"
                placeholder="1500"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] transition-all text-sm"
                value={formData.radius}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Coordinate Verification / Map Preview Link */}
          {hasValidCoords ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span>
                  Valid Coordinates: <strong className="font-mono text-gray-800">{formData.latitude}, {formData.longitude}</strong> (~{formData.radius}m coverage)
                </span>
              </div>
              <a
                href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#2563EB] font-semibold hover:underline"
              >
                <span>Verify on Google Maps</span>
                <FiExternalLink size={13} />
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800">
              <FiInfo size={15} className="shrink-0" />
              <span>
                If left empty, system will automatically match coordinates using the Area Name for known Barisal zones.
              </span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

const AreaForm = () => {
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center text-[#2563EB]">
          Initializing area form...
        </div>
      }
    >
      <AreaFormInner />
    </Suspense>
  );
};

export default AreaForm;
