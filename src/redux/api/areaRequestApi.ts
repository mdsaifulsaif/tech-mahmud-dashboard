import { baseApi } from "./baseApi";

export type AreaRequestStatus = "pending" | "reviewed" | "approved" | "rejected";

export interface AreaRequestItem {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  areaName: string;
  city?: string;
  district?: string;
  notes?: string;
  status: AreaRequestStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AreaRequestStats {
  total: number;
  pending: number;
  reviewed: number;
  approved: number;
  rejected: number;
}

export const areaRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAreaRequests: builder.query<{
      success: boolean;
      message: string;
      meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
        totalPages?: number;
      };
      data: AreaRequestItem[];
    }, {
      page?: number;
      limit?: number;
      search?: string;
      searchTerm?: string;
      status?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } | void>({
      query: (params) => ({
        url: "/area-requests",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["AreaRequests"],
    }),

    getAreaRequestStats: builder.query<{
      success: boolean;
      message: string;
      data: AreaRequestStats;
    }, void>({
      query: () => ({
        url: "/area-requests/stats",
        method: "GET",
      }),
      providesTags: ["AreaRequests"],
    }),

    updateAreaRequestStatus: builder.mutation<
      { success: boolean; message: string; data: AreaRequestItem },
      { id: string; status?: AreaRequestStatus; adminNotes?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/area-requests/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AreaRequests"],
    }),

    deleteAreaRequest: builder.mutation<
      { success: boolean; message: string; data: any },
      string
    >({
      query: (id) => ({
        url: `/area-requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AreaRequests"],
    }),
  }),
});

export const {
  useGetAreaRequestsQuery,
  useGetAreaRequestStatsQuery,
  useUpdateAreaRequestStatusMutation,
  useDeleteAreaRequestMutation,
} = areaRequestApi;
