"use client";

import React, { useState } from "react";
import { FiCheck, FiPlus, FiX } from "react-icons/fi";

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "28", "30", "32", "34", "36"];
const POPULAR_COLORS = [
  { name: "Black", hexCode: "#000000" },
  { name: "White", hexCode: "#FFFFFF" },
  { name: "Navy Blue", hexCode: "#1E3A8A" },
  { name: "Heather Gray", hexCode: "#9CA3AF" },
  { name: "Olive Green", hexCode: "#4D7C0F" },
  { name: "Burgundy", hexCode: "#831843" },
  { name: "Beige", hexCode: "#F5F5DC" },
];

interface Props {
  clothingAttributes: {
    sizes?: string[];
    colors?: Array<{ name: string; hexCode?: string }>;
    sizeGuideUrl?: string;
    material?: string;
    fit?: string;
  };
  onChange: (updatedAttributes: any) => void;
}

const ClothingAttributesPanel: React.FC<Props> = ({
  clothingAttributes = { sizes: [], colors: [] },
  onChange,
}) => {
  const selectedSizes = clothingAttributes.sizes || [];
  const selectedColors = clothingAttributes.colors || [];

  const [customSize, setCustomSize] = useState("");
  const [customColorName, setCustomColorName] = useState("");
  const [customColorHex, setCustomColorHex] = useState("#2563EB");

  const toggleSize = (size: string) => {
    const nextSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    onChange({ ...clothingAttributes, sizes: nextSizes });
  };

  const addCustomSize = () => {
    const trimmed = customSize.trim().toUpperCase();
    if (trimmed && !selectedSizes.includes(trimmed)) {
      onChange({ ...clothingAttributes, sizes: [...selectedSizes, trimmed] });
      setCustomSize("");
    }
  };

  const addColor = (color: { name: string; hexCode?: string }) => {
    if (!selectedColors.some((c) => c.name.toLowerCase() === color.name.toLowerCase())) {
      onChange({
        ...clothingAttributes,
        colors: [...selectedColors, color],
      });
    }
  };

  const removeColor = (colorName: string) => {
    onChange({
      ...clothingAttributes,
      colors: selectedColors.filter((c) => c.name !== colorName),
    });
  };

  const handleCustomColorAdd = () => {
    if (customColorName.trim()) {
      addColor({
        name: customColorName.trim(),
        hexCode: customColorHex,
      });
      setCustomColorName("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 text-lg">
          👕
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Clothing & Apparel Specifications</h2>
          <p className="text-xs text-gray-500">
            Define available sizes, color swatches, fabric material, and fit profile
          </p>
        </div>
      </div>

      {/* 1. Size Pills Selector */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Available Sizes ({selectedSizes.length} selected)
        </label>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                type="button"
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  isSelected
                    ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-purple-300"
                }`}
              >
                {size} {isSelected && "✓"}
              </button>
            );
          })}
        </div>

        {/* Custom Size Input */}
        <div className="flex items-center gap-2 max-w-xs mt-2">
          <input
            type="text"
            placeholder="Custom Size (e.g. Free Size)"
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-purple-500 flex-1"
          />
          <button
            type="button"
            onClick={addCustomSize}
            className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-100 border border-purple-200"
          >
            + Add
          </button>
        </div>
      </div>

      {/* 2. Color Swatches */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
          Color Variations ({selectedColors.length} selected)
        </label>

        {/* Popular Color Shortcuts */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400">Quick add:</span>
          {POPULAR_COLORS.map((color) => (
            <button
              type="button"
              key={color.name}
              onClick={() => addColor(color)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200 hover:border-gray-400 bg-white"
            >
              <span
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: color.hexCode }}
              />
              {color.name}
            </button>
          ))}
        </div>

        {/* Selected Color Badges */}
        {selectedColors.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
            {selectedColors.map((c) => (
              <span
                key={c.name}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-white border border-gray-200 text-gray-800 shadow-2xs"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs"
                  style={{ backgroundColor: c.hexCode || "#000" }}
                />
                {c.name}
                <button
                  type="button"
                  onClick={() => removeColor(c.name)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FiX size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Custom Color Creator */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="color"
            value={customColorHex}
            onChange={(e) => setCustomColorHex(e.target.value)}
            className="w-9 h-9 p-0.5 rounded-lg border border-gray-200 cursor-pointer bg-white"
            title="Pick Color"
          />
          <input
            type="text"
            placeholder="Color Name (e.g. Royal Blue)"
            value={customColorName}
            onChange={(e) => setCustomColorName(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-purple-500 flex-1 max-w-xs"
          />
          <button
            type="button"
            onClick={handleCustomColorAdd}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 shadow-xs"
          >
            Add Color
          </button>
        </div>
      </div>

      {/* 3. Material, Fit & Size Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Fabric / Material</label>
          <input
            type="text"
            placeholder="e.g. 100% Combed Cotton, 180 GSM"
            value={clothingAttributes.material || ""}
            onChange={(e) =>
              onChange({ ...clothingAttributes, material: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Fit Type</label>
          <select
            value={clothingAttributes.fit || "Regular Fit"}
            onChange={(e) =>
              onChange({ ...clothingAttributes, fit: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 bg-white"
          >
            <option value="Regular Fit">Regular Fit</option>
            <option value="Slim Fit">Slim Fit</option>
            <option value="Relaxed Fit">Relaxed Fit</option>
            <option value="Oversized Fit">Oversized Fit</option>
            <option value="Athletic Fit">Athletic Fit</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Size Guide URL / Image</label>
          <input
            type="url"
            placeholder="https://example.com/size-guide.png"
            value={clothingAttributes.sizeGuideUrl || ""}
            onChange={(e) =>
              onChange({ ...clothingAttributes, sizeGuideUrl: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500 bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default ClothingAttributesPanel;

