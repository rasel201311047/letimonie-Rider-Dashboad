import { Link } from "react-router-dom";
import { Bell, Grid, MessageCircleMore } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../rtkquery/store";

export default function Admin() {
  const routeName = useSelector(
    (state: RootState) => state.globaldata.routeName,
  );

  console.log(routeName);

  const getTitle = (routeName: string) => {
    switch (routeName) {
      case "dashboard":
        return "Dashboard Default";

      case "users":
        return "Users Mangement";

      case "rides":
        return "Rides Mangement";
      case "PlanExtraction":
        return "Plan Extraction";

      case "financial-analytics":
        return "Financial Analytics";
      case "notifications":
        return "Notifications";
      case "drivers":
        return "Drivers Mangement";
      case "editprofile":
        return "Editprofile";

      case "subcription":
        return "Subcription";

      case "admin":
        return "Admin List";

      case "about":
        return "About";

      case "privacy":
        return "Privacy";

      case "terms":
        return "Term & Condition";
      case "chat":
        return "Help & Support";

      case "ReportShowPage":
        return "Report Mangement";
      default:
        return "Page";
    }
  };

  const getSubTitle = (routeName: string) => {
    switch (routeName) {
      case "dashboard":
        return "dashboad/default";
      case "users":
        return "users/mangement";
      case "rides":
        return "rides/show";
      case "PlanExtraction":
        return "Plan Extraction/mangement";
      case "subcription":
        return "subcription/mangement";

      case "financial-analytics":
        return "financial-analytics/mangement";
      case "notifications":
        return "notifications/send";
      case "drivers":
        return "drivers/mangement";

      case "editprofile":
        return "drivers/editprofile";
      case "ReportShowPage":
        return "report/mangement";
      case "admin":
        return "admin/mangement";

      case "about":
        return "about/mangement";

      case "privacy":
        return "privacy/mangement";

      case "terms":
        return "terms and condition/mangement";

      case "chat":
        return "Support/chat";
      default:
        return "Page";
    }
  };

  return (
    <header
      className="fixed top-0 left-64 right-0 z-50 bg-white"
      style={{ boxShadow: "0 4px 6px -2px rgba(0,0,0,0.1)" }}
    >
      <div className="flex items-center justify-between px-6 h-[8vh]">
        {/* LEFT */}
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-[#1F2937]">
            {getTitle(routeName)}
          </h1>
          <div className="flex items-center gap-1 ">
            <span className="flex items-center gap-1">
              <Grid size={14} />
              {(() => {
                const subtitle = getSubTitle(routeName);
                const parts = subtitle.split("/");
                return (
                  <>
                    <span className="text-sm text-gray-400">{parts[0]}/</span>
                    <span className="text-[#053F53] font-medium">
                      {parts[1]}
                    </span>
                  </>
                );
              })()}
            </span>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-5">
          {/* ICONS */}
          <div className="flex items-center gap-4 text-gray-500">
            <div className="relative cursor-pointer">
              <MessageCircleMore size={24} />

              <span className="absolute -top-1 -right-1 bg-red-700 text-white text-[10px] w-4 h-4 flex justify-center items-center rounded-full">
                4
              </span>
            </div>

            <Link to={"/NotificationShow"} className="relative cursor-pointer">
              <Bell size={24} />
              <span className="absolute -top-1 -right-1 bg-red-700 text-white text-[10px] w-4 h-4 flex justify-center items-center rounded-full">
                3
              </span>
            </Link>
          </div>

          {/* PROFILE */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-xl transition"
          >
            <img
              src="https://i.ibb.co/CsHtrdcN/user-8.png"
              className="w-9 h-9 rounded-full object-cover"
              alt="Admin"
            />
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-sm font-semibold text-gray-700">
                Rasel Islam
              </span>
              <span className="text-xs text-gray-400">Admin</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
