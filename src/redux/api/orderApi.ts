// // orderApi.ts
// import { baseApi } from "./baseApi";

// export const orderApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({

//     getAdminOrders: builder.query({
//       query: (params) => {

//         const { page = 1, limit = 10, status, search, deliveryType } = params || {};

//         let url = `/order/admin/all?page=${page}&limit=${limit}`;

//         if (status && status !== 'all') {
//           url += `&status=${status}`;
//         }
//         if (search) {
//           url += `&search=${search}`;
//         }
//         if (deliveryType) {
//           url += `&deliveryType=${deliveryType}`;
//         }

//         return {
//           url: url,
//           method: "GET",
//         };
//       },
//       providesTags: ["Orders"],
//     }),

//     getOrderStats: builder.query({
//       query: () => ({
//         url: "/order/admin/stats",
//         method: "GET",
//       }),
//       providesTags: ["Orders"],
//     }),

//     getAdminOrderById: builder.query({
//       query: (id) => ({
//         url: `/order/admin/${id}`,
//         method: "GET",
//       }),
//       providesTags: ["Orders"],
//     }),

//     updateOrderStatus: builder.mutation({
//       query: ({ id, status }) => ({
//         url: `/order/admin/status/${id}`,
//         method: "PATCH",
//         body: { status },
//       }),
//       invalidatesTags: ["Orders"],
//     }),

//     updatePaymentStatus: builder.mutation({
//       query: ({ id, paymentStatus }) => ({
//         url: `/order/admin/${id}/payment`,
//         method: "PATCH",
//         body: { paymentStatus },
//       }),
//       invalidatesTags: ["Orders"],
//     }),

//     addAdminNote: builder.mutation({
//       query: ({ id, note }) => ({
//         url: `/order/admin/${id}/note`,
//         method: "PATCH",
//         body: { note },
//       }),
//       invalidatesTags: ["Orders"],
//     }),

//     createOrder: builder.mutation({
//       query: (data) => ({
//         url: "/order/place-order",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["Orders"],
//     }),

//     getMyOrders: builder.query({
//       query: (params) => ({
//         url: "/order/my-orders",
//         method: "GET",
//         params,
//       }),
//       providesTags: ["Orders"],
//     }),

//     getMyOrderById: builder.query({
//       query: (id) => ({
//         url: `/order/my-orders/${id}`,
//         method: "GET",
//       }),
//       providesTags: ["Orders"],
//     }),

//     cancelOrder: builder.mutation({
//       query: (id) => ({
//         url: `/order/cancel/${id}`,
//         method: "PATCH",
//       }),
//       invalidatesTags: ["Orders"],
//     }),

//   }),
// });

// export const {
//   // Admin hooks
//   useGetAdminOrdersQuery,
//   useGetOrderStatsQuery,
//   useGetAdminOrderByIdQuery,
//   useUpdateOrderStatusMutation,
//   useUpdatePaymentStatusMutation,
//   useAddAdminNoteMutation,

//   // User hooks
//   useCreateOrderMutation,
//   useGetMyOrdersQuery,
//   useGetMyOrderByIdQuery,
//   useCancelOrderMutation,
// } = orderApi;

// orderApi.ts
import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query({
      query: (params) => {
        const {
          page = 1,
          limit = 10,
          status,
          search,
          deliveryType,
        } = params || {};

        let url = `/order/admin/all?page=${page}&limit=${limit}`;

        if (status && status !== "all") {
          url += `&status=${status}`;
        }
        if (search) {
          url += `&search=${search}`;
        }
        if (deliveryType) {
          url += `&deliveryType=${deliveryType}`;
        }

        return {
          url: url,
          method: "GET",
        };
      },
      providesTags: ["Orders"],
    }),

    getOrderStats: builder.query({
      query: () => ({
        url: "/order/admin/stats",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    getAdminOrderById: builder.query({
      query: (id) => ({
        url: `/order/admin/details/${id}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/order/admin/status/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),

    updatePaymentStatus: builder.mutation({
      query: ({ id, paymentStatus }) => ({
        url: `/order/admin/${id}/payment`,
        method: "PATCH",
        body: { paymentStatus },
      }),
      invalidatesTags: ["Orders"],
    }),

    addAdminNote: builder.mutation({
      query: ({ id, note }) => ({
        url: `/order/admin/${id}/note`,
        method: "PATCH",
        body: { note },
      }),
      invalidatesTags: ["Orders"],
    }),

    createOrder: builder.mutation({
      query: (data) => ({
        url: "/order/place-order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),

    getMyOrders: builder.query({
      query: (params) => ({
        url: "/order/my-orders",
        method: "GET",
        params,
      }),
      providesTags: ["Orders"],
    }),

    getMyOrderById: builder.query({
      query: (id) => ({
        url: `/order/my-orders/${id}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/order/cancel/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ নতুন — Order Edit (customer নিজের order edit করতে পারবে, allowed status থাকলে)
    editOrderAdmin: builder.mutation({
      query: ({ id, payload }: { id: string; payload: any }) => ({
        url: `/order/admin/edit/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Orders"],
    }),
    createOrderAdmin: builder.mutation({
      query: (payload: any) => ({
        url: "/order/admin/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Orders"],
    }),
    updateCourierInfo: builder.mutation({
      query: ({ id, ...payload }: { id: string; courierName?: string; trackingCode?: string; consignmentId?: string }) => ({
        url: `/order/admin/${id}/courier`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  // Admin hooks
  useGetAdminOrdersQuery,
  useGetOrderStatsQuery,
  useGetAdminOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useAddAdminNoteMutation,
  useCreateOrderAdminMutation,
  useUpdateCourierInfoMutation,

  // User hooks
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetMyOrderByIdQuery,
  useCancelOrderMutation,
  useEditOrderAdminMutation,
} = orderApi;
