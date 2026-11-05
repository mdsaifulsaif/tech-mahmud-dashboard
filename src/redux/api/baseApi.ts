import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { getSession, signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: async (headers) => {
    try {
      const session = await getSession();

      if (session?.accessToken) {
        headers.set("authorization", `Bearer ${session.accessToken}`);
      }
    } catch (error) {
      console.error("Session fetch error in RTK Query:", error);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.warn("🔒 [baseApi] 401 Unauthorized received. Checking session...");
    const session = await getSession();

    if (session?.accessToken && !(session as any).error) {
      // Retry with refreshed access token
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      if (typeof window !== "undefined") {
        console.error("🔴 [baseApi] Token expired or invalid. Redirecting to login...");
        signOut({ callbackUrl: "/login" });
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Stats",
    "Orders",
    "Products",
    "Users",
    "Analytics",
    "PageContent",
    "SiteContent",
    "Categories",
    "Payments",
    "Shipping",
    "Coupons",
    "Reviews",
    "Brands",
    "Complaints",
    "Area",
    "Rider",
    "RiderApplication",
    "User",
    "StoreSetting",
    "Riders",
    "RiderProfile",
    "Brand",
    "Dashboard",
    "Payout",
    "Customers",
    "AreaRequests",
    "Subscribers",
    "Banners",
    "Subscriptions",
    "SubscriptionPackages",
    "MarketingSetting",
    "TrackingLogs",
    "ThemeSetting",
    "Chat",
  ],
  endpoints: () => ({}),
});