import React from "react";
import type { Ride } from "../../types";

interface RidesTableProps {
  rides: Ride[];
}

const RidesTable: React.FC<RidesTableProps> = ({ rides }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-[#053F53] text-[#fff] border border-[#053F53]";
      case "Picking Up":
        return "bg-[#0C243D] text-[#fff] border border-[#0C243D]";

      case "Cancel":
        return "bg-[#D75757] text-[#fff] border border-[#D75757]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
              <th className="py-3 px-6 text-center text-xs  font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Ride ID
              </th>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Driver
              </th>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Rider
              </th>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Pickup Location
              </th>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Destination
              </th>
              <th className="py-3 px-6 text-center  text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rides.map((ride, index) => (
              <tr
                key={`${ride.id}-${index}`}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="py-4 px-6 text-center">
                  <span className="font-['Inter'] text-[#0F172B] text-xs ">
                    {ride.id}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-['Inter'] text-[#0F172B] text-xs">
                    {ride.driver}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-['Inter'] text-[#0F172B] text-xs">
                    {ride.rider}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="font-['Inter'] text-[#0F172B] text-xs">
                    {ride.pickupLocation}
                  </span>
                </td>

                <td className="py-4 px-6 text-center">
                  <span className="font-['Inter'] text-[#0F172B] text-xs">
                    {ride.destination}
                  </span>
                </td>

                <td className="py-4 text-center px-6">
                  <span
                    className={`inline-flex items-center w-24 justify-center py-1 rounded-xl text-xs font-[Inter] font-semibold ${getStatusColor(
                      ride.status
                    )}`}
                  >
                    {ride.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RidesTable;
