import { X } from "lucide-react";
import { useState } from "react";

type Report = {
  id: string;
  reporter: string;
  reported: string;
  time: string;
  reason: string;
  messages: string;
  status: string;
};

const initialReports: Report[] = [
  {
    id: "#RPT001",
    reporter: "Alice",
    reported: "Bob",
    time: "2025-12-20 15:30",
    reason: "Spam messages",
    messages:
      "The reason for this report is to notify you of a problem that occurred and to request a proper review and solution.",
    status: "Pending",
  },
  {
    id: "#RPT002",
    reporter: "Charlie",
    reported: "Dave",
    time: "2025-12-20 16:10",
    reason: "Abusive behavior",
    messages:
      "The reason for this report is to notify you of a problem that occurred and to request a proper review and solution.",
    status: "Resolved",
  },
  {
    id: "#RPT003",
    reporter: "Eva",
    reported: "Frank",
    time: "2025-12-20 17:00",
    reason: "Fake account",
    messages:
      "The reason for this report is to notify you of a problem that occurred and to request a proper review and solution.",
    status: "Pending",
  },
  {
    id: "#RPT004",
    reporter: "George",
    reported: "Hannah",
    time: "2025-12-20 17:30",
    reason: "Offensive language",
    messages:
      "The reason for this report is to notify you of a problem that occurred and to request a proper review and solution.",
    status: "Pending",
  },
];

const PAGE_SIZE = 3;

const StatusBadge = ({
  status,
  onChange,
}: {
  status: string;
  onChange?: (newStatus: string) => void;
}) => {
  const isPending = status === "Pending";

  return onChange ? (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      className={`px-2 py-1 text-xs font-medium rounded-full border ${
        isPending
          ? "border-yellow-300 bg-yellow-100 text-yellow-800"
          : "border-green-300 bg-green-100 text-green-800"
      }`}
    >
      <option value="Pending">Pending</option>
      <option value="Resolved">Resolved</option>
    </select>
  ) : (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${
        isPending
          ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
          : "bg-green-100 text-green-800 border border-green-300"
      }`}
    >
      {status}
    </span>
  );
};

export default function ReportShowPage() {
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const totalPages = Math.ceil(reports.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentReports = reports.slice(startIndex, startIndex + PAGE_SIZE);

  const handleBlockUser = (username: string) => {
    alert(`${username} has been blocked.`);
    setSelectedReport(null);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );
    if (selectedReport?.id === id) {
      setSelectedReport({ ...selectedReport, status: newStatus });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h4 className="text-xl font-['Inter'] font-bold text-[#0F0B18]">
          Report Management
        </h4>
        <p className="text-[#4F4F59] mt-1 text-base">Manage Report accounts</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reports</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700">
                  Report ID
                </th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700">
                  Reporter
                </th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700">
                  Reported
                </th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700">
                  Time
                </th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-gray-200 text-sm text-gray-800 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">{report.id}</td>
                  <td className="py-4 px-6">{report.reporter}</td>
                  <td className="py-4 px-6">{report.reported}</td>
                  <td className="py-4 px-6">{report.time}</td>
                  <td className="py-4 px-6">
                    <StatusBadge
                      status={report.status}
                      onChange={(newStatus) =>
                        handleStatusChange(report.id, newStatus)
                      }
                    />
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs"
                    >
                      Show
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`w-8 h-8 rounded-full transition ${
                  page === pageNumber
                    ? "bg-slate-900 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            Next →
          </button>
        </div>

        {/* Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-[420px] max-h-[85vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div></div>
                <h2 className="text-lg font-semibold text-gray-900 ">
                  Report Details
                </h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  <X />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 text-sm text-gray-700">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Reporter</p>
                    <p className="font-medium text-gray-900">
                      {selectedReport.reporter}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Reported User</p>
                    <p className="font-medium text-gray-900">
                      {selectedReport.reported}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">
                      {selectedReport.time}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Reason</p>
                    <p className="font-medium text-gray-900">
                      {selectedReport.reason}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Message
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-700 leading-relaxed">
                    {selectedReport.messages}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs font-semibold text-gray-500">Status</p>
                  <StatusBadge
                    status={selectedReport.status}
                    onChange={(newStatus) =>
                      handleStatusChange(selectedReport.id, newStatus)
                    }
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex justify-between gap-3">
                <button
                  onClick={() => handleBlockUser(selectedReport.reported)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                >
                  Block User
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
