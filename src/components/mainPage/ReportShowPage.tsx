import { X } from "lucide-react";
import { useState, useEffect } from "react";

import type { TReport } from "../../types/reporttype";
import {
  useGetAllReportsQuery,
  useGetReportByIdQuery,
  useUpdateReportStatusMutation,
} from "../../rtkquery/page/reportApi";

const PAGE_SIZE = 10;

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({
  status,
  onChange,
}: {
  status: string;
  onChange?: (newStatus: string) => void;
}) => {
  const isPending = status === "pending";

  return onChange ? (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      disabled={status === "resolved"}
      className={`px-2 py-1 text-xs font-medium rounded-full border cursor-pointer ${
        isPending
          ? "border-yellow-300 bg-yellow-100 text-yellow-800"
          : "border-green-300 bg-green-100 text-green-800"
      }`}
    >
      <option value="pending">Pending</option>
      <option value="resolved">Resolved</option>
    </select>
  ) : (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
        isPending
          ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
          : "bg-green-100 text-green-800 border border-green-300"
      }`}
    >
      {status}
    </span>
  );
};

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="border-b border-gray-100 animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="py-4 px-6">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </td>
    ))}
  </tr>
);

// ─── Report Detail Modal ──────────────────────────────────────────────────────
const ReportDetailModal = ({
  reportId,
  onClose,
}: {
  reportId: string;
  onClose: () => void;
}) => {
  const { data, isLoading, isError } = useGetReportByIdQuery(reportId);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateReportStatusMutation();

  const report = data?.data;

  const handleStatusChange = async (newStatus: string) => {
    const response = await updateStatus({
      reportId,
      payload: { status: newStatus as "pending" | "resolved" },
    });
    console.log("==========================================================");
    console.log(response);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[440px] max-h-[85vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div />
          <h2 className="text-lg font-semibold text-gray-900">
            Report Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-sm text-gray-700">
          {isLoading && (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full" />
              ))}
            </div>
          )}

          {isError && (
            <p className="text-red-500 text-center">
              Failed to load report details.
            </p>
          )}

          {report && (
            <>
              {/* Reporter vs Reported */}
              <div className="grid grid-cols-2 gap-4">
                {/* Reporter */}
                <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center gap-2">
                  <img
                    src={report.reporterAvatar}
                    alt={report.reporterName}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(report.reporterName);
                    }}
                  />
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 mb-0.5">Reporter</p>
                    <p className="font-semibold text-gray-900 text-xs">
                      {report.reporterName}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {report.reporterEmail}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {report.reporterPhone}
                    </p>
                  </div>
                </div>

                {/* Reported */}
                <div className="bg-red-50 rounded-xl p-3 flex flex-col items-center gap-2">
                  <img
                    src={report.reportedAvatar}
                    alt={report.reportedName}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(report.reportedName);
                    }}
                  />
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 mb-0.5">Reported</p>
                    <p className="font-semibold text-gray-900 text-xs">
                      {report.reportedName}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {report.reportedEmail}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {report.reportedPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
                    Trip ID
                  </p>
                  <p className="font-medium text-gray-900 text-xs">
                    {report.tripId}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">
                    Reported At
                  </p>
                  <p className="font-medium text-gray-900 text-xs">
                    {report.createdAt}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Report Reason
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-700 leading-relaxed text-sm">
                  {report.reportReason}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between pt-1">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  Status
                </p>
                <div className="flex items-center gap-2">
                  {isUpdating && (
                    <span className="text-xs text-gray-400">Updating…</span>
                  )}
                  <StatusBadge
                    status={report.status}
                    onChange={handleStatusChange}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {/* {report && (
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button
              onClick={handleBlockUser}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
            >
              Block User
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReportShowPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Debounce search input — reset to page 1 on new search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, isFetching } = useGetAllReportsQuery({
    page,
    limit: PAGE_SIZE,
    searchTerm: debouncedSearch,
  });

  const reports: TReport[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h4 className="text-xl font-bold text-[#0F0B18]">Report Management</h4>
        <p className="text-[#4F4F59] mt-1 text-base">Manage Report accounts</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Table Header + Search */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Reports</h2>
          <input
            type="text"
            placeholder="Search by name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#053F53]/30 w-56"
          />
        </div>

        {/* Error */}
        {isError && (
          <p className="text-red-500 text-sm text-center py-6">
            Failed to load reports. Please try again.
          </p>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {[
                  "Reporter",
                  "Reported",
                  "Trip ID",
                  "Reported At",
                  "Status",
                  "Action",
                ].map((col) => (
                  <th
                    key={col}
                    className="py-3 px-6 text-left text-xs font-semibold text-gray-700"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading || isFetching
                ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                : reports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b border-gray-100 text-sm text-gray-800 hover:bg-gray-50 transition"
                    >
                      {/* Reporter */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <img
                            src={report.reporterAvatar}
                            alt={report.reporterName}
                            className="w-7 h-7 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://ui-avatars.com/api/?name=" +
                                encodeURIComponent(report.reporterName);
                            }}
                          />
                          <span>{report.reporterName}</span>
                        </div>
                      </td>

                      {/* Reported */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <img
                            src={report.reportedAvatar}
                            alt={report.reportedName}
                            className="w-7 h-7 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://ui-avatars.com/api/?name=" +
                                encodeURIComponent(report.reportedName);
                            }}
                          />
                          <span>{report.reportedName}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-xs text-gray-500">
                        {report.tripId}
                      </td>
                      <td className="py-4 px-6">{report.createdAt}</td>
                      <td className="py-4 px-6">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedReportId(report.id)}
                          className="bg-[#053F53] text-white px-3 py-1.5 rounded-lg hover:bg-[#293D53] text-xs transition"
                        >
                          Show
                        </button>
                      </td>
                    </tr>
                  ))}

              {!isLoading && !isFetching && reports.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-gray-400 text-sm"
                  >
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 text-sm">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`w-8 h-8 rounded-full transition ${
                    page === pageNumber
                      ? "bg-[#053F53] text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-2 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedReportId && (
        <ReportDetailModal
          reportId={selectedReportId}
          onClose={() => setSelectedReportId(null)}
        />
      )}
    </div>
  );
}
