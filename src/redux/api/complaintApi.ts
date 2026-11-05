import { baseApi } from "./baseApi";

export const complaintApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // সব কমপ্লেইন (পেজিনেশন + ফিল্টার)
        getAllComplaints: builder.query({
            query: (params) => ({
                url: '/complaints',
                method: 'GET',
                params,
            }),
            providesTags: ['Complaints'],
        }),

        // সিঙ্গেল কমপ্লেইন
        getSingleComplaint: builder.query({
            query: (id) => ({
                url: `/complaints/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Complaints', id }],
        }),

        // কমপ্লেইন তৈরি (ইউজারের জন্য)
        createComplaint: builder.mutation({
            query: (formData) => ({
                url: '/complaints',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Complaints'],
        }),

        // অ্যাডমিন আপডেট (স্ট্যাটাস + রেসপন্স)
        updateComplaint: builder.mutation({
            query: ({ id, ...payload }) => ({
                url: `/complaints/${id}`,
                method: 'PATCH',
                body: payload,
            }),
            invalidatesTags: ['Complaints'],
        }),

        // ডিলিট
        deleteComplaint: builder.mutation({
            query: (id) => ({
                url: `/complaints/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Complaints'],
        }),
    }),
});

export const {
    useGetAllComplaintsQuery,
    useGetSingleComplaintQuery,
    useCreateComplaintMutation,
    useUpdateComplaintMutation,
    useDeleteComplaintMutation,
} = complaintApi;