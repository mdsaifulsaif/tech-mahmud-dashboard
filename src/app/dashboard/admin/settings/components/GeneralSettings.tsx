"use client"; // যেহেতু এটি স্টেট ব্যবহার করছে, তাই এটি প্রয়োজন

import React, { useState } from 'react';
import { FormField } from './FormField';

export const GeneralSettings = () => {
  // ১. স্টেট ডিফাইন করা
  const [generalData, setGeneralData] = useState({
    siteName: '',
    tagline: '',
    siteUrl: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    currencySymbol: '৳'
  });

  // ২. হ্যান্ডলার ফাংশন
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setGeneralData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="space-y-8">
      {/* Site Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Site Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Site Name" name="siteName" value={generalData.siteName} onChange={handleChange} placeholder="Your store name" />
          <FormField label="Tagline" name="tagline" value={generalData.tagline} onChange={handleChange} placeholder="A short description" />
          <FormField label="Site URL" name="siteUrl" value={generalData.siteUrl} onChange={handleChange} placeholder="https://example.com" />
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Email Address" name="email" type="email" value={generalData.email} onChange={handleChange} placeholder="support@example.com" />
          <FormField label="Phone Number" name="phone" value={generalData.phone} onChange={handleChange} placeholder="+880 1XXX XXX XXX" />
          <FormField label="WhatsApp" name="whatsapp" value={generalData.whatsapp} onChange={handleChange} placeholder="+880 1XXX XXX XXX" />
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              name="address"
              value={generalData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              placeholder="House 12, Road 5, Dhanmondi, Dhaka..."
            />
          </div>
        </div>
      </div>

      {/* Currency Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Currency Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none">
              <option value="BDT">BDT - Bangladeshi Taka</option>
              <option value="USD">USD - US Dollar</option>
            </select>
          </div>
          <FormField label="Currency Symbol" name="currencySymbol" value={generalData.currencySymbol} onChange={handleChange} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Symbol Position</label>
            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-none">
              <option value="before">Before (৳100)</option>
              <option value="after">After (100৳)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

