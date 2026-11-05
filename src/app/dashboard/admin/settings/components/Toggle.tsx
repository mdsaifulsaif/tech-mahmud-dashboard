import React from 'react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, description }) => (
  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
    <div>
      <p className="font-medium text-gray-700">{label}</p>
      {description && <p className="text-sm text-gray-400">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full transition-colors ${checked ? 'bg-[#2563EB]' : 'bg-gray-300'}`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${checked ? 'translate-x-6' : 'translate-x-0'}`}
      />
    </button>
  </div>
);