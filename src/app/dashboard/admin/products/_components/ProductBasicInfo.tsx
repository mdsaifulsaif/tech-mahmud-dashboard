"use client";

import { FiInfo } from "react-icons/fi";

interface Props {
  formData: any;
  categories: any[];
  brands: any[];
  isEditing: boolean;
  productType: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onLowdownChange: (value: string[]) => void;
  onTagsChange: (tags: string[]) => void;
}

const ProductBasicInfo = ({
  formData, categories, brands, isEditing, productType, onChange, onLowdownChange, onTagsChange
}: Props) => {
  return (
    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
          <FiInfo size={22} />
        </div>
        <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
      </div>

      {/* Product Title */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Product Title *</label>
        <input
          type="text" name="name" required placeholder="Enter product name"
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#2563EB] transition-all text-sm"
          value={formData.name} onChange={onChange}
        />
      </div>

      {/* Slug + Brand (Combo তে Brand নেই) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Product Slug</label>
          <input
            type="text" name="slug" placeholder="product-url-slug"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] transition-all text-xs font-mono"
            value={formData.slug} onChange={onChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Brand</label>
          <select
            name="brandID"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-blue-600 transition-all text-sm"
            value={formData.brandID}
            onChange={onChange}
          >
            <option value="nonebrand">None / No Brand</option>
            {brands.map((b: any) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category — সবসময় দেখাবে */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Category *</label>
        <select
          name="categoryID" required
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#2563EB] transition-all text-sm"
          value={formData.categoryID} onChange={onChange}
        >
          <option value="">Select Category</option>
          {categories.map((cat: any) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Short Description + Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Short Description *</label>
          <input
            type="text" name="shortDescription" required placeholder="Short brief about product"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md outline-none focus:border-[#2563EB] transition-all text-sm"
            value={formData.shortDescription} onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Highlights (One per line)</label>
          <textarea
            rows={2} placeholder="Premium Quality&#10;100% Organic"
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-md outline-none focus:border-[#2563EB] transition-all text-sm"
            value={Array.isArray(formData.lowdown) ? formData.lowdown.join("\n") : ""}
            onChange={(e) => onLowdownChange(e.target.value.split("\n"))}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Tags</label>
        <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-md bg-white min-h-[44px]">
          {(formData.tags || []).map((tag: string, idx: number) => (
            <span key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold rounded-full">
              {tag}
              <button
                type="button"
                onClick={() => onTagsChange(formData.tags.filter((_: string, i: number) => i !== idx))}
                className="hover:text-red-500 transition-colors"
              >×</button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Tag লিখে Enter চাপুন..."
            className="flex-1 min-w-[150px] outline-none text-sm bg-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const val = (e.target as HTMLInputElement).value.trim();
                if (val && !(formData.tags || []).includes(val)) {
                  onTagsChange([...(formData.tags || []), val]);
                }
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
        </div>
        <p className="text-xs text-gray-400">Enter বা comma চাপলে tag যোগ হবে</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Product Description</label>
        <textarea
          name="description" rows={6} placeholder="Write a detailed description..."
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md outline-none focus:border-[#2563EB] transition-all text-sm"
          value={formData.description || ""} onChange={onChange}
        />
      </div>
    </div>
  );
};

export default ProductBasicInfo;