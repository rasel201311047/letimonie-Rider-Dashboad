import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Search,
  Filter,
  Shield,
  UserCheck,
  UserX,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

const PAGE_SIZE = 3;

type DriverStatus = "Active" | "Blocked" | "Pending";
type VerificationStatus = "Verified" | "Unverified" | "Rejected";
type FilterType =
  | "all"
  | "active"
  | "blocked"
  | "pending"
  | "verified"
  | "unverified";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  rating: number;
  rides: number;
  earning: number;
  joined: string;
  status: DriverStatus;
  verificationStatus: VerificationStatus;
  documents: {
    vtcCard: {
      front: string;
      back: string;
      verified: boolean;
    };
    license: {
      front: string;
      back: string;
      verified: boolean;
    };
    vehiclePhoto: string;
  };
  submissionDate: string;
  rejectionReason?: string;
}

const initialDriversData: Driver[] = [
  {
    id: "D-66",
    name: "Pierre Martin",
    email: "pierre.m@email.com",
    phone: "+33 6 78 90 12 34",
    vehicle: "Helios Eco-Y SC 220",
    rating: 4.7,
    rides: 1247,
    earning: 2050,
    joined: "12-07-2025",
    status: "Active",
    verificationStatus: "Verified",
    documents: {
      vtcCard: {
        front: "https://i.ibb.co.com/TBNLqH11/Rectangle-161124491.png",
        back: "https://i.ibb.co.com/HDD0hyY9/Rectangle-161124490.png",
        verified: true,
      },
      license: {
        front: "https://i.ibb.co.com/bgCLz5yn/Rectangle-161124491-1.png",
        back: "https://i.ibb.co.com/6RFRGhBq/Rectangle-161124490-1.png",
        verified: true,
      },
      vehiclePhoto: "https://i.ibb.co.com/6RkshDyc/Rectangle-161124491-2.png",
    },
    submissionDate: "10-07-2025",
  },
  {
    id: "D-84",
    name: "Jean Dupont",
    email: "jean.d@email.com",
    phone: "+33 6 12 34 56 78",
    vehicle: "Tesla Model 3",
    rating: 4.8,
    rides: 160,
    earning: 3200,
    joined: "15-07-2025",
    status: "Pending",
    verificationStatus: "Unverified",
    documents: {
      vtcCard: {
        front: "https://i.ibb.co.com/TBNLqH11/Rectangle-161124491.png",
        back: "https://i.ibb.co.com/HDD0hyY9/Rectangle-161124490.png",
        verified: false,
      },
      license: {
        front: "https://i.ibb.co.com/bgCLz5yn/Rectangle-161124491-1.png",
        back: "https://i.ibb.co.com/6RFRGhBq/Rectangle-161124490-1.png",
        verified: false,
      },
      vehiclePhoto: "https://i.ibb.co.com/6RkshDyc/Rectangle-161124491-2.png",
    },
    submissionDate: "14-07-2025",
  },
  {
    id: "D-36",
    name: "Marie Curie",
    email: "marie.c@email.com",
    phone: "+33 6 23 45 67 89",
    vehicle: "Renault Zoe",
    rating: 4.5,
    rides: 250,
    earning: 1800,
    joined: "01-07-2025",
    status: "Blocked",
    verificationStatus: "Rejected",
    documents: {
      vtcCard: {
        front: "https://i.ibb.co.com/TBNLqH11/Rectangle-161124491.png",
        back: "https://i.ibb.co.com/HDD0hyY9/Rectangle-161124490.png",
        verified: false,
      },
      license: {
        front: "https://i.ibb.co.com/bgCLz5yn/Rectangle-161124491-1.png",
        back: "https://i.ibb.co.com/6RFRGhBq/Rectangle-161124490-1.png",
        verified: false,
      },
      vehiclePhoto: "https://i.ibb.co.com/6RkshDyc/Rectangle-161124491-2.png",
    },
    submissionDate: "28-06-2025",
    rejectionReason: "Expired license",
  },
  {
    id: "D-40",
    name: "Thomas Anderson",
    email: "thomas.a@email.com",
    phone: "+33 6 98 76 54 32",
    vehicle: "Peugeot 308",
    rating: 4.9,
    rides: 800,
    earning: 4500,
    joined: "05-07-2025",
    status: "Active",
    verificationStatus: "Verified",
    documents: {
      vtcCard: {
        front: "https://i.ibb.co.com/TBNLqH11/Rectangle-161124491.png",
        back: "https://i.ibb.co.com/HDD0hyY9/Rectangle-161124490.png",
        verified: true,
      },
      license: {
        front: "https://i.ibb.co.com/bgCLz5yn/Rectangle-161124491-1.png",
        back: "https://i.ibb.co.com/6RFRGhBq/Rectangle-161124490-1.png",
        verified: true,
      },
      vehiclePhoto: "https://i.ibb.co.com/6RkshDyc/Rectangle-161124491-2.png",
    },
    submissionDate: "03-07-2025",
  },
  {
    id: "D-53",
    name: "Sophie Laurent",
    email: "sophie.l@email.com",
    phone: "+33 6 11 22 33 44",
    vehicle: "Volkswagen ID.3",
    rating: 4.6,
    rides: 960,
    earning: 5200,
    joined: "08-07-2025",
    status: "Pending",
    verificationStatus: "Unverified",
    documents: {
      vtcCard: {
        front: "https://i.ibb.co.com/TBNLqH11/Rectangle-161124491.png",
        back: "https://i.ibb.co.com/HDD0hyY9/Rectangle-161124490.png",
        verified: false,
      },
      license: {
        front: "https://i.ibb.co.com/bgCLz5yn/Rectangle-161124491-1.png",
        back: "https://i.ibb.co.com/6RFRGhBq/Rectangle-161124490-1.png",
        verified: false,
      },
      vehiclePhoto: "https://i.ibb.co.com/6RkshDyc/Rectangle-161124491-2.png",
    },
    submissionDate: "06-07-2025",
  },
];

interface StatusBadgeProps {
  value: DriverStatus;
  onChange?: (value: DriverStatus) => void;
  isSelectable?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  value,
  onChange,
  isSelectable = true,
}) => {
  const getStatusStyles = () => {
    switch (value) {
      case "Active":
        return "bg-green-100 text-green-800 border border-green-300";
      case "Blocked":
        return "bg-red-100 text-red-800 border border-red-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  if (isSelectable && onChange) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as DriverStatus)}
        className={`px-3 py-1 rounded-full text-sm font-medium outline-none cursor-pointer transition-all ${getStatusStyles()} hover:opacity-90`}
      >
        <option value="Active">Active</option>
        <option value="Blocked">Blocked</option>
        <option value="Pending">Pending</option>
      </select>
    );
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles()}`}
    >
      {value}
    </span>
  );
};

interface VerificationBadgeProps {
  status: VerificationStatus;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status }) => {
  const getVerificationStyles = () => {
    switch (status) {
      case "Verified":
        return "bg-emerald-100 text-emerald-800 border border-emerald-300";
      case "Rejected":
        return "bg-rose-100 text-rose-800 border border-rose-300";
      case "Unverified":
        return "bg-amber-100 text-amber-800 border border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getVerificationStyles()}`}
    >
      {status}
    </span>
  );
};

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
  const getVisiblePages = (): (number | string)[] => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = 1;
    const range: (number | string)[] = [];
    range.push(1);

    let start = Math.max(2, currentPage - delta);
    let end = Math.min(totalPages - 1, currentPage + delta);

    if (start > 2) {
      range.push("...");
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (end < totalPages - 1) {
      range.push("...");
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return Array.from(new Set(range));
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-end gap-2 mt-6 text-sm">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
      >
        ← Previous
      </button>

      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                currentPage === page
                  ? "bg-[#053F53] text-white shadow-sm"
                  : "hover:bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
      >
        Next →
      </button>
    </div>
  );
};

interface DiverDocumentModalProps {
  open: boolean;
  driver: Driver | null;
  onClose: () => void;
  onApprove: (driverId: string) => void;
  onReject: (driverId: string, reason: string) => void;
}

const DiverDocumentModal: React.FC<DiverDocumentModalProps> = ({
  open,
  driver,
  onClose,
  onApprove,
  onReject,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    if (driver?.rejectionReason) {
      setRejectionReason(driver.rejectionReason);
    }
  }, [driver]);

  if (!open || !driver) return null;

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(driver.id, rejectionReason);
      setIsRejecting(false);
      setRejectionReason("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90%] max-w-5xl h-[90%] max-h-[900px] rounded-2xl shadow-2xl p-6 relative flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Driver Documents - {driver.name}
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <StatusBadge value={driver.status} isSelectable={false} />
              <VerificationBadge status={driver.verificationStatus} />
              <span className="text-sm text-gray-500">
                Submitted: {driver.submissionDate}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Action Buttons for Pending Drivers */}
        {driver.status === "Pending" && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-blue-600" size={20} />
                <span className="font-medium text-blue-800">
                  Action Required: Review this driver's documents
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onApprove(driver.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <UserCheck size={18} />
                  Approve Driver
                </button>
                {isRejecting ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter rejection reason..."
                      className="px-3 py-2 border border-gray-300 rounded-lg w-64"
                    />
                    <button
                      onClick={handleReject}
                      disabled={!rejectionReason.trim()}
                      className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setIsRejecting(false);
                        setRejectionReason("");
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsRejecting(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    <UserX size={18} />
                    Reject Driver
                  </button>
                )}
              </div>
            </div>
            {driver.rejectionReason && (
              <div className="mt-3 p-3 bg-rose-50 rounded border border-rose-200">
                <p className="text-sm text-rose-800">
                  <span className="font-semibold">Rejection Reason:</span>{" "}
                  {driver.rejectionReason}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-8">
          {/* VTC Card Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">VTC Card</h3>
              {driver.documents.vtcCard.verified ? (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Check size={18} /> Verified
                </span>
              ) : (
                <span className="text-amber-600 font-medium">
                  Pending Verification
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["front", "back"].map((side) => (
                <div key={side} className="bg-gray-50 rounded-xl p-4 border">
                  <p className="text-sm font-medium text-gray-700 mb-2 capitalize">
                    {side} Side
                  </p>
                  <img
                    src={
                      driver.documents.vtcCard[
                        side as keyof typeof driver.documents.vtcCard
                      ] as string
                    }
                    alt={`VTC Card ${side}`}
                    className="w-full h-72 object-contain rounded-lg hover:scale-105 transition-transform duration-200 cursor-zoom-in"
                    onClick={() =>
                      window.open(
                        driver.documents.vtcCard[
                          side as keyof typeof driver.documents.vtcCard
                        ] as string,
                        "_blank",
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Driving License Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Driving License
              </h3>
              {driver.documents.license.verified ? (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Check size={18} /> Verified
                </span>
              ) : (
                <span className="text-amber-600 font-medium">
                  Pending Verification
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["front", "back"].map((side) => (
                <div key={side} className="bg-gray-50 rounded-xl p-4 border">
                  <p className="text-sm font-medium text-gray-700 mb-2 capitalize">
                    {side} Side
                  </p>
                  <img
                    src={
                      driver.documents.license[
                        side as keyof typeof driver.documents.license
                      ] as string
                    }
                    alt={`License ${side}`}
                    className="w-full h-72 object-contain rounded-lg hover:scale-105 transition-transform duration-200 cursor-zoom-in"
                    onClick={() =>
                      window.open(
                        driver.documents.license[
                          side as keyof typeof driver.documents.license
                        ] as string,
                        "_blank",
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Vehicle Photo Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Vehicle Photo
              </h3>
              <span className="text-sm text-gray-500">
                Vehicle: {driver.vehicle}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border">
              <img
                src={driver.documents.vehiclePhoto}
                alt="Vehicle"
                className="w-full h-80 object-contain rounded-lg hover:scale-105 transition-transform duration-200 cursor-zoom-in"
                onClick={() =>
                  window.open(driver.documents.vehiclePhoto, "_blank")
                }
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default function DiverPage() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDriversData);
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredDrivers = drivers.filter((driver) => {
    // Apply search filter
    const matchesSearch =
      searchTerm === "" ||
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm);

    // Apply status filter
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && driver.status === "Active") ||
      (filter === "blocked" && driver.status === "Blocked") ||
      (filter === "pending" && driver.status === "Pending") ||
      (filter === "verified" && driver.verificationStatus === "Verified") ||
      (filter === "unverified" && driver.verificationStatus === "Unverified");

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredDrivers.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentDrivers = filteredDrivers.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const updateStatus = (id: string, status: DriverStatus) => {
    setDrivers((prev) =>
      prev.map((driver) => (driver.id === id ? { ...driver, status } : driver)),
    );
  };

  const approveDriver = (driverId: string) => {
    setDrivers((prev) =>
      prev.map((driver) =>
        driver.id === driverId
          ? {
              ...driver,
              status: "Active" as const,
              verificationStatus: "Verified" as const,
              documents: {
                ...driver.documents,
                vtcCard: { ...driver.documents.vtcCard, verified: true },
                license: { ...driver.documents.license, verified: true },
              },
            }
          : driver,
      ),
    );
    setOpenModal(false);
  };

  const rejectDriver = (driverId: string, reason: string) => {
    setDrivers((prev) =>
      prev.map((driver) =>
        driver.id === driverId
          ? {
              ...driver,
              status: "Blocked" as const,
              verificationStatus: "Rejected" as const,
              rejectionReason: reason,
            }
          : driver,
      ),
    );
    setOpenModal(false);
  };

  const getStats = () => {
    const total = drivers.length;
    const active = drivers.filter((d) => d.status === "Active").length;
    const pending = drivers.filter((d) => d.status === "Pending").length;
    const blocked = drivers.filter((d) => d.status === "Blocked").length;

    return { total, active, pending, blocked };
  };

  const stats = getStats();

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Drivers</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Drivers</p>
              <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Blocked Drivers</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.blocked}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <UserX className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Driver Management
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
                {Math.min(page * PAGE_SIZE, filteredDrivers.length)} of{" "}
                {filteredDrivers.length} drivers
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search drivers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter size={18} />
                  Filter
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
                  />
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      {[
                        { value: "all", label: "All Drivers" },
                        { value: "active", label: "Active Only" },
                        { value: "blocked", label: "Blocked Only" },
                        { value: "pending", label: "Pending Review" },
                        { value: "verified", label: "Verified" },
                        { value: "unverified", label: "Unverified" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setFilter(option.value as FilterType);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            filter === option.value
                              ? "bg-blue-50 text-blue-700"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600 font-medium">
                <th className="p-4 pl-6">Driver ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Rides</th>
                <th className="p-4">Earning</th>
                <th className="p-4">Status</th>
                <th className="p-4">Verification</th>
                <th className="p-4 pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentDrivers.map((driver) => (
                <tr
                  key={driver.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 pl-6 font-medium text-gray-900">
                    {driver.id}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {driver.name}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {driver.email}
                    </div>
                    <div className="text-sm text-gray-500">{driver.phone}</div>
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    {driver.vehicle}
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    {driver.rating} ⭐
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {driver.rides} rides
                    </span>
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    ${driver.earning}
                  </td>
                  <td className="p-4">
                    <StatusBadge
                      value={driver.status}
                      onChange={(val) => updateStatus(driver.id, val)}
                    />
                  </td>
                  <td className="p-4">
                    <VerificationBadge status={driver.verificationStatus} />
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedDriver(driver);
                          setOpenModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Documents"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 8V4M4 4H8M4 4L9 9M20 8V4M20 4H16M20 4L15 9M4 16V20M4 20H8M4 20L9 15M20 20L15 15M20 20V16M20 20H16"
                            stroke="#4B5563"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      {driver.status === "Pending" && (
                        <>
                          <button
                            onClick={() => approveDriver(driver.id)}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                            title="Approve Driver"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() =>
                              rejectDriver(
                                driver.id,
                                "Documents not satisfactory",
                              )
                            }
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                            title="Reject Driver"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Document Modal */}
      <DiverDocumentModal
        open={openModal}
        driver={selectedDriver}
        onClose={() => setOpenModal(false)}
        onApprove={approveDriver}
        onReject={rejectDriver}
      />
    </div>
  );
}
