import type {
  StatsOverviewResponse,
  StatsOverviewData,
  GetRidesArgs,
  GetRidesResult,
  RidesListResponse,
  RideDetailResponse,
  RideDetail,
} from "../../types/ridestypes";
import { baseApi } from "../baseApi";

export const ridesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── 1. Stats ──────────────────────────────────────────────────────────────
    getRidesStats: builder.query<StatsOverviewData, void>({
      query: () => ({
        url: "/admin/rides/stats",
        method: "GET",
      }),
      transformResponse: (response: StatsOverviewResponse): StatsOverviewData =>
        response.data,
      providesTags: [{ type: "Ride" as const, id: "STATS" }],
    }),

    // ── 2. Rides List ─────────────────────────────────────────────────────────
    getRides: builder.query<GetRidesResult, GetRidesArgs>({
      query: ({ page, limit = 5, searchTerm }) => {
        const params: Record<string, string | number> = { page, limit };
        if (searchTerm && searchTerm.trim()) {
          params.searchTerm = searchTerm.trim();
        }
        return {
          url: "/admin/rides/all",
          method: "GET",
          params,
        };
      },
      transformResponse: (response: RidesListResponse): GetRidesResult => ({
        meta: response.meta,
        data: response.data || [],
      }),
      serializeQueryArgs: ({ queryArgs }) => ({
        page: queryArgs.page,
        limit: queryArgs.limit ?? 5,
        searchTerm: queryArgs.searchTerm ?? "",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((item) => ({
                type: "Ride" as const,
                id: item.rideId,
              })),
              { type: "Ride" as const, id: "LIST" },
            ]
          : [{ type: "Ride" as const, id: "LIST" }],
    }),

    // ── 3. Ride Details ───────────────────────────────────────────────────────
    getRideDetails: builder.query<RideDetail, string>({
      query: (rideId) => ({
        url: `/admin/rides/details/${rideId}`,
        method: "GET",
      }),
      transformResponse: (response: RideDetailResponse): RideDetail =>
        response.data,
      providesTags: (_result, _error, rideId) => [
        { type: "Ride" as const, id: rideId },
      ],
    }),
  }),
});

export const {
  useGetRidesStatsQuery,
  useGetRidesQuery,
  useGetRideDetailsQuery,
} = ridesApi;
