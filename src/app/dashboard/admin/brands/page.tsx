"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiSearch,
    FiFilter,
    FiImage,
    FiMoreVertical
} from 'react-icons/fi';
import {
    useGetBrandsQuery,
    useDeleteBrandMutation
} from '@/redux/api/brandApi';
import { toast } from 'react-hot-toast';

const BrandsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const { data: brandsData, isLoading, refetch } = useGetBrandsQuery({
        searchTerm,
        page,
        limit: 10
    });
    const [deleteBrand] = useDeleteBrandMutation();

    const brands = brandsData?.data || [];
    const meta = brandsData?.meta || {};

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this brand?')) {
            try {
                await deleteBrand(id).unwrap();
                toast.success('Brand deleted successfully');
            } catch (error: any) {
                toast.error(error?.data?.message || 'Failed to delete brand');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Product Brands</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your store's product brands</p>
                </div>
                <Link
                    href="/dashboard/admin/brands/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-md font-semibold hover:bg-[#1D4ED8] transition-all shadow-md"
                >
                    <FiPlus size={20} />
                    Create Brand
                </Link>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search brands..."
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] focus:bg-white transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-all text-gray-600 shadow-sm">
                        <FiFilter size={18} />
                        Filter
                    </button>
                    <button
                        onClick={() => refetch()}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-all text-gray-600 shadow-sm"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-20 text-center text-gray-500">
                        <div className="animate-spin w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p>Loading brands...</p>
                    </div>
                ) : brands.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Brand</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Products</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Featured</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Visibility</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {brands.map((brand: any) => (
                                        <tr key={brand._id} className="hover:bg-gray-50/50 transition-all group">
                                            {/* Brand Name + Logo */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200">
                                                        {brand.logo ? (
                                                            <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <FiImage size={22} className="text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{brand.name}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5 font-mono">{brand.slug}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                    brand.status === 'active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${brand.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                                    {brand.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>

                                            {/* Product Count */}
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                                                {brand.productCount || 0}
                                            </td>

                                            {/* Featured */}
                                            <td className="px-6 py-4">
                                                {brand.isFeatured ? (
                                                    <span className="text-yellow-600 font-bold text-[10px] uppercase bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">Featured</span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">-</span>
                                                )}
                                            </td>

                                            {/* Visibility */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {brand.showInMenu && (
                                                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">Menu</span>
                                                    )}
                                                    {brand.showInHome && (
                                                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">Home</span>
                                                    )}
                                                    {!brand.showInMenu && !brand.showInHome && (
                                                        <span className="text-gray-400 text-xs">-</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Order */}
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                                                {brand.order}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/dashboard/admin/brands/new?id=${brand._id}`}
                                                        className="p-2 hover:bg-white hover:shadow-md rounded-md text-[#2563EB] transition-all border border-transparent hover:border-gray-100"
                                                        title="Edit"
                                                    >
                                                        <FiEdit2 size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(brand._id)}
                                                        className="p-2 hover:bg-white hover:shadow-md rounded-md text-red-500 transition-all border border-transparent hover:border-gray-100"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                    <button className="p-2 hover:bg-white hover:shadow-md rounded-lg text-gray-500 transition-all">
                                                        <FiMoreVertical size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {meta.totalPage > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500">
                                    Showing <span className="font-semibold text-gray-700">{(page - 1) * 10 + 1}–{Math.min(page * 10, meta.total)}</span> of <span className="font-semibold text-gray-700">{meta.total}</span> brands
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-4 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 transition-all"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={page >= meta.totalPage}
                                        className="px-4 py-2 text-sm bg-[#2563EB] text-white rounded-md hover:bg-[#1D4ED8] disabled:opacity-40 transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <FiImage size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">No brands found</h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Try adjusting your search or create a new brand to get started.</p>
                        <Link
                            href="/dashboard/admin/brands/new"
                            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-[#2563EB] text-white rounded-xl font-bold hover:bg-[#1D4ED8] transition-all"
                        >
                            <FiPlus size={20} />
                            Create Your First Brand
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandsPage;