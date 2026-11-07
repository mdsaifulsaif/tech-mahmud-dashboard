import { baseApi } from './baseApi';

export const storeSettingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStoreSettings: builder.query<any, void>({
      query: () => '/settings',
      providesTags: ['StoreSetting'],
    }),
    updateStoreSettings: builder.mutation<any, FormData | any>({
      query: (data) => ({
        url: '/settings/update',
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
