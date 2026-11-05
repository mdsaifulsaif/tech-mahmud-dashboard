"use client";

import React from "react";
import { FiShield, FiCpu, FiInfo } from "react-icons/fi";

interface Props {
  gadgetAttributes: {
    brand?: string;
    modelNumber?: string;
    releaseYear?: number;
  };
  warranty: {
    duration?: string;
    type?: "official" | "seller" | "no-warranty";
    details?: string;
  };
  onGadgetAttributesChange: (updated: any) => void;
  onWarrantyChange: (updated: any) => void;
}

const GadgetAttributesPanel: React.FC<Props> = ({
  gadgetAttributes = {},
  warranty = { duration: "1 Year", type: "official", details: "" },
  onGadgetAttributesChange,
  onWarrantyChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-lg">
          📱
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Gadget & Electronics Info</h2>
          <p className="text-xs text-gray-500">
            Model identification and warranty policy configuration
          </p>
        </div>
      </div>

      {/* Model & Release Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Model Number / Code</label>
          <input
            type="text"
            placeholder="e.g. A2848, SM-S928B"
            value={gadgetAttributes.modelNumber || ""}
            onChange={(e) =>
              onGadgetAttributesChange({
                ...gadgetAttributes,
                modelNumber: e.target.value,
              })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 font-mono bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Release Year</label>
          <input
            type="number"
            placeholder="e.g. 2024"
            value={gadgetAttributes.releaseYear || ""}
            onChange={(e) =>
              onGadgetAttributesChange({
                ...gadgetAttributes,
                releaseYear: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Warranty Section */}
      <div className="pt-4 border-t border-gray-100 space-y-4">
        <div className="flex items-center gap-2">
          <FiShield className="text-emerald-600" size={18} />
          <h3 className="text-sm font-bold text-gray-800">Warranty Coverage</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Warranty Type</label>
            <select
              value={warranty.type || "official"}
              onChange={(e) =>
                onWarrantyChange({
                  ...warranty,
                  type: e.target.value as "official" | "seller" | "no-warranty",
                })
              }
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-white"
            >
              <option value="official">Official Brand Warranty (অফিসিয়াল ওয়ারেন্টি)</option>
              <option value="seller">Seller / Service Warranty (শপ ওয়ারেন্টি)</option>
              <option value="no-warranty">No Warranty (ওয়ারেন্টি প্রযোজ্য নয়)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Duration Period</label>
            <input
              type="text"
              placeholder="e.g. 1 Year, 6 Months, Lifetime"
              value={warranty.duration || ""}
              onChange={(e) =>
                onWarrantyChange({
                  ...warranty,
                  duration: e.target.value,
                })
              }
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Warranty Terms / Details</label>
          <textarea
            rows={2}
            placeholder="e.g. 7 days replacement guarantee, 1-year free parts and service coverage."
            value={warranty.details || ""}
            onChange={(e) =>
              onWarrantyChange({
                ...warranty,
                details: e.target.value,
              })
            }
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default GadgetAttributesPanel;

