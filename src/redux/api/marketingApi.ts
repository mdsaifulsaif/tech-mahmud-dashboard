import { baseApi } from "./baseApi";

export interface IMarketingSettingsResponse {
  meta: {
    isEnabled: boolean;
    pixelId: string;
    accessToken: string;
    testEventCode?: string;
  };
  gtm: {
    isEnabled: boolean;
    containerId: string;
  };
  ga4: {
    isEnabled: boolean;
    measurementId: string;
    apiSecret: string;
  };
  tiktok: {
    isEnabled: boolean;
    pixelCode: string;
    accessToken: string;
  };
  _id?: string;
  updatedAt?: string;
}

export interface ITrackingLog {
  _id: string;
  eventId: string;
  eventName: string;
  orderId?: string;
  userIdentifier?: string;
  providers: {
    provider: "facebook" | "tiktok" | "ga4";
    success: boolean;
    statusCode?: number;
    error?: string;
    sentAt: string;
  }[];
  rawPayload?: any;
  createdAt: string;
}

export const marketingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMarketingSettings: builder.query<{ success: boolean; data: IMarketingSettingsResponse }, void>({
      query: () => ({
        url: "/settings/marketing",
        method: "GET",
      }),
      providesTags: ["MarketingSetting"],
    }),

    updateMarketingSettings: builder.mutation<
      { success: boolean; message: string; data: IMarketingSettingsResponse },
      Partial<IMarketingSettingsResponse>
    >({
      query: (body) => ({
        url: "/settings/marketing",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["MarketingSetting"],
    }),

    getTrackingLogs: builder.query<{ success: boolean; data: ITrackingLog[] }, number | void>({
      query: (limit = 30) => ({
        url: `/tracking/events?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["TrackingLogs"],
    }),

    testTrackingEvent: builder.mutation<{ success: boolean; message: string; providers: any[] }, { eventName?: string }>({
      query: (body) => ({
        url: "/tracking/test",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TrackingLogs"],
    }),
  }),
});

export const {
  useGetMarketingSettingsQuery,
  useUpdateMarketingSettingsMutation,
  useGetTrackingLogsQuery,
  useTestTrackingEventMutation,
} = marketingApi;
