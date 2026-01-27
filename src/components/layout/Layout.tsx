import React from "react";
import { Outlet } from "react-router-dom";
import type { NavItem } from "../../types";
import Sidebar from "../navigationber/Sidebar";
import Admin from "../profile/Admin";
const Layout: React.FC = () => {
  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    {
      id: "users",
      label: "Users",
      path: "/users",
    },
    { id: "rides", label: "Rides", path: "/rides" },
    { id: "drivers", label: "Drivers", path: "/drivers" },
    {
      id: "financial-analytics",
      label: "Financial Analytics",
      path: "/financial-analytics",
    },
    {
      id: "subcription",
      label: "Subcription",
      path: "/subcription",
    },
    { id: "PlanExtraction", label: "Plan Extraction", path: "/PlanExtraction" },
    { id: "chat", label: "Help and Souport", path: "/chat" },
    { id: "ReportShowPage", label: "Report", path: "/ReportShowPage" },
    { id: "notifications", label: "Notifications", path: "/notifications" },
    {
      id: "settings",
      label: "Settings",
      path: "/editprofile",
      children: [
        {
          id: "editprofile",
          label: "Edit Profile",
          path: "/settings/editprofile",
        },
        { id: "admin", label: "Admin", path: "/settings/admin" },
        { id: "about", label: "About Us", path: "/settings/about" },
        { id: "privacy", label: "Privacy Policy", path: "/settings/privacy" },
        { id: "terms", label: "Terms & Condition", path: "/settings/terms" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar navItems={navItems} />
      <div className="ml-64">
        <Admin />
        <main className="pt-[8vh] min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
