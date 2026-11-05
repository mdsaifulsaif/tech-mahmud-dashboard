"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    FiSave,
    FiInfo,
} from 'react-icons/fi';
import {
    useCreateUnitMutation,
    useUpdateUnitMutation,
    useGetUnitByIdQuery,
} from '@/redux/api/unitApi';
import { toast } from 'react-hot-toast';

const UnitFormInner = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const unitId = searchParams.get('id');
    const isEditing = !!unitId;

    const [createUnit, { isLoading: isCreating }] = useCreateUnitMutation();
    const [updateUnit, { isLoading: isUpdating }] = useUpdateUnitMutation();
    const { data: unitToEdit, isLoading: isFetching } = useGetUnitByIdQuery(unitId, { skip: !isEditing });

    const [formData, setFormData] = useState({
        name: '',
        shortName: '',
    });

    useEffect(() => {
        if (isEditing && unitToEdit?.data) {
            const unit = unitToEdit.data;
            setFormData({
                name: unit.name || '',
                shortName: unit.shortName || '',
            });
        }
    }, [isEditing, unitToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateUnit({ id: unitId, data: formData }).unwrap();
                toast.success('Unit updated successfully');
            } else {
                await createUnit(formData).unwrap();
                toast.success('Unit created successfully');
            }
            router.push('/dashboard/admin/units');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    if (isEditing && isFetching) {
        return <div className="p-20 text-center">Loading unit data...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isEditing ? 'Edit Unit' : 'Create New Unit'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isEditing ? `Update details for "${formData.name}"` : 'Add a new measurement unit for your products'}
                    </p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isCreating || isUpdating}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-md font-bold hover:bg-[#1D4ED8] transition-all shadow-md disabled:opacity-50"
                >
                    <FiSave size={20} />
                    {isCreating || isUpdating ? 'Saving...' : isEditing ? 'Update Unit' : 'Save Unit'}
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                        <FiInfo className="text-[#2563EB]" size={18} />
                        <h2 className="font-bold text-gray-800">Basic Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Unit Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="e.g. Kilogram, Liter, Piece"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] transition-all text-sm"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Short Name *</label>
                            <input
                                type="text"
                                name="shortName"
                                required
                                placeholder="e.g. kg, L, pcs"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] transition-all text-sm"
                                value={formData.shortName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

const UnitForm = () => {
    return (
        <Suspense fallback={<div className="p-20 text-center text-[#2563EB]">Initializing unit form...</div>}>
            <UnitFormInner />
        </Suspense>
    );
};

export default UnitForm;