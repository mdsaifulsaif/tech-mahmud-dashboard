import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Dashboard Stats
    getDashboardStats: builder.query({
      query: (range = "7days") => ({
        url: `/dashboard/stats`,
        method: "GET",
        params: { range }, // today, 7days, 30days, year
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
} = dashboardApi;