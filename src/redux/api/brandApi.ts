import { baseApi } from "./baseApi";

export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // সব ব্র্যান্ড আনা (সার্চ ও পেজিনেশনসহ)
    getBrands: builder.query({
      query: (params) => ({
        url: "/brands",
        params,
      }),
      providesTags: ["Brands"],
    }),

    // নির্দিষ্ট ব্র্যান্ড আনা
    getBrandById: builder.query({
      query: (id) => `/brands/${id}`,
      providesTags: (result, error, id) => [{ type: "Brands", id }],
    }),

    // ব্র্যান্ড তৈরি করা
    createBrand: builder.mutation({
      query: (data) => ({
        url: "/brands/create-brand",
        method: "POST",
        body: data,
        // ফাইল আপলোডের জন্য FormData পাঠালে কন্টেন্ট টাইপ অটো সেট হবে
      }),
      invalidatesTags: ["Brands"],
    }),

    // ব্র্যান্ড আপডেট করা
    // ব্র্যান্ড আপডেট করা
    // ব্র্যান্ড আপডেট করা
    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/brands/${id}`,
        method: "PATCH",
        body: data,
        formData: true ,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Brands",
        { type: "Brands", id },
      ],
    }),

    // ব্র্যান্ড ডিলিট করা
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brands"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
