"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSave } from "react-icons/fi";

interface Props {
  isEditing: boolean;
  status: string;
  isCreating: boolean;
  isUpdating: boolean;
  onSubmit: () => void;
}

const ProductFormHeader = ({ isEditing, status, isCreating, isUpdating, onSubmit }: Props) => {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/products"
          className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 text-gray-400 transition-all hover:text-gray-600"
        >
          <FiArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? "Edit Product" : "Create Product"}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${status === "active" ? "bg-green-500" : "bg-gray-400"}`}></span>
            <p className="text-sm text-gray-500 capitalize">{status} Mode</p>
          </div>
        </div>
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => router.push("/dashboard/admin/products")}
          className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-200 rounded-md font-semibold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isCreating || isUpdating}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-[#2563EB] text-white rounded-md font-semibold hover:bg-[#1D4ED8] transition-all shadow-md disabled:opacity-50"
        >
          <FiSave size={20} />
          {isCreating || isUpdating ? "Processing..." : isEditing ? "Update Product" : "Release Product"}
        </button>
      </div>
    </div>
  );
};

export default ProductFormHeader;