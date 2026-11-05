


"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiSearch,
    FiShoppingBag,
    FiEye,
    FiMoreVertical,
    FiBox,
    FiBarChart2,
    FiX,
    FiFilter
} from 'react-icons/fi';
import {
    useGetProductsQuery,
    useDeleteProductMutation
} from '@/redux/api/productApi';
import { useGetCategoriesQuery } from '@/redux/api/categoryApi';
import { toast } from 'react-hot-toast';

const ProductsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        productType: '',
        category: '',
    });

    const { data: productsData, isLoading, refetch } = useGetProductsQuery({
        searchTerm,
        page,
        limit: 10,
        ...filters,
    });

    const { data: categoriesData } = useGetCategoriesQuery({});
    const [deleteProduct] = useDeleteProductMutation();

    const products = productsData?.data || [];
    const meta = productsData?.meta || {};
    const categories = categoriesData?.data || [];

    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({ status: '', productType: '', category: '' });
        setPage(1);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap();
                toast.success('Product deleted successfully');
            } catch (error: any) {
                toast.error(error?.data?.message || 'Failed to delete product');
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your inventory, pricing and product visibility</p>
                </div>
                <Link
                    href="/dashboard/admin/products/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-md font-semibold hover:bg-[#1D4ED8] transition-all shadow-md"
                >
                    <FiPlus size={20} />
                    Add New Product
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Products', value: meta.total || 0, icon: FiShoppingBag, bg: 'bg-blue-50', text: 'text-blue-600' },
                    { label: 'Active', value: products.filter((p: any) => p.status === 'active').length, icon: FiBox, bg: 'bg-green-50', text: 'text-green-600' },
                    { label: 'Low Stock', value: products.filter((p: any) => p.stock <= p.lowStockAlert).length, icon: FiBarChart2, bg: 'bg-orange-50', text: 'text-orange-500' },
                    { label: 'Featured', value: products.filter((p: any) => p.isFeatured).length, icon: FiEye, bg: 'bg-purple-50', text: 'text-purple-600' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                        <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center ${stat.text}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products by name or SKU..."
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] focus:bg-white transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border rounded-md text-sm font-medium transition-all shadow-sm relative ${
                                showFilter || activeFiltersCount > 0
                                    ? 'bg-[#2563EB] text-white border-[#2563EB]'
                                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                            }`}
                        >
                            <FiFilter size={18} />
                            Filter
                            {activeFiltersCount > 0 && (
                                <span className="w-5 h-5 rounded-full bg-white text-[#2563EB] text-xs font-bold flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => refetch()}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-all text-gray-600 shadow-sm"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilter && (
                    <div className="pt-4 border-t border-gray-100 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Status Filter */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                                <select
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>

                            {/* Product Type Filter */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Type</label>
                                <select
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm"
                                    value={filters.productType}
                                    onChange={(e) => handleFilterChange('productType', e.target.value)}
                                >
                                    <option value="">All Types</option>
                                    <option value="clothing">👕 Clothing</option>
                                    <option value="gadget">📱 Gadget</option>
                                    <option value="general">📦 General</option>
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
                                <select
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm"
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat: any) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Active Filter Tags + Clear */}
                        {activeFiltersCount > 0 && (
                            <div className="flex items-center flex-wrap gap-2 pt-2">
                                {filters.status && (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold rounded-full">
                                        Status: {filters.status}
                                        <button onClick={() => handleFilterChange('status', '')}><FiX size={12} /></button>
                                    </span>
                                )}
                                {filters.productType && (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold rounded-full">
                                        Type: {filters.productType}
                                        <button onClick={() => handleFilterChange('productType', '')}><FiX size={12} /></button>
                                    </span>
                                )}
                                {filters.category && (
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold rounded-full">
                                        Category: {categories.find((c: any) => c._id === filters.category)?.name}
                                        <button onClick={() => handleFilterChange('category', '')}><FiX size={12} /></button>
                                    </span>
                                )}
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-500 text-xs font-semibold rounded-full hover:bg-red-100 transition-all"
                                >
                                    <FiX size={12} />
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-20 text-center text-gray-500">
                        <div className="animate-spin w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p>Loading products...</p>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {products.map((product: any) => (
                                        <tr key={product._id} className="hover:bg-gray-50/50 transition-all group">

                                            {/* Product */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                                                        {product.thumbnail ? (
                                                            <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <FiShoppingBag size={22} className="text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="max-w-[200px]">
                                                        <p className="font-bold text-gray-800 truncate">{product.name}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5 font-mono">SKU: {product.sku || 'N/A'}</p>
                                                        {product.isNewCollection && (
                                                            <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-[#FF5A5A] border border-[#FF5A5A]/30">
                                                                ✨ New Collection
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 font-medium">
                                                    {product.categoryID?.name || 'Uncategorized'}
                                                </p>
                                            </td>

                                            {/* Price */}
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-800">
                                                    {formatCurrency(product.salePrice > 0 ? product.salePrice : product.regularPrice)}
                                                </p>
                                                {product.salePrice > 0 && (
                                                    <p className="text-xs text-red-400 line-through">
                                                        {formatCurrency(product.regularPrice)}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Stock */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <p className={`text-sm font-bold ${product.stock <= product.lowStockAlert ? 'text-red-500' : 'text-gray-700'}`}>
                                                        {product.stock} units
                                                    </p>
                                                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${
                                                                product.stock === 0 ? 'bg-red-500' :
                                                                product.stock <= product.lowStockAlert ? 'bg-orange-400' :
                                                                'bg-green-500'
                                                            }`}
                                                            style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Product Type */}
                                            <td className="px-6 py-4">
                                                <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-md ${
                                                    product.productType === 'clothing' ? 'bg-purple-100 text-purple-700' :
                                                    product.productType === 'gadget' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {product.productType === 'clothing' ? '👕 Clothing' :
                                                     product.productType === 'gadget' ? '📱 Gadget' :
                                                     product.productType || 'General'}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                    product.status === 'active' ? 'bg-green-100 text-green-700' :
                                                    product.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        product.status === 'active' ? 'bg-green-600' :
                                                        product.status === 'draft' ? 'bg-gray-400' :
                                                        'bg-red-600'
                                                    }`}></span>
                                                    {product.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/dashboard/admin/products/new?id=${product._id}`}
                                                        className="p-2 hover:bg-white hover:shadow-md rounded-md text-[#2563EB] transition-all border border-transparent hover:border-gray-100"
                                                        title="Edit"
                                                    >
                                                        <FiEdit2 size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="p-2 hover:bg-white hover:shadow-md rounded-md text-red-500 transition-all border border-transparent hover:border-gray-100"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                    <button className="p-2 hover:bg-white hover:shadow-md rounded-md text-gray-500 transition-all border border-transparent hover:border-gray-100">
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
                                    Showing{' '}
                                    <span className="font-semibold text-gray-700">{(page - 1) * 10 + 1}–{Math.min(page * 10, meta.total)}</span>
                                    {' '}of{' '}
                                    <span className="font-semibold text-gray-700">{meta.total}</span> products
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
                            <FiShoppingBag size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">No products found</h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Start adding products to your store to see them listed here.</p>
                        <Link
                            href="/dashboard/admin/products/new"
                            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-[#2563EB] text-white rounded-md font-bold hover:bg-[#1D4ED8] transition-all shadow-md"
                        >
                            <FiPlus size={20} />
                            Add Your First Product
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;