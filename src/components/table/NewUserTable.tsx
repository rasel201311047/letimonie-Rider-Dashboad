import React from "react";
import { useGetNewUserQuery } from "../../rtkquery/page/dashboadApi";

const getPlanColor = (plan: string) => {
  switch (plan?.toLowerCase()) {
    case "premium":
      return "bg-[#053F53] text-[#fff] border border-[#053F53]";
    case "all-access":
      return "bg-[#0C243D] text-[#fff] border border-[#0C243D]";
    case "free":
      return "bg-gray-100 text-gray-700 border border-gray-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPlanLabel = (plan: string) => {
  switch (plan?.toLowerCase()) {
    case "all-access":
      return "All Access";
    case "premium":
      return "Premium";
    case "free":
      return "Free";
    default:
      return plan || "N/A";
  }
};

interface NewUser {
  fullName: string;
  avatar: string;
  email: string;
  phone: string;
  accountId: string;
  isActive: boolean | null;
  plan: string;
  createdAt: string;
}

const NewUserTable: React.FC = () => {
  const { data, isLoading } = useGetNewUserQuery(undefined, {
    pollingInterval: 1500,
    refetchOnFocus: true,
  });
  const users: NewUser[] = data?.data || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#0A0A0A] font-['Inter']">
            New Users
          </h3>
          <span className="text-xs text-gray-400 font-['Inter']">
            {users.length} recent
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider"></th>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                User
              </th>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Account ID
              </th>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Contact
              </th>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Plan
              </th>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Status
              </th>
              <th className="py-3 px-6 text-center text-xs font-semibold font-['Inter'] text-[#0F0B18] capitalize tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-gray-400 text-sm"
                >
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-gray-400 text-sm"
                >
                  No new users found
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={`${user.accountId}-${index}`}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {user.avatar && (
                        <img
                          src={user.avatar}
                          alt={user.fullName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  {/* User */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-['Inter'] text-[#0F172B] text-xs font-medium">
                        {user.fullName}
                      </span>
                    </div>
                  </td>

                  {/* Account ID */}
                  <td className="py-4 px-6 text-center">
                    <span className="font-['Inter'] text-[#0F172B] text-xs font-mono">
                      {user.accountId}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="font-['Inter'] text-[#0F172B] text-xs">
                        {user.email !== "N/A" ? user.email : "—"}
                      </span>
                      {user.phone !== "N/A" && (
                        <span className="font-['Inter'] text-gray-400 text-xs">
                          {user.phone}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Plan */}
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center w-24 justify-center py-1 rounded-xl text-xs font-semibold font-['Inter'] ${getPlanColor(user.plan)}`}
                    >
                      {getPlanLabel(user.plan)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center gap-1 justify-center py-1 px-2 rounded-xl text-xs font-semibold font-['Inter'] ${
                        user.isActive
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-600 border border-red-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.isActive ? "bg-green-500" : "bg-red-400"
                        }`}
                      />
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="py-4 px-6 text-center">
                    <span className="font-['Inter'] text-[#0F172B] text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
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

export default NewUserTable;
