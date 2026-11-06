"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiSearch,
    FiFilter,
    FiChevronRight,
    FiGrid,
    FiEye,
    FiMoreVertical
} from 'react-icons/fi';
import {
    useGetCategoriesQuery,
    useDeleteCategoryMutation,
    useToggleFeaturedCategoryMutation,
    useToggleTrendingCategoryMutation,
    useToggleHomeCategoryMutation,
} from '@/redux/api/categoryApi';
import { toast } from 'react-hot-toast';

const CategoriesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [statusFilter, setStatusFilter] = useState('');
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [togglingTrendingId, setTogglingTrendingId] = useState<string | null>(null);

    const { data: categoriesData, isLoading, refetch } = useGetCategoriesQuery({
        page,
        limit,
        searchTerm: searchTerm.trim() || undefined,
        status: statusFilter || undefined,
    });
    const [deleteCategory] = useDeleteCategoryMutation();
    const [toggleFeatured] = useToggleFeaturedCategoryMutation();
    const [toggleTrending] = useToggleTrendingCategoryMutation();

    const categories = categoriesData?.data || [];
    const meta = categoriesData?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

    const handleToggleFeatured = async (id: string, currentStatus: boolean, name: string) => {
        setTogglingId(id);
        try {
            await toggleFeatured(id).unwrap();
            toast.success(`${name} is now ${!currentStatus ? 'Featured on Home' : 'removed from Featured'}`);
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update featured status');
        } finally {
            setTogglingId(null);
        }
    };

    const handleToggleTrending = async (id: string, currentStatus: boolean, name: string) => {
        setTogglingTrendingId(id);
        try {
            await toggleTrending(id).unwrap();
            toast.success(`${name} is now ${!currentStatus ? 'shown in Trending Products' : 'removed from Trending Products'}`);
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update trending status');
        } finally {
            setTogglingTrendingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id).unwrap();
                toast.success('Category deleted successfully');
            } catch (error: any) {
                toast.error(error?.data?.message || 'Failed to delete category');
            }
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const filteredCategories = categories.filter((cat: any) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Product Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your store's product organization and hierarchy</p>
                </div>
                <Link
                    href="/dashboard/admin/categories/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-md font-semibold hover:bg-[#1D4ED8] transition-all shadow-md"
                >
                    <FiPlus size={20} />
                    Create Category
                </Link>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] focus:bg-white transition-all text-sm"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-[#2563EB] text-gray-700 font-medium"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <button onClick={() => refetch()} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-all text-gray-600 shadow-sm">
                        Refresh
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-20 text-center text-gray-500">
                        <div className="animate-spin w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p>Loading categories...</p>
                    </div>
                ) : filteredCategories.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Level</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Products</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Featured on Home</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trending on Home</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredCategories.map((cat: any) => (
                                    <tr key={cat._id} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200">
                                                    {cat.image ? (
                                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FiGrid size={22} className="text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{cat.name}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{cat.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${cat.level === 0 ? 'bg-blue-100 text-blue-600' :
                                                cat.level === 1 ? 'bg-indigo-100 text-indigo-600' :
                                                    'bg-purple-100 text-purple-600'
                                                }`}>
                                                {cat.level === 0 ? 'Root' : cat.level === 1 ? 'Sub-Cat' : 'Grand-Cat'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cat.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${cat.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                                {cat.status === 'active' ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                                            {cat.productCount || 0}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                type="button"
                                                disabled={togglingId === cat._id}
                                                onClick={() => handleToggleFeatured(cat._id, !!cat.isFeatured, cat.name)}
                                                className="inline-flex items-center gap-2 group cursor-pointer select-none"
                                                title={cat.isFeatured ? "Click to remove from homepage featured" : "Click to show on homepage featured"}
                                            >
                                                <span
                                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                        cat.isFeatured ? 'bg-[#FF5A5A]' : 'bg-gray-200'
                                                    } ${togglingId === cat._id ? 'opacity-50 cursor-wait' : ''}`}
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                                            cat.isFeatured ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                    />
                                                </span>
                                                <span className={`text-xs font-bold ${cat.isFeatured ? 'text-[#FF5A5A]' : 'text-gray-400'}`}>
                                                    {cat.isFeatured ? 'Featured' : 'Normal'}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                type="button"
                                                disabled={togglingTrendingId === cat._id}
                                                onClick={() => handleToggleTrending(cat._id, !!cat.isTrending, cat.name)}
                                                className="inline-flex items-center gap-2 group cursor-pointer select-none"
                                                title={cat.isTrending ? "Click to remove from homepage trending section" : "Click to show on homepage trending section"}
                                            >
                                                <span
                                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                        cat.isTrending ? 'bg-[#2563EB]' : 'bg-gray-200'
                                                    } ${togglingTrendingId === cat._id ? 'opacity-50 cursor-wait' : ''}`}
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                                            cat.isTrending ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                    />
                                                </span>
                                                <span className={`text-xs font-bold ${cat.isTrending ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                                                    {cat.isTrending ? 'Trending' : 'Normal'}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/dashboard/admin/categories/new?id=${cat._id}`}
                                                    className="p-2 hover:bg-white hover:shadow-md rounded-md text-[#2563EB] transition-all border border-transparent hover:border-gray-100"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(cat._id)}
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
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/40">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <span>
                                Showing{' '}
                                <span className="font-semibold text-gray-700">
                                    {meta.total > 0 ? (page - 1) * limit + 1 : 0}–{Math.min(page * limit, meta.total)}
                                </span>
                                {' '}of{' '}
                                <span className="font-semibold text-gray-700">{meta.total}</span> categories
                            </span>
                            <div className="flex items-center gap-1.5 ml-2">
                                <span className="text-xs text-gray-400">Per page:</span>
                                <select
                                    value={limit}
                                    onChange={(e) => {
                                        setLimit(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="text-xs font-semibold bg-white border border-gray-200 rounded px-2 py-1 outline-none focus:border-[#2563EB]"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>

                        {meta.totalPage > 1 && (
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="px-3.5 py-1.5 text-xs font-semibold border border-gray-200 rounded-md hover:bg-white disabled:opacity-40 transition-all text-gray-600 bg-white shadow-sm"
                                >
                                    Previous
                                </button>

                                {Array.from({ length: meta.totalPage }, (_, i) => i + 1)
                                    .filter((p) => p === 1 || p === meta.totalPage || Math.abs(p - page) <= 1)
                                    .reduce((acc: (number | string)[], p, idx, arr) => {
                                        if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                                            acc.push('...');
                                        }
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p, idx) =>
                                        typeof p === 'number' ? (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-8 h-8 text-xs font-bold rounded-md transition-all ${
                                                    page === p
                                                        ? 'bg-[#2563EB] text-white shadow-sm'
                                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ) : (
                                            <span key={`dots-${idx}`} className="px-1 text-gray-400 text-xs">
                                                ...
                                            </span>
                                        )
                                    )}

                                <button
                                    onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
                                    disabled={page >= meta.totalPage}
                                    className="px-3.5 py-1.5 text-xs font-semibold border border-gray-200 rounded-md hover:bg-white disabled:opacity-40 transition-all text-gray-600 bg-white shadow-sm"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </>
                ) : (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <FiGrid size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">No categories found</h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Try adjusting your search or create a new category to get started.</p>
                        <Link
                            href="/dashboard/admin/categories/new"
                            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-[#2563EB] text-white rounded-xl font-bold hover:bg-[#1D4ED8] transition-all"
                        >
                            <FiPlus size={20} />
                            Create Your First Category
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriesPage;
