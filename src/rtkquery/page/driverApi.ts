import type {
  GetDriversQueryArgs,
  GetDriversResponse,
  GetDriverDetailsResponse,
  GetDriverStatsResponse,
  ChangeStatusArgs,
  ChangeStatusResponse,
} from "../../types/divertype";
import { baseApi } from "../baseApi";

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** GET /admin/drivers?page=1&limit=10&searchTerm= */
    getDrivers: builder.query<GetDriversResponse, GetDriversQueryArgs>({
      query: ({ page, limit = 10, searchTerm = "" }) => ({
        url: "/admin/drivers",
        params: { page, limit, searchTerm },
      }),
      providesTags: ["Drivers"],
    }),

    /** GET /admin/drivers/stats */
    getDriverStats: builder.query<GetDriverStatsResponse, void>({
      query: () => "/admin/drivers/stats",
      providesTags: ["DriverStats"],
    }),

    /** GET /admin/drivers/details/:driverId */
    getDriverDetails: builder.query<GetDriverDetailsResponse, string>({
      query: (driverId) => `/admin/drivers/details/${driverId}`,
      providesTags: (_result, _error, driverId) => [
        { type: "DriverDetails", id: driverId },
      ],
    }),

    /**
     * PATCH /admin/drivers/change-status/:userId
     * Body: { status: true | false }
     * Rule:
     *   - Pending (null)  → can be set to Active (true) or Blocked (false)
     *   - Active  (true)  → can only be set to Blocked (false)
     *   - Blocked (false) → can only be set to Active (true)
     *   - Active/Blocked  → CANNOT be set back to Pending (null)
     */
    changeDriverStatus: builder.mutation<
      ChangeStatusResponse,
      ChangeStatusArgs
    >({
      query: ({ userId, status }) => ({
        url: `/admin/drivers/change-status/${userId}`,
        method: "PATCH",
        body: status,
      }),
      invalidatesTags: ["Drivers", "DriverStats"],
    }),
  }),
});

export const {
  useGetDriversQuery,
  useGetDriverStatsQuery,
  useGetDriverDetailsQuery,
  useChangeDriverStatusMutation,
} = driverApi;
