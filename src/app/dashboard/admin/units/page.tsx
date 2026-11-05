"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiSearch,
    FiFilter,
    FiMoreVertical,
    FiPackage
} from 'react-icons/fi';

import { toast } from 'react-hot-toast';
import { useDeleteUnitMutation, useGetUnitsQuery } from '@/redux/api/unitApi';

const UnitsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const { data: unitsData, isLoading, refetch } = useGetUnitsQuery({
        searchTerm,
        page,
        limit: 10
    });
    const [deleteUnit] = useDeleteUnitMutation();

    const units = unitsData?.data || [];
    const meta = unitsData?.meta || {};

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this unit?')) {
            try {
                await deleteUnit(id).unwrap();
                toast.success('Unit deleted successfully');
            } catch (error: any) {
                toast.error(error?.data?.message || 'Failed to delete unit');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Product Units</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your store's product measurement units</p>
                </div>
                <Link
                    href="/dashboard/admin/units/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-md font-semibold hover:bg-[#1D4ED8] transition-all shadow-md"
                >
                    <FiPlus size={20} />
                    Create Unit
                </Link>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <div className="relative w-full md:w-96">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search units..."
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

            {/* Table */}
            <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-20 text-center text-gray-500">
                        <div className="animate-spin w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p>Loading units...</p>
                    </div>
                ) : units.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Unit Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Short Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {units.map((unit: any, index: number) => (
                                        <tr key={unit._id} className="hover:bg-gray-50/50 transition-all group">
                                            <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                                                {(page - 1) * 10 + index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center border border-gray-200">
                                                        <FiPackage size={18} className="text-[#2563EB]" />
                                                    </div>
                                                    <p className="font-bold text-gray-800">{unit.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                                                    {unit.shortName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/dashboard/admin/units/new?id=${unit._id}`}
                                                        className="p-2 hover:bg-white hover:shadow-md rounded-md text-[#2563EB] transition-all border border-transparent hover:border-gray-100"
                                                        title="Edit"
                                                    >
                                                        <FiEdit2 size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(unit._id)}
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
                                    Showing{' '}
                                    <span className="font-semibold text-gray-700">
                                        {(page - 1) * 10 + 1}–{Math.min(page * 10, meta.total)}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-semibold text-gray-700">{meta.total}</span> units
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
                            <FiPackage size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">No units found</h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                            Try adjusting your search or create a new unit to get started.
                        </p>
                        <Link
                            href="/dashboard/admin/units/new"
                            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-[#2563EB] text-white rounded-xl font-bold hover:bg-[#1D4ED8] transition-all"
                        >
                            <FiPlus size={20} />
                            Create Your First Unit
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnitsPage;