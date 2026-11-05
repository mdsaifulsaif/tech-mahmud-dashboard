import { baseApi } from "./baseApi";

export const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all reviews or filtered reviews
        getAllReviews: builder.query({
            query: (params) => ({
                url: '/reviews',
                method: 'GET',
                params
            }),
            providesTags: ['Reviews']
        }),

        // Get stats for the dashboard
        getReviewStats: builder.query({
            query: () => ({
                url: '/reviews/stats',
                method: 'GET'
            }),
            providesTags: ['Reviews']
        }),

        // Update review status (Approve/Reject)
        updateReviewStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/reviews/${id}/status`,
                method: 'PATCH',
                body: { status }
            }),
            invalidatesTags: ['Reviews']
        }),

        // Add admin reply to a review
        addAdminReply: builder.mutation({
            query: ({ id, reply }) => ({
                url: `/reviews/${id}/reply`,
                method: 'POST',
                body: { reply }
            }),
            invalidatesTags: ['Reviews']
        }),

        // Delete a review
        deleteReview: builder.mutation({
            query: (id) => ({
                url: `/reviews/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Reviews']
        }),

        // Get reviews for a specific product page
        getProductReviews: builder.query({
            query: ({ productId, ...params }) => ({
                url: `/reviews/${productId}`,
                method: 'GET',
                params
            }),
            providesTags: (result, error, { productId }) => [{ type: 'Reviews', id: productId }]
        }),

        // Get a single review by ID
        getSingleReview: builder.query({
            query: (id) => ({
                url: `/reviews/single/${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, id) => [{ type: 'Reviews', id }]
        }),

        // Update an existing review content
        updateReview: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/reviews/${id}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Reviews']
        }),
         // ✅ Admin: Toggle Featured
    toggleFeaturedReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/admin/${id}/featured`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Reviews'],
    }),
    })
});

export const {
    useGetAllReviewsQuery,
    useGetReviewStatsQuery,
    useUpdateReviewStatusMutation,
    useAddAdminReplyMutation,
    useDeleteReviewMutation,
    useGetProductReviewsQuery,
    useGetSingleReviewQuery,
    useUpdateReviewMutation,
      useToggleFeaturedReviewMutation,
} = reviewApi;