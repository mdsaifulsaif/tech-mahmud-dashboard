// import { baseApi } from "./baseApi";

// export const productApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // getProducts: builder.query({
//     //   query: (params) => ({
//     //     url: "/products",
//     //     params,
//     //   }),
//     //   providesTags: ["Products"],
//     // }),
//     getProducts: builder.query({
//       query: (params) => ({
//         url: "/products",
//         params, // এখানে আপনার ফিল্টার, সার্চ, পেজিনেশন সব প্যারামস যাবে
//       }),
//       // আপডেট: লিস্টের আইডিগুলো ট্র্যাক করার জন্য ট্যাগ
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.data.map(({ _id }: any) => ({
//                 type: "Products" as const,
//                 id: _id,
//               })),
//               "Products",
//             ]
//           : ["Products"],
//     }),
//     getProductById: builder.query({
//       query: (id) => `/products/${id}`,
//       providesTags: (result, error, id) => [{ type: "Products", id }],
//     }),
//     getProductStats: builder.query({
//       query: () => "/products/admin/stats",
//       providesTags: ["Products"],
//     }),
//     createProduct: builder.mutation({
//       query: (data) => ({
//         url: "/products/create-product",
//         method: "POST",
//         body: data,
//         formData: true,
//       }),
//       invalidatesTags: ["Products"],
//     }),
//     updateProduct: builder.mutation({
//       query: ({ id, data }) => ({
//         url: `/products/${id}`,
//         method: "PATCH",
//         body: data,
//         formData: true,
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         "Products",
//         { type: "Products", id },
//       ],
//     }),
//     deleteProduct: builder.mutation({
//       query: (id) => ({
//         url: `/products/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Products"],
//     }),
//     updateStock: builder.mutation({
//       query: ({ id, quantity }) => ({
//         url: `/products/${id}/stock`,
//         method: "PATCH",
//         body: { quantity },
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         "Products",
//         { type: "Products", id },
//       ],
//     }),
//     bulkUpdateStatus: builder.mutation({
//       query: (data) => ({
//         url: "/products/admin/bulk-status",
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: ["Products"],
//     }),
//     bulkDelete: builder.mutation({
//       query: (data) => ({
//         url: "/products/admin/bulk-delete",
//         method: "DELETE",
//         body: data,
//       }),
//       invalidatesTags: ["Products"],
//     }),
//   }),
// });

// export const {
//   useGetProductsQuery,
//   useGetProductByIdQuery,
//   useGetProductStatsQuery,
//   useCreateProductMutation,
//   useUpdateProductMutation,
//   useDeleteProductMutation,
//   useUpdateStockMutation,
//   useBulkUpdateStatusMutation,
//   useBulkDeleteMutation,
// } = productApi;



import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // getProducts: builder.query({
    //   query: (params) => ({
    //     url: "/products",
    //     params,
    //   }),
    //   providesTags: ["Products"],
    // }),
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params, // এখানে আপনার ফিল্টার, সার্চ, পেজিনেশন সব প্যারামস যাবে
      }),
      // আপডেট: লিস্টের আইডিগুলো ট্র্যাক করার জন্য ট্যাগ
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }: any) => ({
                type: "Products" as const,
                id: _id,
              })),
              "Products",
            ]
          : ["Products"],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    getProductStats: builder.query({
      query: () => "/products/admin/stats",
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products/create-product",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Products",
        { type: "Products", id },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    updateStock: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/products/${id}/stock`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Products",
        { type: "Products", id },
      ],
    }),
    bulkUpdateStatus: builder.mutation({
      query: (data) => ({
        url: "/products/admin/bulk-status",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    bulkDelete: builder.mutation({
      query: (data) => ({
        url: "/products/admin/bulk-delete",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductStatsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateStockMutation,
  useBulkUpdateStatusMutation,
  useBulkDeleteMutation,
} = productApi;