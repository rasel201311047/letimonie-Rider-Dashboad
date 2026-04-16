import type {
  SendNotificationPayload,
  SendNotificationResponse,
  SearchUsersResponse,
  UnseenCountResponse,
  MarkAsReadResponse,
  GetNotificationsResponse,
} from "../../types/notificationtype";
import { baseApi } from "../baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendNotification: builder.mutation<
      SendNotificationResponse,
      SendNotificationPayload
    >({
      query: (payload) => ({
        url: "/admin/notifications/send",
        method: "POST",
        body: payload,
      }),
    }),

    searchUsers: builder.query<SearchUsersResponse, string>({
      query: (searchTerm) =>
        `/admin/search/users?searchTerm=${encodeURIComponent(searchTerm)}`,
    }),

    getNotifications: builder.query<
      GetNotificationsResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/notifications/get?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    markAsRead: builder.mutation<MarkAsReadResponse, string>({
      query: (notificationId) => ({
        url: `/notifications/mark/${notificationId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    getUnseenCount: builder.query<UnseenCountResponse, void>({
      query: () => ({
        url: "/notifications/unseen-count",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),
  }),
});

export const {
  useSendNotificationMutation,
  useSearchUsersQuery,
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useGetUnseenCountQuery,
} = notificationApi;
