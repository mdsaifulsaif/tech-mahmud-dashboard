import { baseApi } from "./baseApi";

export interface SubscriberItem {
  _id: string;
  email: string;
  status: "active" | "unsubscribed";
  createdAt: string;
  updatedAt: string;
}

export interface SubscriberStats {
  total: number;
  active: number;
  unsubscribed: number;
  newThisMonth: number;
}

export const subscriberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscribers: builder.query<{
      success: boolean;
      message: string;
      meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
        totalPages?: number;
      };
      data: SubscriberItem[];
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
        url: "/subscribers",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Subscribers"],
    }),

    getSubscriberStats: builder.query<{
      success: boolean;
      message: string;
      data: SubscriberStats;
    }, void>({
      query: () => ({
        url: "/subscribers/stats",
        method: "GET",
      }),
      providesTags: ["Subscribers"],
    }),

    toggleSubscriberStatus: builder.mutation<
      { success: boolean; message: string; data: SubscriberItem },
      { id: string; status?: "active" | "unsubscribed" }
    >({
      query: ({ id, status }) => ({
        url: `/subscribers/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Subscribers"],
    }),

    deleteSubscriber: builder.mutation<
      { success: boolean; message: string; data: any },
      string
    >({
      query: (id) => ({
        url: `/subscribers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscribers"],
    }),
  }),
});

export const {
  useGetSubscribersQuery,
  useGetSubscriberStatsQuery,
  useToggleSubscriberStatusMutation,
  useDeleteSubscriberMutation,
} = subscriberApi;
