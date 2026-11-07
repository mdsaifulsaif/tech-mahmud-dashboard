// "use client";

// import React, { useState } from 'react';
// import { FiSave, FiGlobe, FiTruck, FiCreditCard, FiMail, FiShield, FiCheck } from 'react-icons/fi';

// import { Tab } from './components/Tab';
// import { GeneralSettings } from './components/GeneralSettings';
// import { ShippingSettings } from './components/ShippingSettings';
// import { PaymentSettings } from './components/PaymentSettings';
// import { NotificationSettings } from './components/NotificationSettings';
// import { SecuritySettings } from './components/SecuritySettings';

// export default function SettingsPage() {
//   const [activeTab, setActiveTab] = useState('general');
//   const [saving, setSaving] = useState(false);
//   const [saved, setSaved] = useState(false);

//   const [shippingConfigs, setShippingConfigs] = useState({
//     local: { type: "local", tiers: [{ min: 0, max: 999, charge: 0 }, { min: 1000, max: 999999, charge: 50 }], isActive: true },
//     nationwide: { type: "nationwide", tiers: [{ min: 0, max: 1499, charge: 80 }, { min: 1500, max: 999999, charge: 120 }], isActive: true },
//   });

//   const handleSave = async () => {
//     setSaving(true);
//     console.log("Saving Settings...", { shippingConfigs });
//     await new Promise(resolve => setTimeout(resolve, 1200));
//     setSaving(false);
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2500);
//   };

//   const tabs = [
//     { id: 'general', label: 'General', icon: FiGlobe },
//     { id: 'shipping', label: 'Shipping', icon: FiTruck },
//     { id: 'payment', label: 'Payment', icon: FiCreditCard },
//     { id: 'notifications', label: 'Notifications', icon: FiMail },
//     { id: 'security', label: 'Security', icon: FiShield },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
//           <p className="text-gray-500 mt-1">Manage your store configuration</p>
//         </div>

//         <button
//           onClick={handleSave}
//           disabled={saving}
//           className="px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-xl font-semibold flex items-center gap-2 disabled:opacity-70 hover:shadow-lg transition-all"
//         >
//           {saving ? "Saving..." : saved ? "✓ Saved!" : "Save All Changes"}
//         </button>
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="flex overflow-x-auto border-b border-gray-100">
//           {tabs.map(tab => (
//             <Tab
//               key={tab.id}
//               active={activeTab === tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               icon={tab.icon}
//             >
//               {tab.label}
//             </Tab>
//           ))}
//         </div>

//         <div className="p-8">
//           {activeTab === 'general' && <GeneralSettings />}
//           {activeTab === 'shipping' && <ShippingSettings shippingConfigs={shippingConfigs} setShippingConfigs={setShippingConfigs} />}
//           {activeTab === 'payment' && <PaymentSettings />}
//           {activeTab === 'notifications' && <NotificationSettings />}
//           {activeTab === 'security' && <SecuritySettings />}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from 'react';
import { FiGlobe, FiTruck, FiCreditCard, FiMail, FiShield } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { Tab } from './components/Tab';
import { ShippingSettings } from './components/ShippingSettings';
import { useGetAllShippingConfigsQuery, useUpdateShippingConfigMutation } from '@/redux/api/shippingPriceApi';
import { PaymentSettings } from './components/PaymentSettings';
import { SecuritySettings } from './components/SecuritySettings';
import { GeneralSettings } from './components/GeneralSettings';


export default function SettingsPage() {
  const { data: apiResponse, isLoading, refetch } = useGetAllShippingConfigsQuery({});
  const [updateShippingConfig, { isLoading: isUpdating }] = useUpdateShippingConfigMutation();
  
  const [activeTab, setActiveTab] = useState('general');
  
  const [shippingConfigs, setShippingConfigs] = useState({
    local: { type: "local", tiers: [], isActive: true },
    nationwide: { type: "nationwide", tiers: [], isActive: true },
  });

  // API থেকে আসা ডাটা স্টেটে লোড করা
  useEffect(() => {
    if (apiResponse?.data) {
      const formatted: any = { ...shippingConfigs };
      apiResponse.data.forEach((item: any) => {
        if (item.type === "local" || item.type === "nationwide") {
          formatted[item.type] = item;
        }
      });
      setShippingConfigs(formatted);
    }
  }, [apiResponse]);

  const handleSave = async () => {
    try {
      // ডাটা ক্লিন করে সার্ভারে পাঠানো
      const cleanData = (config: any) => ({
        type: config.type,
        tiers: config.tiers.map((t: any) => ({
          min: Number(t.min),
          max: Number(t.max),
          charge: Number(t.charge)
        }))
      });

      await updateShippingConfig(cleanData(shippingConfigs.local)).unwrap();
      await updateShippingConfig(cleanData(shippingConfigs.nationwide)).unwrap();
      
      toast.success("Shipping settings saved successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to save changes.");
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: FiGlobe },
    { id: 'shipping', label: 'Shipping', icon: FiTruck },
    { id: 'payment', label: 'Payment', icon: FiCreditCard },
    { id: 'security', label: 'Security', icon: FiShield },
  ];

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isUpdating || isLoading}
          className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          {isUpdating ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {tabs.map(tab => (
            <Tab key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} icon={tab.icon}>
              {tab.label}
            </Tab>
          ))}
        </div>
        <div className="p-8">
           {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'shipping' && (
            <ShippingSettings />
          )}
          {activeTab === 'payment' && <PaymentSettings />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}