

"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import {
    FiMessageSquare,
    FiCheckCircle,
    FiXCircle,
    FiTrash2,
    FiRefreshCw,
    FiSend,
    FiCornerDownRight,
    FiUser,
    FiClock,
    FiEye,
    FiX,
} from 'react-icons/fi';
import {
    useGetAllComplaintsQuery,
    useUpdateComplaintMutation,
    useDeleteComplaintMutation,
} from '@/redux/api/complaintApi';
import toast from 'react-hot-toast';

// View Modal
const ViewModal = ({ isOpen, onClose, complaint }: { isOpen: boolean; onClose: () => void; complaint: any }) => {
    if (!isOpen || !complaint) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-md w-full max-w-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0">
                    <h3 className="font-bold text-gray-800 text-lg">Complaint Details</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><FiX size={22} /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase">Phone Number</p>
                        <p className="font-medium text-lg">{complaint.phoneNumber}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">Complaint</p>
                        <p className="text-gray-700 text-[15px] leading-relaxed">"{complaint.text}"</p>
                    </div>
                    {complaint.images?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Images</p>
                            <div className="grid grid-cols-3 gap-3">
                                {complaint.images.map((img: string, idx: number) => (
                                    img && <Image key={idx} src={img} alt="" width={180} height={180} className="rounded-lg object-cover" />
                                ))}
                            </div>
                        </div>
                    )}
                    {complaint.adminResponse && (
                        <div className="bg-gray-50 p-4 rounded border">
                            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Admin Response</p>
                            <p className="text-gray-700">{complaint.adminResponse}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Reply + Status Change Modal
const ReplyModal = ({
    isOpen,
    onClose,
    onSubmit,
    complaint
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { status: string; adminResponse: string }) => void;
    complaint: any;
}) => {
    const [status, setStatus] = useState(complaint?.status || 'resolved');
    const [responseText, setResponseText] = useState(complaint?.adminResponse || '');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit({ status, adminResponse: responseText });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-md w-full max-w-md shadow-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 text-lg">Update Complaint</h3>
                    <button onClick={onClose}><FiX size={20} /></button>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Status</label>
                        <select
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#2563EB]"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Admin Response</label>
                        <textarea
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#2563EB] outline-none h-32 resize-none text-sm"
                            placeholder="Type your response..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                        />
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-[#2563EB] text-white rounded-md text-sm font-bold shadow-md hover:bg-[#1D4ED8] flex items-center gap-2"
                    >
                        <FiSend size={16} />
                        Update & Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ComplaintsPage() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');

    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

    const { data: responseData, isLoading, refetch } = useGetAllComplaintsQuery({
        page,
        limit: 10,
        status: statusFilter || undefined,
    });

    const [updateComplaint] = useUpdateComplaintMutation();
    const [deleteComplaint] = useDeleteComplaintMutation();

    const apiData = responseData?.data || {};
    const complaints = Array.isArray(apiData.data) ? apiData.data : [];
    const meta = apiData.meta || { total: 0, totalPage: 1, statusCounts: {} };

    const statCards = [
        { label: 'Total Complaints', value: meta.total, icon: FiMessageSquare, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { label: 'Pending', value: meta.statusCounts?.pending || 0, icon: FiClock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        { label: 'Resolved', value: meta.statusCounts?.resolved || 0, icon: FiCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { label: 'Rejected', value: meta.statusCounts?.rejected || 0, icon: FiXCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    ];

    const handleReplySubmit = async (data: { status: string; adminResponse: string }) => {
        try {
            await updateComplaint({
                id: selectedComplaint._id,
                ...data
            }).unwrap();
            toast.success('Complaint updated successfully');
            setIsReplyModalOpen(false);
            setSelectedComplaint(null);
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this complaint?')) return;
        try {
            await deleteComplaint(id).unwrap();
            toast.success('Complaint deleted successfully');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Delete failed');
        }
    };

    const openViewModal = (complaint: any) => {
        setSelectedComplaint(complaint);
        setIsViewModalOpen(true);
    };

    const openReplyModal = (complaint: any) => {
        setSelectedComplaint(complaint);
        setIsReplyModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Customer Complaints</h1>
                    <p className="text-gray-500 mt-1">Monitor and resolve customer issues</p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm"
                >
                    <FiRefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Stats Cards - Same as Reviews */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <div key={i} className={`${stat.bg} ${stat.border} border rounded-md p-5 shadow-sm`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-md bg-white shadow-sm ${stat.color}`}>
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${stat.color} leading-none`}>{stat.value}</p>
                                <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter & Table */}
            <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/10">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase">Filter Status:</span>
                        <div className="flex gap-1.5">
                            {['', 'pending', 'in-progress', 'resolved', 'rejected'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => { setStatusFilter(s); setPage(1); }}
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all border ${statusFilter === s
                                        ? 'bg-gray-800 text-white border-gray-800 shadow-md'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {s || 'All'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 font-medium italic">
                        Showing {complaints.length} of {meta.total} complaints
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User / Phone</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[400px]">Complaint</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-6 py-4"><div className="h-16 bg-gray-100 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : complaints.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No complaints found.</td>
                                </tr>
                            ) : (
                                complaints.map((complaint: any) => (
                                    <tr key={complaint._id} className="hover:bg-gray-50/50 align-top">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <FiUser size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {complaint.userID?.firstName || 'Guest'} {complaint.userID?.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{complaint.phoneNumber}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-600 italic">"{complaint.text}"</p>
                                                {complaint.images?.length > 0 && (
                                                    <div className="flex gap-2">
                                                        {complaint.images.map((img: string, idx: number) => (
                                                            img && <div key={idx} className="w-12 h-12 rounded border border-gray-100 relative overflow-hidden">
                                                                <Image src={img} alt="complaint" fill className="object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                complaint.status === 'resolved' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                complaint.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                complaint.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                'bg-amber-50 text-amber-700 border border-amber-100'
                                            }`}>
                                                {complaint.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openViewModal(complaint)}
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-md border border-gray-100"
                                                    title="View Details"
                                                >
                                                    <FiEye size={16} />
                                                </button>

                                                <button
                                                    onClick={() => openReplyModal(complaint)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-md border border-gray-100"
                                                    title="Reply & Update"
                                                >
                                                    <FiMessageSquare size={16} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(complaint._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md border border-gray-100"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {meta.totalPage > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex justify-center gap-2">
                        {[...Array(meta.totalPage)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-8 h-8 rounded-md text-sm font-bold transition-all ${
                                    page === i + 1 ? 'bg-[#2563EB] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <ViewModal isOpen={isViewModalOpen} onClose={() => { setIsViewModalOpen(false); setSelectedComplaint(null); }} complaint={selectedComplaint} />

            <ReplyModal
                isOpen={isReplyModalOpen}
                onClose={() => { setIsReplyModalOpen(false); setSelectedComplaint(null); }}
                onSubmit={handleReplySubmit}
                complaint={selectedComplaint}
            />
        </div>
    );
}