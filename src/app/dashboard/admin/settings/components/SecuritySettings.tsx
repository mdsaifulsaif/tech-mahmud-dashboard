// // components/settings/SecuritySettings.tsx
// import React from 'react';
// import { FiAlertCircle } from 'react-icons/fi';
// import { Toggle } from './Toggle';
// import { FormField } from './FormField';

// export const SecuritySettings = () => {
//   return (
//     <div className="space-y-6">
//       <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
//         <FiAlertCircle className="text-yellow-500 mt-0.5" size={20} />
//         <p className="text-sm text-yellow-700">
//           Security settings help protect your admin account. We recommend enabling two-factor authentication.
//         </p>
//       </div>

//       <div className="space-y-4">
//         <Toggle label="Two-Factor Authentication" description="Add an extra layer of security" checked={false} onChange={() => {}} />
//         <Toggle label="Login Notifications" description="Receive email when someone logs into your account" checked={true} onChange={() => {}} />
//       </div>

//       <div className="pt-6 border-t">
//         <h4 className="font-medium text-gray-800 mb-4">Change Password</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <FormField label="Current Password" name="currentPassword" type="password" placeholder="Enter current password" />
//           <FormField label="New Password" name="newPassword" type="password" placeholder="Enter new password" />
//           <FormField label="Confirm Password" name="confirmPassword" type="password" placeholder="Confirm new password" />
//         </div>
//       </div>
//     </div>
//   );
// };

// components/settings/SecuritySettings.tsx
import React, { useState } from 'react'; // useState ইমপোর্ট করুন
import { FiAlertCircle } from 'react-icons/fi';
import { Toggle } from './Toggle';
import { FormField } from './FormField';

export const SecuritySettings = () => {
  // পাসওয়ার্ড ডাটা স্টোর করার জন্য স্টেট
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // ইনপুট পরিবর্তনের ফাংশন
 const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setPasswords((prev) => ({ ...prev, [name]: value }));
};

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
        <FiAlertCircle className="text-yellow-500 mt-0.5" size={20} />
        <p className="text-sm text-yellow-700">
          Security settings help protect your admin account. We recommend enabling two-factor authentication.
        </p>
      </div>

      <div className="space-y-4">
        <Toggle label="Two-Factor Authentication" description="Add an extra layer of security" checked={false} onChange={() => {}} />
        <Toggle label="Login Notifications" description="Receive email when someone logs into your account" checked={true} onChange={() => {}} />
      </div>

      <div className="pt-6 border-t">
        <h4 className="font-medium text-gray-800 mb-4">Change Password</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            label="Current Password" 
            name="currentPassword" 
            type="password" 
            placeholder="Enter current password" 
            value={passwords.currentPassword}
            onChange={handleInputChange} 
          />
          <FormField 
            label="New Password" 
            name="newPassword" 
            type="password" 
            placeholder="Enter new password" 
            value={passwords.newPassword}
            onChange={handleInputChange} 
          />
          <FormField 
            label="Confirm Password" 
            name="confirmPassword" 
            type="password" 
            placeholder="Confirm new password" 
            value={passwords.confirmPassword}
            onChange={handleInputChange} 
          />
        </div>
        
        {/* সেভ করার বাটন যোগ করতে পারেন এখানে */}
        <button className="mt-6 px-6 py-2 bg-[#2563EB] text-white rounded-xl hover:bg-[#4a967a]">
          Update Password
        </button>
      </div>
    </div>
  );
};