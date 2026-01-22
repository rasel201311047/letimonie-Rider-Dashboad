import React, { useState, useRef } from "react";
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Car,
  MapPin,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const mockRides = [
  {
    id: "RIDE-001",
    driver: { name: "Michael Chen", rating: 4.8 },
    rider: { name: "Sarah Johnson", rating: 4.9 },
    pickup: "123 Main St, Downtown",
    destination: "456 Park Ave, Uptown",
    status: "completed",
    date: "2024-01-15",
    fare: "$24.50",
    distance: "5.2 miles",
    duration: "18 min",
  },
  {
    id: "RIDE-002",
    driver: { name: "David Wilson", rating: 4.7 },
    rider: { name: "Robert Kim", rating: 4.5 },
    pickup: "789 Oak Street",
    destination: "321 Pine Road",
    status: "in_progress",
    date: "2024-01-15",
    fare: "$18.75",
    distance: "3.8 miles",
    duration: "12 min",
  },
  {
    id: "RIDE-003",
    driver: { name: "Emma Martinez", rating: 4.9 },
    rider: { name: "Lisa Wang", rating: 4.8 },
    pickup: "555 Tech Park",
    destination: "888 Business Center",
    status: "cancelled",
    date: "2024-01-14",
    fare: "$32.00",
    distance: "8.1 miles",
    duration: "25 min",
  },
  {
    id: "RIDE-004",
    driver: { name: "James Brown", rating: 4.6 },
    rider: { name: "Thomas Lee", rating: 4.7 },
    pickup: "222 River View",
    destination: "444 Mountain Ave",
    status: "scheduled",
    date: "2024-01-16",
    fare: "$28.90",
    distance: "6.5 miles",
    duration: "20 min",
  },
  {
    id: "RIDE-005",
    driver: { name: "Sophia Garcia", rating: 4.9 },
    rider: { name: "Maria Rodriguez", rating: 5.0 },
    pickup: "999 University Blvd",
    destination: "777 Mall Plaza",
    status: "completed",
    date: "2024-01-14",
    fare: "$21.30",
    distance: "4.3 miles",
    duration: "15 min",
  },
  {
    id: "RIDE-006",
    driver: { name: "Alex Turner", rating: 4.8 },
    rider: { name: "Jessica Lee", rating: 4.7 },
    pickup: "101 City Center",
    destination: "202 Business Park",
    status: "completed",
    date: "2024-01-13",
    fare: "$19.50",
    distance: "4.0 miles",
    duration: "14 min",
  },
  {
    id: "RIDE-007",
    driver: { name: "Brian Wilson", rating: 4.5 },
    rider: { name: "Chris Evans", rating: 4.9 },
    pickup: "303 Tech Hub",
    destination: "404 Innovation Center",
    status: "in_progress",
    date: "2024-01-15",
    fare: "$27.80",
    distance: "7.2 miles",
    duration: "22 min",
  },
  {
    id: "RIDE-008",
    driver: { name: "Olivia Parker", rating: 4.9 },
    rider: { name: "Daniel Kim", rating: 4.6 },
    pickup: "505 Arts District",
    destination: "606 Theater Square",
    status: "scheduled",
    date: "2024-01-17",
    fare: "$23.40",
    distance: "5.8 miles",
    duration: "19 min",
  },
  {
    id: "RIDE-009",
    driver: { name: "Ryan Scott", rating: 4.7 },
    rider: { name: "Amanda Taylor", rating: 4.8 },
    pickup: "707 Shopping Mall",
    destination: "808 Residential Area",
    status: "cancelled",
    date: "2024-01-14",
    fare: "$16.90",
    distance: "3.5 miles",
    duration: "11 min",
  },
  {
    id: "RIDE-010",
    driver: { name: "Lisa Brown", rating: 4.9 },
    rider: { name: "Kevin White", rating: 4.9 },
    pickup: "909 Airport Terminal",
    destination: "010 Hotel District",
    status: "completed",
    date: "2024-01-15",
    fare: "$35.20",
    distance: "9.3 miles",
    duration: "28 min",
  },
];

const statusConfig = {
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
    iconColor: "text-blue-500",
  },
  scheduled: {
    label: "Scheduled",
    color: "bg-yellow-100 text-yellow-800",
    icon: Calendar,
    iconColor: "text-yellow-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    iconColor: "text-red-500",
  },
};

const ITEMS_PER_PAGE = 5;

export default function RidesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [rides] = useState(mockRides);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportType, setExportType] = useState<"all" | "filtered">("filtered");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Filter rides based on search and status
  const filteredRides = rides.filter((ride) => {
    const matchesSearch =
      ride.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.rider.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || ride.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredRides.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRides = filteredRides.slice(startIndex, endIndex);

  // Status badge component
  const getStatusBadge = (status: keyof typeof statusConfig) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className={`w-3 h-3 mr-1 ${config.iconColor}`} />
        {config.label}
      </span>
    );
  };

  // Action handlers
  const handleExport = (type: "pdf" | "csv" = "pdf") => {
    const ridesToExport = exportType === "all" ? rides : filteredRides;

    if (type === "pdf") {
      generatePDF(ridesToExport);
    } else {
      generateCSV(ridesToExport);
    }
    setShowExportOptions(false);
  };

  const generatePDF = async (ridesToExport: typeof mockRides) => {
    try {
      // Create a new PDF document
      const pdf = new jsPDF("landscape", "mm", "a4");

      // Add header
      pdf.setFontSize(20);
      pdf.setTextColor(40, 40, 40);
      pdf.text("Rides Report", 20, 20);

      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      pdf.text(`Total Rides: ${ridesToExport.length}`, 20, 35);

      // Create table headers
      const headers = [
        "Ride ID",
        "Driver",
        "Rider",
        "Pickup",
        "Destination",
        "Status",
        "Fare",
        "Date",
      ];

      const columnWidths = [25, 30, 30, 40, 40, 25, 20, 25];
      let startY = 50;

      // Add table headers
      pdf.setFillColor(245, 247, 250);
      pdf.rect(20, startY - 5, 250, 8, "F");
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "bold");

      let x = 20;
      headers.forEach((header, index) => {
        pdf.text(header, x + 2, startY);
        x += columnWidths[index];
      });

      startY += 10;

      // Add table rows
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);

      ridesToExport.forEach((ride, index) => {
        if (startY > 190) {
          pdf.addPage();
          startY = 20;

          // Add headers to new page
          pdf.setFillColor(245, 247, 250);
          pdf.rect(20, startY - 5, 250, 8, "F");
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          pdf.setFont("helvetica", "bold");

          x = 20;
          headers.forEach((header, index) => {
            pdf.text(header, x + 2, startY);
            x += columnWidths[index];
          });

          startY += 10;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);
        }

        const rowData = [
          ride.id,
          ride.driver.name,
          ride.rider.name,
          ride.pickup.substring(0, 30) + (ride.pickup.length > 30 ? "..." : ""),
          ride.destination.substring(0, 30) +
            (ride.destination.length > 30 ? "..." : ""),
          statusConfig[ride.status as keyof typeof statusConfig].label,
          ride.fare,
          ride.date,
        ];

        x = 20;
        rowData.forEach((cell, cellIndex) => {
          pdf.text(cell.toString(), x + 2, startY);
          x += columnWidths[cellIndex];
        });

        startY += 7;

        // Add separator line
        if (index < ridesToExport.length - 1) {
          pdf.setDrawColor(200, 200, 200);
          pdf.line(20, startY - 2, 270, startY - 2);
        }
      });

      // Add summary
      startY += 10;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("Summary", 20, startY);

      startY += 7;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const completed = ridesToExport.filter(
        (r) => r.status === "completed",
      ).length;
      const inProgress = ridesToExport.filter(
        (r) => r.status === "in_progress",
      ).length;
      const scheduled = ridesToExport.filter(
        (r) => r.status === "scheduled",
      ).length;
      const cancelled = ridesToExport.filter(
        (r) => r.status === "cancelled",
      ).length;

      const totalRevenue = ridesToExport
        .filter((r) => r.status === "completed")
        .reduce((sum, ride) => sum + parseFloat(ride.fare.replace("$", "")), 0);

      pdf.text(`Total Rides: ${ridesToExport.length}`, 20, startY);
      pdf.text(`Completed: ${completed}`, 60, startY);
      pdf.text(`In Progress: ${inProgress}`, 100, startY);
      startY += 5;
      pdf.text(`Scheduled: ${scheduled}`, 20, startY);
      pdf.text(`Cancelled: ${cancelled}`, 60, startY);
      pdf.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 100, startY);

      // Save the PDF
      const fileName = `rides-report-${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const generateCSV = (ridesToExport: typeof mockRides) => {
    const headers = [
      "Ride ID",
      "Driver Name",
      "Driver Rating",
      "Rider Name",
      "Rider Rating",
      "Pickup Location",
      "Destination",
      "Status",
      "Date",
      "Fare",
      "Distance",
      "Duration",
    ];

    const csvRows = [
      headers.join(","),
      ...ridesToExport.map((ride) =>
        [
          ride.id,
          `"${ride.driver.name}"`,
          ride.driver.rating,
          `"${ride.rider.name}"`,
          ride.rider.rating,
          `"${ride.pickup}"`,
          `"${ride.destination}"`,
          statusConfig[ride.status as keyof typeof statusConfig].label,
          ride.date,
          ride.fare,
          ride.distance,
          ride.duration,
        ].join(","),
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `rides-${exportType === "all" ? "all" : "filtered"}-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewDetails = (rideId: string) => {
    alert(`Viewing details for ${rideId}`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pageNumbers.push(1, 2, 3);
      } else if (currentPage >= totalPages - 1) {
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-['Inter']">
            Rides Management
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage all rides in the system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rides</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {rides.length}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Car className="w-6 h-6 text-[#053F53]" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+12% from last month</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Rides
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {rides.filter((r) => r.status === "in_progress").length}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Currently in progress</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(
                    rides.reduce(
                      (sum, ride) =>
                        sum + ride.driver.rating + ride.rider.rating,
                      0,
                    ) /
                    (rides.length * 2)
                  ).toFixed(1)}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <User className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Driver satisfaction</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Revenue Today
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  $
                  {rides
                    .filter(
                      (r) =>
                        r.status === "completed" && r.date === "2024-01-15",
                    )
                    .reduce(
                      (sum, ride) =>
                        sum + parseFloat(ride.fare.replace("$", "")),
                      0,
                    )
                    .toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+8% from yesterday</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by Ride ID, Driver, or Rider..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-400"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-gray-400 cursor-pointer"
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowExportOptions(!showExportOptions)}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors hover:shadow-sm active:scale-[0.98]"
                  >
                    <Download className="w-5 h-5" />
                    <span className="font-medium">Export</span>
                  </button>

                  {showExportOptions && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="p-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Export Options
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="filtered"
                              checked={exportType === "filtered"}
                              onChange={() => setExportType("filtered")}
                              className="text-blue-600"
                            />
                            <label
                              htmlFor="filtered"
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              Export filtered rides ({filteredRides.length}{" "}
                              rides)
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              id="all"
                              checked={exportType === "all"}
                              onChange={() => setExportType("all")}
                              className="text-[#053F53]"
                            />
                            <label
                              htmlFor="all"
                              className="text-sm text-gray-700 cursor-pointer"
                            >
                              Export all rides ({rides.length} rides)
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => handleExport("pdf")}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <FileText className="w-4 h-4 text-red-500" />
                          Download as PDF
                        </button>
                        <button
                          onClick={() => handleExport("csv")}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          <FileText className="w-4 h-4 text-green-500" />
                          Download as CSV
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Table - Added ref for PDF capture */}
          <div className="overflow-x-auto" ref={tableRef}>
            <table className="w-full">
              <thead className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-semibold font-['Inter'] text-gray-700 uppercase tracking-wider">
                    Ride ID
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold font-['Inter'] text-gray-700 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold font-['Inter'] text-gray-700 uppercase tracking-wider">
                    Rider
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold font-['Inter'] text-gray-700 uppercase tracking-wider">
                    Locations
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold font-['Inter'] text-gray-700 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold font-['Inter'] text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRides.map((ride) => (
                  <tr
                    key={ride.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(ride.id)}
                  >
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{ride.id}</div>
                      <div className="text-xs text-gray-500">{ride.date}</div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-[#053F53]" />
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">
                            {ride.driver.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Rating: {ride.driver.rating}/5
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">
                            {ride.rider.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Rating: {ride.rider.rating}/5
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-[#053F53] mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-900">
                            From: {ride.pickup}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-900">
                            To: {ride.destination}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900 font-medium">
                          {ride.fare}
                        </div>
                        <div className="text-xs text-gray-500">
                          {ride.distance} • {ride.duration}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      {getStatusBadge(ride.status as keyof typeof statusConfig)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(endIndex, filteredRides.length)}
                </span>{" "}
                of <span className="font-medium">{filteredRides.length}</span>{" "}
                rides
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-50 hover:shadow-sm active:scale-95"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1.5 min-w-[40px] rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-[#053F53] text-white hover:bg-[#053F53]"
                          : "border border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                      } active:scale-95`}
                    >
                      {page}
                    </button>
                  ))}

                  {totalPages > 3 && currentPage < totalPages - 1 && (
                    <>
                      <span className="px-2 text-gray-500">...</span>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-3 py-1.5 min-w-[40px] rounded-lg text-sm font-medium transition-colors border border-gray-300 hover:bg-gray-50 hover:shadow-sm active:scale-95`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:bg-gray-50 hover:shadow-sm active:scale-95"
                  }`}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
