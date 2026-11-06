import { baseApi } from "./baseApi";

export interface IBanner {
  _id: string;
  title?: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  categoryID?: any;
  categorySlug?: string;
  placement?:
    | "slider"
    | "side_top"
    | "side_middle"
    | "side_bottom"
    | "festive_1"
    | "festive_2"
    | "festive_3"
    | "promotional"
    | "promotional_2"
    | "promo_2_slot"
    | "promo_left"
    | "promo_right_top"
    | "promo_right_bottom"
    | "bottom_promo"
    | "popup"
    | string;
  slot?:
    | "left"
    | "right_top"
    | "right_bottom"
    | "slot_1"
    | "slot_2"
    | "bottom_row1_full"
    | "bottom_row2_col1"
    | "bottom_row2_col2"
    | "bottom_row2_col3"
    | string;
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
    }, { placement?: string } | void>({
      query: (params) => ({
        url: "/banners/admin",
        method: "GET",
        params: params || {},
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
