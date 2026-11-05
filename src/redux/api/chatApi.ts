import { baseApi } from "./baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all chat conversations for Admin
    getAdminConversations: builder.query({
      query: (params) => ({
        url: "/chat/admin/conversations",
        method: "GET",
        params,
      }),
      providesTags: ["Chat"],
    }),

    // Get single conversation details & messages
    getAdminConversationDetails: builder.query({
      query: (id: string) => ({
        url: `/chat/admin/conversations/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Chat", id }],
    }),

    // Admin replies to customer
    adminReply: builder.mutation({
      query: (body: { conversationId: string; text: string }) => ({
        url: "/chat/admin/reply",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        "Chat",
        { type: "Chat", id: conversationId },
      ],
    }),
  }),
});

export const {
  useGetAdminConversationsQuery,
  useGetAdminConversationDetailsQuery,
  useAdminReplyMutation,
} = chatApi;
