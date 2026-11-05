import { baseApi } from "./baseApi";

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  searchTerm?: string;
  status?: string;
  isVerified?: string | boolean;
  role?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CustomerStats {
  totalCustomers: number;
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  newThisMonth: number;
}

export interface CustomerAddress {
  label?: string;
  houseNo?: string;
  road?: string;
  block?: string;
  area?: any;
  city?: string;
  district?: string;
  upazila?: string;
  postalCode?: string;
  deliveryNotes?: string;
}

export interface CustomerItem {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  role: string;
  status: "active" | "blocked" | "pending";
  isVerified: boolean;
  avatar?: string;
  shippingAddress?: CustomerAddress;
  addresses?: CustomerAddress[];
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SingleCustomerResponse extends CustomerItem {
  orders: any[];
}

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<{
      success: boolean;
      message: string;
      meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
        totalPages?: number;
      };
      stats?: CustomerStats;
      data: CustomerItem[];
    }, CustomerQueryParams | void>({
      query: (params) => ({
        url: "/customers",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Customers"],
    }),

    getCustomerStats: builder.query<{
      success: boolean;
      message: string;
      data: CustomerStats;
    }, void>({
      query: () => ({
        url: "/customers/stats",
        method: "GET",
      }),
      providesTags: ["Customers"],
    }),

    getCustomerById: builder.query<{
      success: boolean;
      message: string;
      data: SingleCustomerResponse;
    }, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Customers", id }],
    }),

    toggleCustomerStatus: builder.mutation<
      { success: boolean; message: string; data: CustomerItem },
      { id: string; status: "active" | "blocked" }
    >({
      query: ({ id, status }) => ({
        url: `/customers/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Customers", "Users"],
    }),

    updateCustomer: builder.mutation<
      { success: boolean; message: string; data: CustomerItem },
      { id: string; data: Partial<CustomerItem> }
    >({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Customers", "Users"],
    }),

    deleteCustomer: builder.mutation<
      { success: boolean; message: string; data: any },
      string
    >({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers", "Users"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerStatsQuery,
  useGetCustomerByIdQuery,
  useToggleCustomerStatusMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
