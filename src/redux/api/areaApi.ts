// src/redux/api/areaApi.ts
import { baseApi } from "./baseApi";

const areaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAreas: builder.query({
      query: (args = {}) => ({
        url: "/area",
        method: "GET",
        params: args,
      }),
      providesTags: ["Area"],
    }),

    getSingleArea: builder.query({
      query: (id) => ({
        url: `/area/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Area", id }],
    }),

    createArea: builder.mutation({
      query: (data) => ({
        url: "/area/admin/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Area"],
    }),

    updateArea: builder.mutation({
      query: ({ id, data }) => ({
        url: `/area/admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Area"],
    }),

    deleteArea: builder.mutation({
      query: (id) => ({
        url: `/area/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Area"],
    }),
  }),
});

export const {
  useGetAllAreasQuery,
  useGetSingleAreaQuery,
  useCreateAreaMutation,
  useUpdateAreaMutation,
  useDeleteAreaMutation,
} = areaApi;