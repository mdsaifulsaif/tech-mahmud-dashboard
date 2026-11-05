"use client";

import React, { useState } from "react";
import { FiDollarSign, FiTrash2, FiPlus, FiTag, FiLayers } from "react-icons/fi";

interface Props {
  formData: any;
  units: any[];
  hasVariants: boolean;
  productType?: string; // 'clothing' | 'gadget' | 'general'
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onVariantChange: (index: number, field: string, value: any) => void;
  onAddVariant: (customVariant?: any) => void;
  onRemoveVariant: (index: number) => void;
}

const ProductPricingPanel = ({
  formData,
  units,
  hasVariants,
  productType = "general",
  onChange,
  onVariantChange,
  onAddVariant,
  onRemoveVariant,
}: Props) => {
  const isClothing = productType === "clothing";
  const isGadget = productType === "gadget";
  const showGroceryUnits = productType === "general";

  // Quick helper to add variant with custom attribute key-values
  const [newVarSize, setNewVarSize] = useState("");
  const [newVarColor, setNewVarColor] = useState("");
  const [newVarStorage, setNewVarStorage] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handleQuickAdd = () => {
    const attributes: Record<string, string> = {};
    if (isClothing) {
      if (newVarSize) attributes.size = newVarSize;
      if (newVarColor) attributes.color = newVarColor;
    } else if (isGadget) {
      if (newVarStorage) attributes.storage = newVarStorage;
      if (newVarColor) attributes.color = newVarColor;
    }

    const autoSku = `${formData.sku || "PROD"}-${
      attributes.size || attributes.storage || ""
    }${attributes.color ? `-${attributes.color}` : ""}`.toUpperCase();

    onAddVariant({
      sku: autoSku,
      costPrice: formData.costPrice || "",
      regularPrice: formData.regularPrice || "",
      salePrice: formData.salePrice || "",
      stock: 10,
      attributes,
    });

    setNewVarSize("");
    setNewVarColor("");
    setNewVarStorage("");
    setShowQuickAdd(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <FiDollarSign size={22} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Pricing & Inventory</h2>
          <p className="text-xs text-gray-500">
            {hasVariants
              ? "Multi-variant pricing & inventory active (calculated from variant matrix)"
              : "Set standard base price, sale offer, and available stock"}
          </p>
        </div>
      </div>

      {/* ===== Single Mode Pricing ===== */}
      <div className="space-y-4">
        {/* Optional grocery unit only if general */}
        {showGroceryUnits && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Unit (Optional)</label>
              <select
                name="unit"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                value={formData.unit || ""}
                onChange={onChange}
              >
                <option value="">No Unit</option>
                {units.map((u: any) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.shortName})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Weight / Volume</label>
              <input
                type="text"
                name="weightOrVolume"
                placeholder="e.g. 500g or 1.2kg"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                value={formData.weightOrVolume || ""}
                onChange={onChange}
              />
            </div>
          </div>
        )}

        {/* Pricing Inputs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">
              Cost Price <span className="text-gray-400 font-normal">(৳ Buy)</span>
            </label>
            <input
              type="number"
              name="costPrice"
              placeholder="0"
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold outline-none focus:border-blue-500"
              value={formData.costPrice ?? ""}
              onChange={onChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">
              Regular Price * <span className="text-gray-400 font-normal">(৳ Base)</span>
            </label>
            <input
              type="number"
              name="regularPrice"
              placeholder="0"
              required={!hasVariants}
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-blue-500"
              value={formData.regularPrice ?? ""}
              onChange={onChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">
              Sale Price <span className="text-gray-400 font-normal">(৳ Offer)</span>
            </label>
            <input
              type="number"
              name="salePrice"
              placeholder="0"
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-red-600 outline-none focus:border-blue-500"
              value={formData.salePrice ?? ""}
              onChange={onChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">
              Total Stock * <span className="text-gray-400 font-normal">(Units)</span>
            </label>
            <input
              type="number"
              name="stock"
              placeholder="0"
              required={!hasVariants}
              disabled={hasVariants}
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              className={`w-full px-3 py-2 border rounded-lg text-sm font-bold outline-none ${
                hasVariants
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-blue-600 border-gray-200 focus:border-blue-500"
              }`}
              value={formData.stock ?? ""}
              onChange={onChange}
            />
          </div>
        </div>

        {/* SKU + Low Stock Alert */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Product SKU / Barcode</label>
            <input
              type="text"
              name="sku"
              placeholder="e.g. TM-CLOTH-010"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono outline-none focus:border-blue-500"
              value={formData.sku || ""}
              onChange={onChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Low Stock Alert Threshold</label>
            <input
              type="number"
              name="lowStockAlert"
              placeholder="5"
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
              value={formData.lowStockAlert ?? 5}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      {/* ===== Multi-Variant Matrix Section ===== */}
      {hasVariants && (
        <div className="pt-6 border-t border-gray-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <FiLayers className="text-blue-600" />
                Product Variants Matrix ({formData.variants?.length || 0})
              </h3>
              <p className="text-xs text-gray-500">
                Define unique SKU, stock, and price overrides for each attribute combination
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-xs"
              >
                + Add Variant
              </button>
            </div>
          </div>

          {/* Quick Add Form */}
          {showQuickAdd && (
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Create New Variant
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {isClothing && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Size (e.g. M, L, XL)
                    </label>
                    <input
                      type="text"
                      value={newVarSize}
                      onChange={(e) => setNewVarSize(e.target.value)}
                      placeholder="M"
                      className="w-full p-2 border border-gray-300 rounded bg-white text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                )}
                {isGadget && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Storage / Spec (e.g. 128GB, 256GB)
                    </label>
                    <input
                      type="text"
                      value={newVarStorage}
                      onChange={(e) => setNewVarStorage(e.target.value)}
                      placeholder="128GB"
                      className="w-full p-2 border border-gray-300 rounded bg-white text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Color (e.g. Black, Silver)
                  </label>
                  <input
                    type="text"
                    value={newVarColor}
                    onChange={(e) => setNewVarColor(e.target.value)}
                    placeholder="Black"
                    className="w-full p-2 border border-gray-300 rounded bg-white text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickAdd(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleQuickAdd}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs"
                >
                  Add to Matrix
                </button>
              </div>
            </div>
          )}

          {/* Variant Rows Table */}
          <div className="space-y-3">
            {formData.variants?.map((v: any, idx: number) => {
              const attrDesc = v.attributes
                ? Object.entries(v.attributes)
                    .map(([k, val]) => `${k}: ${val}`)
                    .join(" • ")
                : `Variant #${idx + 1}`;

              return (
                <div
                  key={idx}
                  className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 space-y-3 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-gray-800">
                        {attrDesc || `Variant #${idx + 1}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveVariant(idx)}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      title="Remove Variant"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {/* SKU */}
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        SKU
                      </label>
                      <input
                        type="text"
                        placeholder="SKU"
                        className="w-full p-2 border border-gray-300 bg-white text-xs font-mono rounded-lg outline-none focus:border-blue-500"
                        value={v.sku || ""}
                        onChange={(e) => onVariantChange(idx, "sku", e.target.value)}
                      />
                    </div>

                    {/* Cost Price */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Cost (৳)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        className="w-full p-2 border border-gray-300 bg-white text-xs rounded-lg outline-none focus:border-blue-500"
                        value={v.costPrice ?? ""}
                        onChange={(e) => onVariantChange(idx, "costPrice", e.target.value)}
                      />
                    </div>

                    {/* Regular Price */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Reg. Price (৳) *
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        required
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        className="w-full p-2 border border-gray-300 bg-white text-xs rounded-lg outline-none focus:border-blue-500 font-bold text-gray-900"
                        value={v.regularPrice ?? v.price ?? ""}
                        onChange={(e) => onVariantChange(idx, "regularPrice", e.target.value)}
                      />
                    </div>

                    {/* Sale Price */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Sale Price (৳)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        className="w-full p-2 border border-gray-300 bg-white text-xs rounded-lg outline-none focus:border-blue-500 text-red-600 font-bold"
                        value={v.salePrice ?? ""}
                        onChange={(e) => onVariantChange(idx, "salePrice", e.target.value)}
                      />
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        Stock *
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        required
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        className="w-full p-2 border border-gray-300 bg-white text-xs rounded-lg outline-none focus:border-blue-500 font-bold text-blue-600"
                        value={v.stock ?? ""}
                        onChange={(e) => onVariantChange(idx, "stock", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPricingPanel;
