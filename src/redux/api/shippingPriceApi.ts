// src/redux/api/shippingApi.ts
import { baseApi } from "./baseApi";

const shippingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public - Checkout এ shipping price দেখানোর জন্য
    getShippingConfigByType: builder.query({
      query: (type: "local" | "nationwide") => ({
        url: `/shipping/${type}`,
        method: "GET",
      }),
      providesTags: (result, error, type) => [{ type: "Shipping", id: type }],
    }),

    // Admin - সব কনফিগ দেখার জন্য
    getAllShippingConfigs: builder.query({
      query: () => ({
        url: "/shipping/admin/all",
        method: "GET",
      }),
      providesTags: ["Shipping"],
    }),

    // Admin - Update
    updateShippingConfig: builder.mutation({
      query: (data) => ({
        url: "/shipping/admin/update",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Shipping"],
    }),

    // Admin - Delete
    deleteShippingConfig: builder.mutation({
      query: (type: "local" | "nationwide") => ({
        url: `/shipping/admin/${type}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Shipping"],
    }),
  }),
});

export const {
  useGetShippingConfigByTypeQuery,
  useGetAllShippingConfigsQuery,
  useUpdateShippingConfigMutation,
  useDeleteShippingConfigMutation,
} = shippingApi;