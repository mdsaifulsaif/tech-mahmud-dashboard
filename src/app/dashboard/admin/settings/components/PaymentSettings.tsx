"use client";

import React, { useState } from "react";
import { FiCheckCircle, FiTruck } from "react-icons/fi";
import { Toggle } from "./Toggle";
import toast from "react-hot-toast";

export const PaymentSettings = () => {
  const [codEnabled, setCodEnabled] = useState(true);

  const handleToggle = (checked: boolean) => {
    setCodEnabled(checked);
    toast.success(
      checked
        ? "Cash on Delivery (COD) enabled for nationwide delivery"
        : "Cash on Delivery disabled"
    );
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Payment Methods</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure available customer checkout payment methods.
        </p>
      </div>

      <div className="space-y-4">
        {/* Only Cash on Delivery (COD) */}
        <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <FiTruck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-gray-800">
                  Cash on Delivery (COD)
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  Active
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-lg leading-relaxed">
                Allow customers to pay with cash upon doorstep delivery nationwide.
                Orders are processed and verified before dispatch.
              </p>
            </div>
          </div>

          <Toggle
            label=""
            checked={codEnabled}
            onChange={handleToggle}
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3 text-xs text-blue-800">
        <FiCheckCircle className="shrink-0 text-blue-600 mt-0.5" size={16} />
        <p>
          Storefront checkout is currently set to <strong>Cash on Delivery (COD)</strong> for smooth order processing across all 64 districts of Bangladesh.
        </p>
      </div>
    </div>
  );
};
