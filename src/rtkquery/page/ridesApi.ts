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
      query: ({ page, searchTerm }) => {
        // ✅ Always send both page AND limit
        const params: Record<string, string | number> = {
          page,
        };
        if (searchTerm && searchTerm.trim()) {
          params.searchTerm = searchTerm.trim();
        }
        return {
          url: "/admin/rides/all",
          method: "GET",
          params,
        };
      },

      transformResponse: (response: RidesListResponse): GetRidesResult => {
        const data = response.data || [];

        // ✅ Only remove records where ALL fields are 100% identical
        // Using full JSON stringify so truly duplicate objects are collapsed
        // but records with even one different field (e.g. different createdAt) are kept
        const seen = new Set<string>();
        const uniqueData = data.filter((ride) => {
          const key = JSON.stringify(ride);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        return {
          meta: {
            ...response.meta,
            total: uniqueData.length,
          },
          data: uniqueData,
        };
      },

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
