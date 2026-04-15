import type {
  GetActivitiesResponse,
  GetSubscriptionRequestsResponse,
  GetUserSubscriptionDetailResponse,
  ChangeStatusPayload,
  ChangeStatusResponse,
} from "../../types/subcriptiontype";
import { baseApi } from "../baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /admin/user/subscription/get-activities
    getSubscriptionActivities: builder.query<GetActivitiesResponse, void>({
      query: () => ({
        url: "/admin/user/subscription/get-activities",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),

    // GET /admin/user/subscription  (paginated list of pending requests)
    getSubscriptionRequests: builder.query<
      GetSubscriptionRequestsResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/admin/user/subscription",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Subscription"],
    }),

    // GET /admin/user/subscription/details/:userId
    getUserSubscriptionDetail: builder.query<
      GetUserSubscriptionDetailResponse,
      string
    >({
      query: (userId) => ({
        url: `/admin/user/subscription/details/${userId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, userId) => [
        { type: "Subscription", id: userId },
      ],
    }),

    // PATCH /admin/user/subscription/change-status/:userId
    changeSubscriptionStatus: builder.mutation<
      ChangeStatusResponse,
      { userId: string; body: ChangeStatusPayload }
    >({
      query: ({ userId, body }) => ({
        url: `/admin/user/subscription/change-status/${userId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetSubscriptionActivitiesQuery,
  useGetSubscriptionRequestsQuery,
  useGetUserSubscriptionDetailQuery,
  useChangeSubscriptionStatusMutation,
} = subscriptionApi;
