export type TReport = {
  id: string;
  tripId: string;
  status: "pending" | "resolved";
  createdAt: string;
  reporterName: string;
  reporterAvatar: string;
  reportedName: string;
  reportedAvatar: string;
};

// ─── Report Detail (from GET /admin/reports/:reportId) ────────────────────────
export type TReportDetail = {
  id: string;
  tripId: string;
  status: "pending" | "resolved";
  reportReason: string;
  createdAt: string;
  reporterName: string;
  reporterEmail: string;
  reporterPhone: string;
  reporterAvatar: string;
  reportedName: string;
  reportedEmail: string;
  reportedPhone: string;
  reportedAvatar: string;
};

// ─── Pagination Meta ──────────────────────────────────────────────────────────
export type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// ─── API Response Wrappers ────────────────────────────────────────────────────
export type TReportListResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    meta: TMeta;
    data: TReport[];
  };
};

export type TReportDetailResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: TReportDetail;
};

export type TUpdateStatusPayload = {
  status: "pending" | "resolved";
};

export type TUpdateStatusResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    _id: string;
    tripId: string;
    reporterId: string;
    reportedId: string;
    reportBy: string;
    status: "pending" | "resolved";
    reportReason: string;
    createdAt: string;
    updatedAt: string;
  };
};
