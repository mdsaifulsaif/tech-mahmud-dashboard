import React from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { FormField } from "./FormField";

export const ShippingSettings = ({
  shippingConfigs,
  setShippingConfigs,
}: any) => {
  const addTier = (type: "local" | "nationwide") => {
    setShippingConfigs((prev: any) => ({
      ...prev,
      [type]: {
        ...prev[type],
        tiers: [...prev[type].tiers, { min: 0, max: 0, charge: 0 }],
      },
    }));
  };

  const updateTier = (
    type: "local" | "nationwide",
    index: number,
    field: string,
    value: string,
  ) => {
    setShippingConfigs((prev: any) => {
      const newTiers = [...prev[type].tiers];
      // সরাসরি স্ট্রিং ভ্যালু সেট করছি যেন ইনপুট একদম ক্লিয়ার করা যায়
      newTiers[index] = { ...newTiers[index], [field]: value };
      return { ...prev, [type]: { ...prev[type], tiers: newTiers } };
    });
  };

  const deleteTier = (type: "local" | "nationwide", index: number) => {
    setShippingConfigs((prev: any) => ({
      ...prev,
      [type]: {
        ...prev[type],
        tiers: prev[type].tiers.filter((_: any, i: number) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-8">
      {(["local", "nationwide"] as const).map((type) => (
        <div
          key={type}
          className="border border-gray-100 rounded-2xl p-6 bg-white"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 capitalize">
              {type} Shipping
            </h3>
            <button
              onClick={() => addTier(type)}
              className="text-[#2563EB] flex items-center gap-1 text-sm font-semibold"
            >
              <FiPlus /> Add Tier
            </button>
          </div>
          <div className="space-y-4">
            {shippingConfigs[type].tiers.map((tier: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-5 rounded-xl items-end"
              >
                {/* এখানে name প্রপটি যোগ করা হয়েছে */}
                <FormField
                  label="Min Amount"
                  name={`min-${type}-${index}`}
                  type="number"
                  value={tier.min}
                  onChange={(e) =>
                    updateTier(type, index, "min", e.target.value)
                  }
                />

                <FormField
                  label="Max Amount"
                  name={`max-${type}-${index}`}
                  type="number"
                  value={tier.max}
                  onChange={(e) =>
                    updateTier(type, index, "max", e.target.value)
                  }
                />

                <div className="flex gap-3">
                  <FormField
                    label="Charge (৳)"
                    name={`charge-${type}-${index}`}
                    type="number"
                    value={tier.charge}
                    onChange={(e) =>
                      updateTier(type, index, "charge", e.target.value)
                    }
                  />
                  {/* ... */}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
