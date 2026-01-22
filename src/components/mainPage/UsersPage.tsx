import React from "react";
import MetricCard from "../cardcomponent/MetricCard";
import { Search } from "lucide-react";
import UsersTable from "../table/UsersTable";

export default function UsersPage() {
  const metrics = [
    {
      id: "onride",
      title: "On Ride",
      value: "147",
      icon: "onride",
    },
    {
      id: "Drivers",
      title: "Drivers",
      value: "132",
      icon: "driver",
    },
    {
      id: "users",
      title: "Total Users",
      value: "2,841",
      icon: "users",
    },
  ];
  return (
    <div className="p-6 space-y-6 ">
      <UsersTable />
    </div>
  );
}
