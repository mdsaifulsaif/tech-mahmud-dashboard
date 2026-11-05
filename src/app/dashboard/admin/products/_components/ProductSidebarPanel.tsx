"use client";

import { FiSettings } from "react-icons/fi";

interface Props {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ProductSidebarPanel = ({ formData, onChange }: Props) => {
  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <FiSettings /> Status
        </h3>
        <select
          name="status"
          className="w-full p-2.5 border border-gray-200 bg-white text-sm rounded-md outline-none focus:border-[#2563EB]"
          value={formData.status}
          onChange={onChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Promotion */}
      <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <FiSettings /> Promotion
        </h3>
        {[
          { key: "isFeatured", label: "Featured Product", color: "bg-yellow-500" },
          { key: "isNewCollection", label: "New Collection (Homepage)", color: "bg-[#FF5A5A]" },
          { key: "isOnSale", label: "On Sale Mode", color: "bg-rose-500" },
          { key: "isNew", label: "New Arrival Badge", color: "bg-emerald-500" },
        ].map((item) => (
          <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50/50 rounded border border-gray-100 cursor-pointer">
            <span className="text-xs font-bold text-gray-600">{item.label}</span>
            <div className="relative">
              <input
                type="checkbox"
                name={item.key}
                className="sr-only"
                checked={formData[item.key]}
                onChange={onChange}
              />
              <div className={`w-10 h-5 rounded-full transition-colors ${formData[item.key] ? item.color : "bg-gray-200"}`}></div>
              <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-all ${formData[item.key] ? "translate-x-5" : ""}`}></div>
            </div>
          </label>
        ))}
      </div>

      {/* SEO */}
      <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800">SEO</h3>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400">Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            placeholder="SEO Title"
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none focus:border-[#2563EB]"
            value={formData.metaTitle}
            onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400">Meta Description</label>
          <textarea
            name="metaDescription"
            rows={3}
            placeholder="SEO Description"
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none focus:border-[#2563EB]"
            value={formData.metaDescription}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductSidebarPanel;