"use client";

import { FiList, FiTrash2, FiPlus } from "react-icons/fi";

const QUICK_SPEC_KEYS = [
  "Processor",
  "RAM",
  "Internal Storage",
  "Display",
  "Battery",
  "Front Camera",
  "Back Camera",
  "Connectivity",
  "Charging",
  "Weight",
];

interface Props {
  specifications: any[];
  onAdd: (defaultKey?: string) => void;
  onChange: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}

const ProductSpecifications = ({ specifications, onAdd, onChange, onRemove }: Props) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FiList className="text-blue-600" /> Technical Specifications
          </h2>
          <p className="text-xs text-gray-500">
            Add key-value technical parameters for customer comparison
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAdd()}
          className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-xs self-start sm:self-auto"
        >
          + Add Spec Row
        </button>
      </div>

      {/* Quick Spec Presets */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2">
        <span className="text-[11px] text-gray-400 font-medium">Quick Presets:</span>
        {QUICK_SPEC_KEYS.map((key) => {
          const alreadyExists = specifications.some(
            (s: any) => s.key?.toLowerCase() === key.toLowerCase()
          );
          if (alreadyExists) return null;
          return (
            <button
              type="button"
              key={key}
              onClick={() => onAdd(key)}
              className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-colors"
            >
              + {key}
            </button>
          );
        })}
      </div>

      <div className="space-y-2.5 pt-2">
        {specifications.map((spec: any, idx: number) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50/70 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <input
              type="text"
              placeholder="Key (e.g. Processor)"
              className="p-2 border border-gray-200 rounded-md text-xs bg-white outline-none focus:border-blue-500 font-medium"
              value={spec.key || ""}
              onChange={(e) => onChange(idx, "key", e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Value (e.g. Apple A17 Pro)"
                className="flex-1 p-2 border border-gray-200 rounded-md text-xs bg-white outline-none focus:border-blue-500"
                value={spec.value || ""}
                onChange={(e) => onChange(idx, "value", e.target.value)}
              />
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                title="Delete Row"
              >
                <FiTrash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {specifications.length === 0 && (
          <p className="text-xs text-gray-400 italic text-center py-4">
            No specifications added yet. Click &quot;Add Spec Row&quot; or choose a quick preset above.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductSpecifications;
