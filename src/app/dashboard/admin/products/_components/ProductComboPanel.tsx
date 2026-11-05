"use client";

import { FiBox, FiPlus, FiTrash2 } from "react-icons/fi";
import { useEffect } from "react";

interface Props {
  formData: any;
  availableProducts: any[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onComboItemChange: (index: number, field: string, value: any) => void;
  onAddComboItem: () => void;
  onRemoveComboItem: (index: number) => void;
  onCostPriceChange: (cost: number) => void; // ✅ auto calculate callback
}

const ProductComboPanel = ({
  formData, availableProducts, onChange,
  onComboItemChange, onAddComboItem, onRemoveComboItem, onCostPriceChange
}: Props) => {

  // ✅ Auto calculate cost price
  useEffect(() => {
    const totalCost = formData.comboItems.reduce((sum: number, item: any) => {
      if (!item.productID) return sum;
      const product = availableProducts.find((p: any) => p._id === item.productID);
      if (!product) return sum;

      let itemCost = 0;
      if (item.selectedVariant && product.variants?.length > 0) {
        const variant = product.variants.find((v: any) => v._id === item.selectedVariant);
        itemCost = variant?.costPrice || 0;
      } else {
        itemCost = product.costPrice || 0;
      }

      return sum + (itemCost * Number(item.quantity || 1));
    }, 0);

    onCostPriceChange(totalCost);
  }, [formData.comboItems, availableProducts]);

  return (
    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-purple-50 flex items-center justify-center text-purple-600">
            <FiBox size={22} />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Combo Package Items</h2>
        </div>
        <button
          type="button" onClick={onAddComboItem}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-md text-sm font-bold hover:bg-purple-600 hover:text-white border border-purple-100 transition-all"
        >
          <FiPlus /> Bind Product
        </button>
      </div>

      {/* Combo Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
        {/* ✅ Cost Price auto calculated — readonly */}
        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">
            Cost Price
            <span className="ml-1 text-green-600 font-normal">(Auto calculated)</span>
          </label>
          <input
            type="number"
            readOnly
            className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm font-bold h-10 outline-none text-green-700 cursor-not-allowed"
            value={formData.costPrice || 0}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Regular Price *</label>
          <input
            type="number" name="regularPrice" placeholder="0"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold h-10 outline-none focus:border-purple-500"
            value={formData.regularPrice} onChange={onChange}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 block mb-1.5">Stock *</label>
          <input
            type="number" name="stock" placeholder="0"
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm font-bold h-10 outline-none focus:border-purple-500"
            value={formData.stock} onChange={onChange}
          />
        </div>
      </div>

      {/* Combo Items */}
      <div className="space-y-3">
        {formData.comboItems.map((item: any, idx: number) => {
          const targetProduct = availableProducts.find((p: any) => p._id === item.productID);
          const availableVariants = targetProduct?.variants || [];
          const hasVariantsInProduct = availableVariants.length > 0;

          // ✅ Item cost preview
          let itemCost = 0;
          if (item.productID && targetProduct) {
            if (item.selectedVariant && hasVariantsInProduct) {
              const v = availableVariants.find((v: any) => v._id === item.selectedVariant);
              itemCost = (v?.costPrice || 0) * Number(item.quantity || 1);
            } else {
              itemCost = (targetProduct.costPrice || 0) * Number(item.quantity || 1);
            }
          }

          return (
            <div key={idx} className="p-4 bg-white border border-gray-200 rounded-md shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                {/* Product Select */}
                <div className="w-full md:flex-[2] min-w-0">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Select Product</label>
                  <select
                    className="w-full p-2 border border-gray-200 rounded text-sm bg-white h-10 outline-none focus:border-purple-500 font-medium"
                    value={item.productID || ""}
                    onChange={(e) => onComboItemChange(idx, "productID", e.target.value)}
                  >
                    <option value="">-- Choose Product --</option>
                    {availableProducts.map((p: any) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.variants?.length > 0 ? `${p.variants.length} Variants` : `Stock: ${p.stock ?? 0}`})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Variant Select */}
                <div className="w-full md:flex-[1] min-w-0">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Variant</label>
                  <select
                    disabled={!item.productID || !hasVariantsInProduct}
                    className={`w-full p-2 border rounded text-sm h-10 outline-none font-medium ${
                      item.productID && hasVariantsInProduct
                        ? "border-purple-300 bg-purple-50/40 text-purple-900 focus:border-purple-500"
                        : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                    }`}
                    value={item.selectedVariant || ""}
                    onChange={(e) => onComboItemChange(idx, "selectedVariant", e.target.value)}
                  >
                    {!item.productID ? (
                      <option value="">Select product first</option>
                    ) : !hasVariantsInProduct ? (
                      <option value="">No variants</option>
                    ) : (
                      <>
                        <option value="">-- Select Variant --</option>
                        {availableVariants.map((v: any) => (
                          <option key={v._id} value={v._id}>
                            {v.weightOrVolume} (Stock: {v.stock || 0})
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                {/* Quantity */}
                <div className="w-full md:w-24 shrink-0">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Quantity</label>
                  <input
                    type="number" placeholder="1"
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-full p-2 border border-gray-200 rounded text-sm text-center font-bold h-10 outline-none focus:border-purple-500"
                    value={item.quantity}
                    onChange={(e) => onComboItemChange(idx, "quantity", e.target.value)}
                  />
                </div>

                {/* Remove */}
                <button
                  type="button" onClick={() => onRemoveComboItem(idx)}
                  className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-md transition-all shrink-0"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              {/* ✅ Item cost preview */}
              {item.productID && (
                <div className="text-xs text-gray-400 text-right">
                  Item Cost: <span className="font-bold text-gray-600">৳{itemCost}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductComboPanel;