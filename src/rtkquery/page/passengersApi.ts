import type {
  Passenger,
  PassengerStats,
  PaginationMeta,
  ApiResponse,
  PassengersListResponse,
} from "../../types/passengertype";
import { baseApi } from "../baseApi";

// ─── Query Argument Types ─────────────────────────────────────────────────────

export interface GetPassengersArgs {
  page: number;
  limit?: number;
  searchTerm?: string;
}

export interface ChangePassengerStatusArgs {
  userId: string;
  status: boolean;
}

// ─── Response Types ───────────────────────────────────────────────────────────

export interface GetPassengersResult {
  meta: PaginationMeta;
  data: Passenger[]; // ✅ FIXED
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const passengersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPassengers: builder.query<GetPassengersResult, GetPassengersArgs>({
      query: ({ page, limit = 10, searchTerm }) => {
        const params: Record<string, string | number> = { page, limit };

        if (searchTerm && searchTerm.trim()) {
          params.searchTerm = searchTerm.trim();
        }

        return {
          url: "/admin/passengers",
          method: "GET",
          params,
        };
      },

      transformResponse: (
        response: ApiResponse<PassengersListResponse>,
      ): GetPassengersResult => {
        console.log("RAW response:", response);

        return {
          meta: response.data?.meta,
          data:
            response.data?.data ??
            (Array.isArray(response.data) ? response.data : []),
        };
      },

      serializeQueryArgs: ({ queryArgs }) => ({
        page: queryArgs.page,
        limit: queryArgs.limit,
        searchTerm: queryArgs.searchTerm ?? "",
      }),

      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map((item) => ({
                type: "Passenger" as const,
                id: item.userId,
              })),
              { type: "Passenger" as const, id: "LIST" },
            ]
          : [{ type: "Passenger" as const, id: "LIST" }],
    }),

    getPassengerStats: builder.query<PassengerStats, void>({
      query: () => ({
        url: "/admin/passengers/stats",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<PassengerStats>) =>
        response.data,
      providesTags: [{ type: "Passenger" as const, id: "STATS" }],
    }),

    changePassengerStatus: builder.mutation<
      { isActive: boolean },
      ChangePassengerStatusArgs
    >({
      query: ({ userId, status }) => ({
        url: `/admin/passengers/change-status/${userId}`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: ApiResponse<{ isActive: boolean }>) =>
        response.data,
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "Passenger" as const, id: userId },
        { type: "Passenger" as const, id: "LIST" },
        { type: "Passenger" as const, id: "STATS" },
      ],
    }),
  }),
});

export const {
  useGetPassengersQuery,
  useGetPassengerStatsQuery,
  useChangePassengerStatusMutation,
} = passengersApi;
