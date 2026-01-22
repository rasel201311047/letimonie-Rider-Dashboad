import React, { useState } from "react";
import NewAdminAdd from "../modal/NewAdminAdd";

const PAGE_SIZE = 3;

/* ================= TYPES ================= */
type Status = "Active" | "Blocked";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  joined: string;
  status: Status;
}

/* ================= CURRENT ADMIN ================= */
/* Normally this comes from auth (JWT / context) */
const CURRENT_ADMIN_ID = "A-01";

/* ================= DUMMY DATA ================= */
const adminsData: AdminUser[] = [
  {
    id: "A-01",
    name: "Maria Johnson",
    email: "maria@admin.com",
    phone: "+880 1711 000000",
    joined: "10-01-2025",
    status: "Active",
  },
  {
    id: "A-02",
    name: "John Smith",
    email: "john@admin.com",
    phone: "+880 1811 111111",
    joined: "15-02-2025",
    status: "Active",
  },
  {
    id: "A-03",
    name: "Alex Brown",
    email: "alex@admin.com",
    phone: "+880 1911 222222",
    joined: "20-03-2025",
    status: "Blocked",
  },
  {
    id: "A-04",
    name: "Emma Wilson",
    email: "emma@admin.com",
    phone: "+880 1611 333333",
    joined: "05-04-2025",
    status: "Active",
  },
];

/* ================= STATUS BADGE ================= */
interface StatusBadgeProps {
  value: Status;
  disabled?: boolean;
  onChange: (value: Status) => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  value,
  disabled,
  onChange,
}) => {
  const isActive = value === "Active";

  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as Status)}
      className={`px-3 py-1 rounded-full text-sm font-medium transition
        ${
          isActive
            ? "bg-green-100 text-green-800 border border-green-300"
            : "bg-red-100 text-red-800 border border-red-300"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <option value="Active">Active</option>
      <option value="Blocked">Blocked</option>
    </select>
  );
};

/* ================= PAGINATION ================= */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
      >
        ← Previous
      </button>

      <span className="px-4 py-2 font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
      >
        Next →
      </button>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
export default function Admin() {
  const [admins, setAdmins] = useState<AdminUser[]>(adminsData);
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const totalPages = Math.ceil(admins.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentAdmins = admins.slice(startIndex, startIndex + PAGE_SIZE);

  const updateStatus = (id: string, status: Status) => {
    if (id === CURRENT_ADMIN_ID) return; // safety
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F0B18]">Admin Management</h2>
          <p className="text-gray-500">Manage admin accounts and permissions</p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-[#0F0B18] text-white px-4 py-2 rounded-lg text-sm"
        >
          Add New Admin
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E7E9EC] px-4 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-600">
              <th className="p-4 text-center">Admin ID</th>
              <th className="p-4 text-center">Name</th>
              <th className="p-4 text-center">Contact</th>
              <th className="p-4 text-center">Joined</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {currentAdmins.map((a) => {
              const isCurrentAdmin = a.id === CURRENT_ADMIN_ID;

              return (
                <tr
                  key={a.id}
                  className=" border-t border-t-[#E7E9EC] hover:bg-gray-50 transition"
                >
                  <td className="p-4 text-center">{a.id}</td>

                  <td className="p-4 text-center">
                    {a.name}
                    {isCurrentAdmin && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                        You
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    <div>{a.email}</div>
                    <div className="text-gray-500 text-xs">{a.phone}</div>
                  </td>

                  <td className="p-4 text-center">{a.joined}</td>

                  <td className="p-4 text-center">
                    <StatusBadge
                      value={a.status}
                      disabled={isCurrentAdmin}
                      onChange={(val) => updateStatus(a.id, val)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <NewAdminAdd open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
