import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const storeSettingApi = createApi({
  reducerPath: 'storeSettingApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api' // আপনার API-এর বেস ইউআরএল
  }),
  tagTypes: ['StoreSetting'],
  endpoints: (builder) => ({
    // সেটিংস ফেচ করা
    getStoreSettings: builder.query<any, void>({
      query: () => '/settings',
      providesTags: ['StoreSetting'],
    }),
    // সেটিংস আপডেট করা (PATCH)
    updateStoreSettings: builder.mutation<any, Partial<any>>({
      query: (data) => ({
        url: '/settings',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['StoreSetting'],
    }),
  }),
});

export const { 
  useGetStoreSettingsQuery, 
  useUpdateStoreSettingsMutation 
} = storeSettingApi;