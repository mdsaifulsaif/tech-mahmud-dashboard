import { baseApi } from "./baseApi";

export interface IBanner {
  _id: string;
  title?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  placement?:
    | "slider"
    | "side_top"
    | "side_middle"
    | "side_bottom"
    | "festive_1"
    | "festive_2"
    | "festive_3"
    | "popup";
  order?: number;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminBanners: builder.query<{
      success: boolean;
      message: string;
      data: IBanner[];
    }, void>({
      query: () => ({
        url: "/banners/admin",
        method: "GET",
      }),
      providesTags: ["Banners"],
    }),
    createBanner: builder.mutation({
      query: (data) => ({
        url: "/banners",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Banners"],
    }),
    updateBanner: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `/banners/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Banners"],
    }),
    deleteBanner: builder.mutation({
      query: (id: string) => ({
        url: `/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banners"],
    }),
  }),
});

export const {
  useGetAdminBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
