import { baseApi } from "./baseApi";

export interface SubscriptionPaymentRecord {
  _id: string;
  cycleNumber: number;
  billingMonth: string;
  dueDate: string;
  amount: number;
  paymentStatus: "paid" | "unpaid" | "pending";
  paidAt?: string;
  paymentMethod?: string;
  deliveryDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionItem {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  area?: string;
  deliveryInstructions?: string;

  productID: {
    _id: string;
    name: string;
    thumbnail: string;
    regularPrice: number;
    salePrice?: number;
  } | string;
  productName: string;
  productThumbnail?: string;
  variantName?: string;
  quantity: number;

  regularPrice: number;
  discountedPrice: number;
  deliveryFee: number;
  totalPerDelivery: number;

  frequency: "weekly" | "monthly" | "bi-weekly";
  preferredDeliveryDay?: string;
  startDate: string;
  nextDeliveryDate: string;
  lastDeliveryDate?: string;
  deliveriesCompleted: number;

  paymentPreference: "cod" | "bkash" | "nagad";
  status: "active" | "paused" | "cancelled" | "completed";

  payments?: SubscriptionPaymentRecord[];

  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}


export interface SubscriptionStats {
  total: number;
  active: number;
  paused: number;
  cancelled: number;
  dueThisWeek: number;
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptions: builder.query<
      { success: boolean; meta: any; data: SubscriptionItem[] },
      Record<string, any>
    >({
      query: (params) => ({
        url: "/subscriptions",
        method: "GET",
        params,
      }),
      providesTags: ["Subscriptions"],
    }),

    getSubscriptionStats: builder.query<{ success: boolean; data: SubscriptionStats }, void>({
      query: () => ({
        url: "/subscriptions/stats",
        method: "GET",
      }),
      providesTags: ["Subscriptions"],
    }),

    getSubscriptionById: builder.query<{ success: boolean; data: SubscriptionItem }, string>({
      query: (id) => ({
        url: `/subscriptions/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Subscriptions", id }],
    }),

    toggleSubscriptionStatus: builder.mutation<
      any,
      { id: string; status: "active" | "paused" | "cancelled" }
    >({
      query: ({ id, status }) => ({
        url: `/subscriptions/${id}/toggle-status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Subscriptions"],
    }),

    updateSubscription: builder.mutation<any, { id: string; data: Partial<SubscriptionItem> }>({
      query: ({ id, data }) => ({
        url: `/subscriptions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Subscriptions"],
    }),

    deleteSubscription: builder.mutation<any, string>({
      query: (id) => ({
        url: `/subscriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscriptions"],
    }),

    updateSubscriptionPaymentStatus: builder.mutation<
      any,
      {
        id: string;
        paymentId: string;
        status: "paid" | "unpaid" | "pending";
        paidAt?: string;
        notes?: string;
        paymentMethod?: string;
      }
    >({
      query: ({ id, paymentId, ...body }) => ({
        url: `/subscriptions/${id}/payments/${paymentId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Subscriptions"],
    }),

    addSubscriptionPaymentRecord: builder.mutation<
      any,
      {
        id: string;
        billingMonth: string;
        dueDate: string;
        amount: number;
        paymentStatus?: "paid" | "unpaid" | "pending";
        notes?: string;
        paymentMethod?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/subscriptions/${id}/payments`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscriptions"],
    }),

    // --- Subscription Packages Endpoints ---

    getSubscriptionPackages: builder.query<
      { success: boolean; meta: any; data: SubscriptionPackageItem[] },
      Record<string, any>
    >({
      query: (params) => ({
        url: "/subscription-packages",
        method: "GET",
        params,
      }),
      providesTags: ["SubscriptionPackages"],
    }),

    getSubscriptionPackageById: builder.query<
      { success: boolean; data: SubscriptionPackageItem },
      string
    >({
      query: (idOrSlug) => ({
        url: `/subscription-packages/${idOrSlug}`,
        method: "GET",
      }),
      providesTags: (_res, _err, idOrSlug) => [{ type: "SubscriptionPackages", id: idOrSlug }],
    }),

    createSubscriptionPackage: builder.mutation<
      any,
      Partial<SubscriptionPackageItem>
    >({
      query: (body) => ({
        url: "/subscription-packages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SubscriptionPackages"],
    }),

    updateSubscriptionPackage: builder.mutation<
      any,
      { id: string; data: Partial<SubscriptionPackageItem> }
    >({
      query: ({ id, data }) => ({
        url: `/subscription-packages/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SubscriptionPackages"],
    }),

    deleteSubscriptionPackage: builder.mutation<any, string>({
      query: (id) => ({
        url: `/subscription-packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubscriptionPackages"],
    }),

    togglePinnedPackage: builder.mutation<any, string>({
      query: (id) => ({
        url: `/subscription-packages/${id}/toggle-pinned`,
        method: "PATCH",
      }),
      invalidatesTags: ["SubscriptionPackages"],
    }),

    uploadPackageImage: builder.mutation<
      { success: boolean; data: { url: string; public_id: string } },
      FormData
    >({
      query: (formData) => ({
        url: "/subscription-packages/upload-image",
        method: "POST",
        body: formData,
      }),
    }),

    getPackageCategories: builder.query<{ success: boolean; data: string[] }, void>({
      query: () => ({
        url: "/subscription-packages/categories",
        method: "GET",
      }),
      providesTags: ["SubscriptionPackages"],
    }),
  }),
});

export interface SubscriptionPackageItem {
  _id: string;
  name: string;
  slug: string;
  boxType: string;
  category?: string;
  frequency: "weekly" | "monthly" | "both";
  frequencyText?: string;
  badge?: string;
  shortDescription?: string;
  description?: string;
  thumbnail: string;
  images?: string[];
  regularPrice: number;
  subscriptionPrice: number;
  salePrice?: number;
  discountPercent?: number;
  freeShipping: boolean;
  items: Array<{ itemName: string; quantity?: string; note?: string }>;
  idealFor?: string;
  isPinnedToHome: boolean;
  sortOrder: number;
  status: "active" | "inactive";
  allowOneTimePurchase: boolean;
  sku?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const {
  useGetSubscriptionsQuery,
  useGetSubscriptionStatsQuery,
  useGetSubscriptionByIdQuery,
  useToggleSubscriptionStatusMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useUpdateSubscriptionPaymentStatusMutation,
  useAddSubscriptionPaymentRecordMutation,
  useGetSubscriptionPackagesQuery,
  useGetSubscriptionPackageByIdQuery,
  useCreateSubscriptionPackageMutation,
  useUpdateSubscriptionPackageMutation,
  useDeleteSubscriptionPackageMutation,
  useTogglePinnedPackageMutation,
  useUploadPackageImageMutation,
  useGetPackageCategoriesQuery,
} = subscriptionApi;


