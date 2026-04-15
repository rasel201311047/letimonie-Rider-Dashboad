import type {
  TReportListResponse,
  TReportDetailResponse,
  TUpdateStatusPayload,
  TUpdateStatusResponse,
} from "../../types/reporttype";
import { baseApi } from "../baseApi";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ─── GET /admin/reports?page=&limit=&searchTerm= ──────────────────────────
    getAllReports: builder.query<
      TReportListResponse,
      { page?: number; limit?: number; searchTerm?: string }
    >({
      query: ({ page = 1, limit = 10, searchTerm = "" } = {}) => ({
        url: "/admin/reports",
        method: "GET",
        params: {
          page,
          limit,
          ...(searchTerm ? { searchTerm } : {}),
        },
      }),
      providesTags: ["Reports"],
    }),

    // ─── GET /admin/reports/:reportId ─────────────────────────────────────────
    getReportById: builder.query<TReportDetailResponse, string>({
      query: (reportId) => ({
        url: `/admin/reports/${reportId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Reports", id }],
    }),

    // ─── PATCH /admin/reports/update/:reportId ────────────────────────────────
    updateReportStatus: builder.mutation<
      TUpdateStatusResponse,
      { reportId: string; payload: TUpdateStatusPayload }
    >({
      query: ({ reportId, payload }) => ({
        url: `/admin/reports/update/${reportId}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { reportId }) => [
        "Reports",
        { type: "Reports", id: reportId },
      ],
    }),
  }),
});

export const {
  useGetAllReportsQuery,
  useGetReportByIdQuery,
  useUpdateReportStatusMutation,
} = reportApi;
