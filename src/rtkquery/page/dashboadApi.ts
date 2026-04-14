import type {
  ActiveRidesResponse,
  DashboardStatsResponse,
  RevenueAnalyticsResponse,
  TopOverviewResponse,
  UserGrowthResponse,
} from "../../types/dashboadtype";
import { baseApi } from "../baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserOverView: builder.query<TopOverviewResponse, void>({
      query: () => ({
        url: `/admin/overview/top`,
        method: "GET",
      }),
    }),

    getOverviewStats: builder.query<DashboardStatsResponse, void>({
      query: () => ({
        url: "/admin/overview/stats",
        method: "GET",
      }),
    }),

    getRevenueAnalytics: builder.query<RevenueAnalyticsResponse, number>({
      query: (year) => ({
        url: `/admin/overview/revenue-analytics?year=${year}`,
        method: "GET",
      }),
    }),

    getUserGrowth: builder.query<UserGrowthResponse, number>({
      query: (year) => ({
        url: `/admin/overview/user-growth?year=${year}`,
        method: "GET",
      }),
    }),

    getActiveRide: builder.query<ActiveRidesResponse, void>({
      query: () => ({
        url: `/admin/overview/recent-active-rides`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetOverviewStatsQuery,
  useGetRevenueAnalyticsQuery,
  useGetUserGrowthQuery,
  useGetActiveRideQuery,
  useGetUserOverViewQuery,
} = dashboardApi;
