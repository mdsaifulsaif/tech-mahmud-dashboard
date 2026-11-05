"use client";

import { FiTag, FiLayers, FiSmartphone, FiShoppingBag } from "react-icons/fi";

interface Props {
  productType: string; // 'clothing' | 'gadget' | 'general' | 'single' | 'combo'
  onChange: (type: string) => void;
  variantType?: "single" | "variant";
  onVariantTypeChange?: (vType: "single" | "variant") => void;
}

const ProductTypeToggle = ({
  productType,
  onChange,
  variantType = "single",
  onVariantTypeChange,
}: Props) => {
  // Normalize legacy 'single'/'combo' to 'general' or preserve clothing/gadget
  const activeNiche =
    productType === "clothing"
      ? "clothing"
      : productType === "gadget"
      ? "gadget"
      : "general";

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
      {/* 1. Category / Niche Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <FiTag className="text-blue-600" size={18} />
          <div>
            <span className="text-sm font-bold text-gray-800">Product Category Type:</span>
            <p className="text-xs text-gray-500">Select product niche to enable tailored attributes</p>
          </div>
        </div>

        <div className="inline-flex bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => onChange("clothing")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeNiche === "clothing"
                ? "bg-white text-purple-700 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            👕 Clothing
          </button>
          <button
            type="button"
            onClick={() => onChange("gadget")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeNiche === "gadget"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            📱 Gadget
          </button>
          <button
            type="button"
            onClick={() => onChange("general")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeNiche === "general"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            📦 General
          </button>
        </div>
      </div>

      {/* 2. Variant Mode Toggle (Single vs Multi-Variant) */}
      {onVariantTypeChange && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FiLayers className="text-indigo-600" size={18} />
            <div>
              <span className="text-sm font-bold text-gray-800">Inventory Mode:</span>
              <p className="text-xs text-gray-500">
                {variantType === "single"
                  ? "Single SKU, unified price & stock"
                  : "Multiple variants (Sizes, Colors, Storage, etc.)"}
              </p>
            </div>
          </div>

          <div className="inline-flex bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => onVariantTypeChange("single")}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                variantType === "single"
                  ? "bg-white text-gray-900 shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Single Product
            </button>
            <button
              type="button"
              onClick={() => onVariantTypeChange("variant")}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                variantType === "variant"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Multi-Variant Matrix
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTypeToggle;
