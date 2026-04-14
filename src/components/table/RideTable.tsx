import React from "react";
import { useGetActiveRideQuery } from "../../rtkquery/page/dashboadApi";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "ongoing":
      return "bg-[#053F53] text-[#fff] border border-[#053F53]";
    case "picking up":
      return "bg-[#0C243D] text-[#fff] border border-[#0C243D]";
    case "cancel":
    case "cancelled":
      return "bg-[#D75757] text-[#fff] border border-[#D75757]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "ongoing":
      return "In Progress";
    case "picking up":
      return "Picking Up";
    case "cancel":
    case "cancelled":
      return "Cancel";
    default:
      return status;
  }
};

const RidesTable: React.FC = () => {
  const { data, isLoading } = useGetActiveRideQuery();

  const rides = data?.data || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#0A0A0A] font-['Inter']">
            Active Rides
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Trip ID
              </th>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Driver
              </th>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Pickup Location
              </th>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Destination
              </th>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-gray-400 text-sm"
                >
                  Loading...
                </td>
              </tr>
            ) : rides.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-gray-400 text-sm"
                >
                  No active rides found
                </td>
              </tr>
            ) : (
              rides.map((ride, index) => (
                <tr
                  key={`${ride.tripId}-${index}`}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-4 px-6 text-center">
                    <span className="font-['Inter'] text-[#0F172B] text-xs">
                      {ride.tripId}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {ride.driverAvatar && (
                        <img
                          src={ride.driverAvatar}
                          alt={ride.driverName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span className="font-['Inter'] text-[#0F172B] text-xs">
                        {ride.driverName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-['Inter'] text-[#0F172B] text-xs">
                      {ride.pickupLocation.address}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-['Inter'] text-[#0F172B] text-xs">
                      {ride.dropOffLocation.address}
                    </span>
                  </td>
                  <td className="py-4 text-center px-6">
                    <span
                      className={`inline-flex items-center w-24 justify-center py-1 rounded-xl text-xs font-[Inter] font-semibold ${getStatusColor(
                        ride.tripStatus,
                      )}`}
                    >
                      {getStatusLabel(ride.tripStatus)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RidesTable;
