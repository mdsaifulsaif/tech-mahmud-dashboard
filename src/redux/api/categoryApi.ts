import { baseApi } from './baseApi';

export const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: (params) => ({
                url: '/categories',
                params,
            }),
            providesTags: ['Categories'],
        }),
        getCategoryTree: builder.query({
            query: () => '/categories/tree',
            providesTags: ['Categories'],
        }),
        getCategoryById: builder.query({
            query: (id) => `/categories/${id}`,
            providesTags: (result, error, id) => [{ type: 'Categories', id }],
        }),
        createCategory: builder.mutation({
            query: (data) => ({
                url: '/categories/create-category',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Categories'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, data }) => ({
                url: `/categories/update-category/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Categories', { type: 'Categories', id }],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Categories'],
        }),
        toggleFeaturedCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/toggle-featured/${id}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Categories'],
        }),
        toggleHomeCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/toggle-home/${id}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Categories'],
        }),
        updateCategoryOrder: builder.mutation({
            query: (data) => ({
                url: '/categories/admin/order',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Categories'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryTreeQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateCategoryOrderMutation,
    useToggleFeaturedCategoryMutation,
    useToggleHomeCategoryMutation,
} = categoryApi;
