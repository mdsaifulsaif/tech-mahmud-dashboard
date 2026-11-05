import { baseApi } from './baseApi';

export const unitApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // সব ইউনিট গেট করার কুয়েরি
        getUnits: builder.query({
            query: (params) => ({
                url: '/unit',
                method: 'GET',
                params,
            }),
            providesTags: ['Units' as any],
        }),
        
        // নির্দিষ্ট ইউনিট আইডি দিয়ে গেট করার কুয়েরি
        getUnitById: builder.query({
            query: (id) => `/unit/${id}`,
            providesTags: (result, error, id) => [{ type: 'Units' as any, id }],
        }),

        // নতুন ইউনিট তৈরি করার মিউটেশন
        createUnit: builder.mutation({
            query: (data) => ({
                url: '/unit/create-unit', // আপনার ব্যাকএন্ড রাউট অনুযায়ী
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Units' as any],
        }),

        // ইউনিট আপডেট করার মিউটেশন
        updateUnit: builder.mutation({
            query: ({ id, data }) => ({
                url: `/unit/${id}`, // আপনার ব্যাকএন্ড রাউট অনুযায়ী
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Units' as any, { type: 'Units' as any, id }],
        }),

        // ইউনিট ডিলিট করার মিউটেশন
        deleteUnit: builder.mutation({
            query: (id) => ({
                url: `/unit/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Units' as any],
        }),
    }),
});

export const {
    useGetUnitsQuery,
    useGetUnitByIdQuery,
    useCreateUnitMutation,
    useUpdateUnitMutation,
    useDeleteUnitMutation,
} = unitApi;