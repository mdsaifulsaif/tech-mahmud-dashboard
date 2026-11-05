"use client";

import React from "react";
import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi";
import { useDeleteCustomerMutation, CustomerItem } from "@/redux/api/customerApi";
import toast from "react-hot-toast";

interface DeleteCustomerModalProps {
  customer: CustomerItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DeleteCustomerModal({
  customer,
  onClose,
  onSuccess,
}: DeleteCustomerModalProps) {
  const [deleteCustomer, { isLoading }] = useDeleteCustomerMutation();

  if (!customer) return null;

  const handleDelete = async () => {
    try {
      await deleteCustomer(customer._id).unwrap();
      toast.success("Customer deleted successfully");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete customer");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <FiAlertTriangle size={24} />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-900">Delete Customer?</h3>
          <p className="text-sm text-gray-500 mt-1">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-800">
              {customer.firstName} {customer.lastName}
            </span>{" "}
            ({customer.email})? This action cannot be undone.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            <FiTrash2 size={16} />
            {isLoading ? "Deleting..." : "Delete Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}
