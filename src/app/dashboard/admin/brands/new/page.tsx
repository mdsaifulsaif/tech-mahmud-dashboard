// "use client";

// import React, { useState, useEffect, Suspense } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import {
//     FiArrowLeft,
//     FiSave,
//     FiImage,
//     FiX,
//     FiInfo,
//     FiSettings,
// } from 'react-icons/fi';
// import {
//     useCreateBrandMutation,
//     useUpdateBrandMutation,
//     useGetBrandByIdQuery,
// } from '@/redux/api/brandApi';
// import { toast } from 'react-hot-toast';

// const BrandFormInner = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const brandId = searchParams.get('id');         // ✅ URL থেকে id নেওয়া
//     const isEditing = !!brandId;                    // ✅ id থাকলে edit mode

//     const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
//     const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();

//     // ✅ edit mode হলে brand data fetch করা
//     const { data: brandToEdit, isLoading: isFetching } = useGetBrandByIdQuery(brandId, {
//         skip: !isEditing
//     });

//     const [formData, setFormData] = useState({
//         name: '',
//         slug: '',
//         description: '',
//         status: 'active',
//         isFeatured: false,
//         showInMenu: true,
//         showInHome: true,
//         order: 0,
//         image: null as File | string | null,
//         icon: '',
//         metaTitle: '',
//         metaDescription: '',
//     });

//     // ✅ edit mode হলে form এ data populate করা
//     useEffect(() => {
//         if (isEditing && brandToEdit?.data) {
//             const brand = brandToEdit.data;
//             setFormData({
//                 name: brand.name || '',
//                 slug: brand.slug || '',
//                 description: brand.description || '',
//                 status: brand.status || 'active',
//                 isFeatured: !!brand.isFeatured,
//                 showInMenu: !!brand.showInMenu,
//                 showInHome: !!brand.showInHome,
//                 order: brand.order || 0,
//                 image: brand.logo || null,       // ✅ backend 'logo' key থেকে নেওয়া
//                 icon: brand.icon || '',
//                 metaTitle: brand.metaTitle || '',
//                 metaDescription: brand.metaDescription || '',
//             });
//         }
//     }, [isEditing, brandToEdit]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value, type, files } = e.target as HTMLInputElement;

//         if (type === 'file') {
//             setFormData(prev => ({ ...prev, [name]: files?.[0] || null }));
//         } else if (type === 'checkbox') {
//             setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
//         } else {
//             setFormData(prev => ({ ...prev, [name]: value }));
//         }

//         if (name === 'name' && !isEditing) {
//             setFormData(prev => ({
//                 ...prev,
//                 slug: value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
//             }));
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         const data = new FormData();
//         Object.entries(formData).forEach(([key, value]) => {
//             if (value !== null && value !== undefined && value !== '') {
//                 // ✅ image field কে backend এর 'logo' key হিসেবে পাঠানো
//                 if (key === 'image' && value instanceof File) {
//                     data.append('logo', value);
//                 } else if (key !== 'image') {
//                     data.append(key, value as any);
//                 }
//             }
//         });

//         try {
//             if (isEditing) {
//                 await updateBrand({ id: brandId, data }).unwrap();
//                 toast.success('Brand updated successfully');
//             } else {
//                 await createBrand(data).unwrap();
//                 toast.success('Brand created successfully');
//             }
//             router.push('/dashboard/admin/brands');
//         } catch (error: any) {
//             toast.error(error?.data?.message || 'Something went wrong');
//         }
//     };

//     // ✅ edit mode এ data load হওয়ার আগে loading দেখানো
//     if (isEditing && isFetching) {
//         return <div className="p-20 text-center">Loading brand data...</div>;
//     }

//     return (
//         <div className="max-w-5xl mx-auto space-y-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm">
//                 <div className="flex items-center gap-4">
//                     <Link
//                         href="/dashboard/admin/brands"
//                         className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-600"
//                     >
//                         <FiArrowLeft size={20} />
//                     </Link>
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-800">
//                             {isEditing ? 'Edit Brand' : 'Create New Brand'}
//                         </h1>
//                         <p className="text-sm text-gray-500 mt-1">
//                             {isEditing ? `Update details for "${formData.name}"` : 'Setup a new product Brand for your store'}
//                         </p>
//                     </div>
//                 </div>
//                 <button
//                     onClick={handleSubmit}
//                     disabled={isCreating || isUpdating}
//                     className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-md font-bold hover:bg-[#1D4ED8] transition-all shadow-md disabled:opacity-50"
//                 >
//                     <FiSave size={20} />
//                     {isCreating || isUpdating ? 'Saving...' : isEditing ? 'Update Brand' : 'Save Brand'}
//                 </button>
//             </div>

//             <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Left Column */}
//                 <div className="lg:col-span-2 space-y-6">
//                     {/* Basic Info */}
//                     <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
//                         <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
//                             <FiInfo className="text-[#2563EB]" size={18} />
//                             <h2 className="font-bold text-gray-800">Basic Information</h2>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                             <div className="space-y-2">
//                                 <label className="text-sm font-semibold text-gray-700">Brand Name *</label>
//                                 <input type="text" name="name" required placeholder="e.g. Apple, Samsung" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.name} onChange={handleChange} />
//                             </div>
//                             <div className="space-y-2">
//                                 <label className="text-sm font-semibold text-gray-700">Slug (URL Key)</label>
//                                 <input type="text" name="slug" placeholder="apple-inc" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.slug} onChange={handleChange} />
//                             </div>
//                         </div>
//                         <div className="space-y-2">
//                             <label className="text-sm font-semibold text-gray-700">Description</label>
//                             <textarea name="description" rows={4} placeholder="Describe this brand..." className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.description} onChange={handleChange}></textarea>
//                         </div>
//                     </div>

//                     {/* SEO */}
//                     <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
//                         <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
//                             <FiSettings className="text-[#2563EB]" size={18} />
//                             <h2 className="font-bold text-gray-800">Display & SEO</h2>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                             <div className="space-y-2">
//                                 <label className="text-sm font-semibold text-gray-700">Meta Title</label>
//                                 <input type="text" name="metaTitle" placeholder="SEO Page Title" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.metaTitle} onChange={handleChange} />
//                             </div>
//                             <div className="space-y-2">
//                                 <label className="text-sm font-semibold text-gray-700">Display Order</label>
//                                 <input type="number" name="order" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.order} onChange={handleChange} />
//                             </div>
//                         </div>
//                         <div className="space-y-2">
//                             <label className="text-sm font-semibold text-gray-700">Meta Description</label>
//                             <textarea name="metaDescription" rows={3} placeholder="SEO Meta Description..." className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.metaDescription} onChange={handleChange}></textarea>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Column */}
//                 <div className="space-y-6">
//                     {/* Media */}
//                     <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
//                         <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
//                             <FiImage className="text-[#2563EB]" size={18} />
//                             <h2 className="font-bold text-gray-800">Media & Icon</h2>
//                         </div>
//                         <div className="space-y-4">
//                             <div className="space-y-2">
//                                 <label className="text-sm font-semibold text-gray-700">Brand Logo</label>
//                                 <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full text-sm" />
//                                 {formData.image && (
//                                     <div className="mt-2 w-full aspect-square bg-gray-50 rounded-md overflow-hidden border border-gray-200 relative group">
//                                         <img
//                                             src={formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image}
//                                             alt="Preview"
//                                             className="w-full h-full object-cover"
//                                         />
//                                         <button type="button" onClick={() => setFormData(prev => ({ ...prev, image: null }))} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
//                                             <FiX size={14} />
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="space-y-2">
//                                 <label className="text-sm font-semibold text-gray-700">Icon URL (SVG/Font)</label>
//                                 <input type="text" name="icon" placeholder="https://icon-url.svg" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.icon} onChange={handleChange} />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Status */}
//                     <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
//                         <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
//                             <FiSettings className="text-[#2563EB]" size={18} />
//                             <h2 className="font-bold text-gray-800">Status & Toggle</h2>
//                         </div>
//                         <div className="space-y-2">
//                             <label className="text-sm font-semibold text-gray-700">Status</label>
//                             <select name="status" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.status} onChange={handleChange}>
//                                 <option value="active">Active</option>
//                                 <option value="inactive">Inactive</option>
//                             </select>
//                         </div>
//                         <div className="space-y-4 pt-2">
//                             <label className="flex items-center gap-3 cursor-pointer">
//                                 <div className="relative">
//                                     <input type="checkbox" name="isFeatured" className="sr-only" checked={formData.isFeatured} onChange={handleChange} />
//                                     <div className={`w-10 h-5 rounded-full transition-colors ${formData.isFeatured ? 'bg-[#2563EB]' : 'bg-gray-200'}`}></div>
//                                     <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-all ${formData.isFeatured ? 'translate-x-5' : ''}`}></div>
//                                 </div>
//                                 <span className="text-sm font-medium text-gray-700">Featured Brand</span>
//                             </label>
//                             <label className="flex items-center gap-3 cursor-pointer">
//                                 <div className="relative">
//                                     <input type="checkbox" name="showInMenu" className="sr-only" checked={formData.showInMenu} onChange={handleChange} />
//                                     <div className={`w-10 h-5 rounded-full transition-colors ${formData.showInMenu ? 'bg-[#2563EB]' : 'bg-gray-200'}`}></div>
//                                     <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-all ${formData.showInMenu ? 'translate-x-5' : ''}`}></div>
//                                 </div>
//                                 <span className="text-sm font-medium text-gray-700">Show in Menu</span>
//                             </label>
//                             <label className="flex items-center gap-3 cursor-pointer">
//                                 <div className="relative">
//                                     <input type="checkbox" name="showInHome" className="sr-only" checked={formData.showInHome} onChange={handleChange} />
//                                     <div className={`w-10 h-5 rounded-full transition-colors ${formData.showInHome ? 'bg-[#2563EB]' : 'bg-gray-200'}`}></div>
//                                     <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-all ${formData.showInHome ? 'translate-x-5' : ''}`}></div>
//                                 </div>
//                                 <span className="text-sm font-medium text-gray-700">Show on Homepage</span>
//                             </label>
//                         </div>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };

// const BrandForm = () => {
//     return (
//         <Suspense fallback={<div className="p-20 text-center text-[#2563EB]">Initializing brand form...</div>}>
//             <BrandFormInner />
//         </Suspense>
//     );
// };

// export default BrandForm;


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
    useCreateBrandMutation,
    useUpdateBrandMutation,
    useGetBrandByIdQuery,
} from '@/redux/api/brandApi';
import { toast } from 'react-hot-toast';

const BrandFormInner = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const brandId = searchParams.get('id');
    const isEditing = !!brandId;

    const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
    const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();

    const { data: brandToEdit, isLoading: isFetching } = useGetBrandByIdQuery(brandId!, {
        skip: !isEditing
    });

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        status: 'active' as 'active' | 'inactive',
        isFeatured: false,
        showInMenu: true,
        showInHome: true,
        order: 0,
        image: null as File | null,           // নতুন ফাইল
        currentLogo: '',                      // পুরানো লোগো দেখানোর জন্য
        icon: '',
        metaTitle: '',
        metaDescription: '',
    });

    // Edit mode এ ডাটা লোড করা
    useEffect(() => {
        if (isEditing && brandToEdit?.data) {
            const brand = brandToEdit.data;
            setFormData({
                name: brand.name || '',
                slug: brand.slug || '',
                description: brand.description || '',
                status: brand.status || 'active',
                isFeatured: !!brand.isFeatured,
                showInMenu: !!brand.showInMenu,
                showInHome: !!brand.showInHome,
                order: brand.order || 0,
                image: null,                     // নতুন ফাইল খালি রাখা
                currentLogo: brand.logo || '',   // পুরানো লোগো
                icon: brand.icon || '',
                metaTitle: brand.metaTitle || '',
                metaDescription: brand.metaDescription || '',
            });
        }
    }, [isEditing, brandToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, files } = e.target as HTMLInputElement;

        if (type === 'file' && files) {
            setFormData(prev => ({ ...prev, image: files[0] }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (name === 'name' && !isEditing) {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();

        // সব টেক্সট ফিল্ড যোগ করা
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'image') {
                if (value instanceof File) {
                    data.append('logo', value);        // backend এ logo হিসেবে পাঠানো
                }
            } else if (value !== null && value !== undefined) {
                data.append(key, value as any);
            }
        });

        try {
            if (isEditing) {
                await updateBrand({ id: brandId, data }).unwrap();
                toast.success('Brand updated successfully!');
            } else {
                await createBrand(data).unwrap();
                toast.success('Brand created successfully!');
            }
            router.push('/dashboard/admin/brands');
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    if (isEditing && isFetching) {
        return <div className="p-20 text-center text-[#2563EB]">Loading brand data...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/admin/brands"
                        className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-600"
                    >
                        <FiArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {isEditing ? 'Edit Brand' : 'Create New Brand'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {isEditing ? `Update details for "${formData.name}"` : 'Setup a new product Brand for your store'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isCreating || isUpdating}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-md font-bold hover:bg-[#1D4ED8] transition-all shadow-md disabled:opacity-50"
                >
                    <FiSave size={20} />
                    {isCreating || isUpdating ? 'Saving...' : isEditing ? 'Update Brand' : 'Save Brand'}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                            <FiInfo className="text-[#2563EB]" size={18} />
                            <h2 className="font-bold text-gray-800">Basic Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Brand Name *</label>
                                <input type="text" name="name" required placeholder="e.g. Apple, Samsung" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Slug (URL Key)</label>
                                <input type="text" name="slug" placeholder="apple-inc" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.slug} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Description</label>
                            <textarea name="description" rows={4} placeholder="Describe this brand..." className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.description} onChange={handleChange}></textarea>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                            <FiSettings className="text-[#2563EB]" size={18} />
                            <h2 className="font-bold text-gray-800">Display & SEO</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Meta Title</label>
                                <input type="text" name="metaTitle" placeholder="SEO Page Title" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.metaTitle} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Display Order</label>
                                <input type="number" name="order" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.order} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Meta Description</label>
                            <textarea name="metaDescription" rows={3} placeholder="SEO Meta Description..." className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.metaDescription} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Media */}
                    <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                            <FiImage className="text-[#2563EB]" size={18} />
                            <h2 className="font-bold text-gray-800">Media & Icon</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Brand Logo</label>
                                <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full text-sm" />

                                {/* Current Logo Preview */}
                                {formData.currentLogo && !formData.image && (
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-500 mb-1">Current Logo</p>
                                        <img 
                                            src={formData.currentLogo} 
                                            alt="Current Logo" 
                                            className="h-24 object-contain border border-gray-200 rounded-md" 
                                        />
                                    </div>
                                )}

                                {/* New Image Preview */}
                                {formData.image && (
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-500 mb-1">New Logo Preview</p>
                                        <img 
                                            src={URL.createObjectURL(formData.image)} 
                                            alt="Preview" 
                                            className="h-24 object-contain border border-gray-200 rounded-md" 
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Icon URL (SVG/Font)</label>
                                <input type="text" name="icon" placeholder="https://icon-url.svg" className="w-full px-4 py-2.5 border border-gray-200 rounded-md outline-none focus:border-[#2563EB] text-sm" value={formData.icon} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Status */}
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
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="isFeatured" className="accent-[#2563EB]" checked={formData.isFeatured} onChange={handleChange} />
                                <span className="text-sm font-medium text-gray-700">Featured Brand</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="showInMenu" className="accent-[#2563EB]" checked={formData.showInMenu} onChange={handleChange} />
                                <span className="text-sm font-medium text-gray-700">Show in Menu</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="showInHome" className="accent-[#2563EB]" checked={formData.showInHome} onChange={handleChange} />
                                <span className="text-sm font-medium text-gray-700">Show on Homepage</span>
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

const BrandForm = () => {
    return (
        <Suspense fallback={<div className="p-20 text-center text-[#2563EB]">Initializing brand form...</div>}>
            <BrandFormInner />
        </Suspense>
    );
};

export default BrandForm;