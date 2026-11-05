// import { baseApi } from "./baseApi";

// const authApi = baseApi.injectEndpoints({
//   endpoints: (builder: any) => ({
//     // ==================== AUTH ====================
//     registerUser: builder.mutation({
//       query: (data: any) => ({
//         url: "/auth/register",
//         method: "POST",
//         body: data,
//       }),
//     }),

//     loginUser: builder.mutation({
//       query: (data: any) => ({
//         url: "/auth/login",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["User"],
//     }),

//     logoutUser: builder.mutation({
//       query: () => ({
//         url: "/auth/logout",
//         method: "POST",
//       }),
//     }),

//     // ==================== PROFILE ====================
//     getMe: builder.query({
//       query: () => ({
//         url: "/auth/get-me",
//         method: "GET",
//       }),
//       providesTags: ["User"],
//     }),

//     updateProfile: builder.mutation({
//       query: (data: any) => {
//         // FormData হলে স্পেশাল হ্যান্ডেলিং
//         return {
//           url: "/auth/update-profile",
//           method: "PATCH",
//           body: data,
//         };
//       },
//       invalidatesTags: ["User"],
//     }),
//   }),
// });

// export const {
//   useRegisterUserMutation,
//   useLoginUserMutation,
//   useLogoutUserMutation,
//   useGetMeQuery,
//   useUpdateProfileMutation,
// } = authApi;



import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Register ----------
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    // ---------- Login ----------
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // ---------- Google Login ----------
    googleLogin: builder.mutation({
      query: (googleData) => ({
        url: "/auth/google-login",
        method: "POST",
        body: googleData,
      }),
      invalidatesTags: ["User"],
    }),

    // ---------- Logout ----------
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // ---------- Verify Email ----------
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: `/auth/verify-email/${token}`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // ---------- Resend Verification Email ----------
    resendVerification: builder.mutation({
      query: (email) => ({
        url: "/auth/resend-verification",
        method: "POST",
        body: { email },
      }),
    }),

    // ---------- Forgot Password ----------
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    // ---------- Reset Password ----------
    resetPassword: builder.mutation({
      query: ({ token, newPassword }: { token: string; newPassword: string }) => ({
        url: `/auth/reset-password/${token}`,
        method: "POST",
        body: { newPassword },
      }),
    }),

    // ---------- Refresh Access Token ----------
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),

    // ---------- Get Me ----------
    getMe: builder.query({
      query: () => ({
        url: "/auth/get-me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // ---------- Update Profile ----------
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/auth/update-profile",
        method: "PATCH",
        body: formData, // FormData object পাঠাবে (avatar file সহ)
      }),
      invalidatesTags: ["User"],
    }),
    searchUsers: builder.query({
      query: (searchQuery: string) => ({
        url: `/auth/search?query=${encodeURIComponent(searchQuery)}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useSearchUsersQuery
} = authApi;