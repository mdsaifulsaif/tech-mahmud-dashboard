// components/settings/PaymentSettings.tsx
import React from 'react';
import { Toggle } from './Toggle';

export const PaymentSettings = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Payment Methods</h3>

      <div className="space-y-4">
        <Toggle label="Cash on Delivery (COD)" description="Allow customers to pay on delivery" checked={true} onChange={() => {}} />
        <Toggle label="SSLCommerz" description="Accept cards, mobile banking & more" checked={true} onChange={() => {}} />
        <Toggle label="bKash" description="Accept bKash mobile payments" checked={true} onChange={() => {}} />
        <Toggle label="Nagad" description="Accept Nagad mobile payments" checked={false} onChange={() => {}} />
      </div>
    </div>
  );
};