
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    FiArrowLeft,
    FiSave,
    FiImage,
    FiX,
    FiInfo,
    FiSettings,
} from 'react-icons/fi';
import {
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useGetCategoryByIdQuery,
    useGetCategoriesQuery
} from '@/redux/api/categoryApi';
import { toast } from 'react-hot-toast';
import { cleanSlug } from '@/lib/slugify';

const CategoryFormInner = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('id');
    const isEditing = !!categoryId;

    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const { data: categoryToEdit, isLoading: isFetching } = useGetCategoryByIdQuery(categoryId, { skip: !isEditing });
    const { data: categoriesData } = useGetCategoriesQuery({});

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        parentCategory: '',
        status: 'active',
        isFeatured: false,
        showInMenu: true,
        showInHome: true,
        order: 0,
        image: null as File | string | null,
        icon: '',
        banner: '',
        metaTitle: '',
        metaDescription: '',
    });

    // Populate form if editing
    useEffect(() => {
        if (isEditing && categoryToEdit?.data) {
            const cat = categoryToEdit.data;
            setFormData({
                name: cat.name || '',
                slug: cat.slug || '',
                description: cat.description || '',
                parentCategory: cat.parentCategory?._id || cat.parentCategory || '',
                status: cat.status || 'active',
                isFeatured: !!cat.isFeatured,
                showInMenu: !!cat.showInMenu,
                showInHome: !!cat.showInHome,
                order: cat.order || 0,
                image: cat.image || null,
                icon: cat.icon || '',
                banner: cat.banner || '',
                metaTitle: cat.metaTitle || '',
                metaDescription: cat.metaDescription || '',
            });
        }
    }, [isEditing, categoryToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, files } = e.target as HTMLInputElement;
        
        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files?.[0] || null }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Auto-generate clean slug from name if not editing slug manually
        if (name === 'name' && !isEditing) {
            setFormData(prev => ({
                ...prev,
                slug: cleanSlug(value)
            }));
        } else if (name === 'slug') {
            setFormData(prev => ({
                ...prev,
                slug: cleanSlug(value)
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // FormData ব্যবহার করে ডাটা পাঠানো হচ্ছে
        const data = new FormData();
        const safeSlug = cleanSlug(formData.slug || formData.name);
        Object.entries({ ...formData, slug: safeSlug }).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                data.append(key, value as any);
            }
        });

        try {
            if (isEditing) {
                await updateCategory({ id: categoryId, data }).unwrap();
                toast.success('Category updated successfully');
            } else {
                await createCategory(data).unwrap();
                toast.success('Category created successfully');
            }
            router.push('/dashboard/admin/categories');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    if (isEditing && isFetching) {
        return <div className="p-20 text-center">Loading category data...</div>;
    }

    const categories = categoriesData?.data || [];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/admin/categories"
                        className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-600"
                    >
                        <FiArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {isEditing ? 'Edit Category' : 'Create New Category'}
                        </h1>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isCreating || isUpdating}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-md font-bold hover:bg-[#1D4ED8] transition-all shadow-md disabled:opacity-50"
                >
                    <FiSave size={20} />
                    {isCreating || isUpdating ? 'Saving...' : 'Save Category'}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                            <FiInfo className="text-[#2563EB]" size={18} />
                            <h2 className="font-bold text-gray-800">Basic Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Category Name *</label>
                                <input type="text" name="name" required className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Slug (URL Key)</label>
                                <input type="text" name="slug" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.slug} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Parent Category</label>
                            <select name="parentCategory" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.parentCategory} onChange={handleChange}>
                                <option value="">Root Category (None)</option>
                                {categories.map((cat: any) => (
                                    cat._id !== categoryId && <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Description</label>
                            <textarea name="description" rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.description} onChange={handleChange}></textarea>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                            <FiSettings className="text-[#2563EB]" size={18} />
                            <h2 className="font-bold text-gray-800">Display & SEO</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Meta Title</label>
                                <input type="text" name="metaTitle" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.metaTitle} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Display Order</label>
                                <input type="number" name="order" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.order} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Meta Description</label>
                            <textarea name="metaDescription" rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.metaDescription} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                            <FiImage className="text-[#2563EB]" size={18} />
                            <h2 className="font-bold text-gray-800">Media & Icon</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Image</label>
                                <input type="file" name="image" onChange={handleChange} className="w-full text-sm" />
                                {formData.image && (
                                    <div className="mt-2 w-full aspect-square bg-gray-50 rounded-md overflow-hidden border border-gray-200 relative">
                                        <img src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image as File)} alt="Preview" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: null }))} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md"><FiX size={14} /></button>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Icon URL</label>
                                <input type="text" name="icon" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.icon} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                            <FiSettings className="text-[#2563EB]" size={18} />
                            <h2 className="font-bold text-gray-800">Status & Toggle</h2>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Status</label>
                            <select name="status" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.status} onChange={handleChange}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="space-y-4 pt-2">
                            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} /> Featured Category</label>
                            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="showInMenu" checked={formData.showInMenu} onChange={handleChange} /> Show in Menu</label>
                            <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="showInHome" checked={formData.showInHome} onChange={handleChange} /> Show on Home 3-Cards Promo</label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

const CategoryForm = () => {
    return (
        <Suspense fallback={<div className="p-20 text-center text-[#2563EB]">Initializing...</div>}>
            <CategoryFormInner />
        </Suspense>
    );
};

export default CategoryForm;