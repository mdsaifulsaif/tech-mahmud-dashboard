// components/settings/NotificationSettings.tsx
import React from 'react';
import { Toggle } from './Toggle';

export const NotificationSettings = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Email Notifications</h3>

      <div className="space-y-4">
        <Toggle label="Order Notifications" description="Receive email when new orders are placed" checked={true} onChange={() => {}} />
        <Toggle label="Low Stock Alerts" description="Get notified when products are running low" checked={true} onChange={() => {}} />
        <Toggle label="Review Notifications" description="Receive alerts for new product reviews" checked={true} onChange={() => {}} />
        <Toggle label="Marketing Emails" description="Receive promotional and marketing updates" checked={false} onChange={() => {}} />
      </div>
    </div>
  );
};