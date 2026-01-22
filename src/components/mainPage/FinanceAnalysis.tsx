import React from "react";
import UserGrowthGraph from "../cardcomponent/UserGrowthGraph";
import MetricCard from "../cardcomponent/MetricCard";
import FinanceTableWithData from "../table/FinanceTableWithData";
import RevenueGraph from "../cardcomponent/RevenueGraph";

export default function FinanceAnalysis() {
  const metrics = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: "328,000 JOD",
      icon: "revenue",
    },
    {
      id: "rides",
      title: "Active Rides",
      value: "147",
      icon: "rides",
    },
    {
      id: "users",
      title: "Active Users",
      value: "2,841",
      icon: "users",
    },
  ];
  const rawDataByYear: Record<number, { month: string; value: number }[]> = {
    2024: [
      { month: "Jan", value: 60 },
      { month: "Feb", value: 55 },
      { month: "Mar", value: 70 },
      { month: "Apr", value: 40 },
      { month: "May", value: 65 },
      { month: "Jun", value: 72 },
      { month: "Jul", value: 68 },
      { month: "Aug", value: 74 },
      { month: "Sep", value: 80 },
      { month: "Oct", value: 85 },
      { month: "Nov", value: 78 },
      { month: "Dec", value: 90 },
    ],
    2025: [
      { month: "Jan", value: 75 },
      { month: "Feb", value: 62 },
      { month: "Mar", value: 88 },
      { month: "Apr", value: 50 },
      { month: "May", value: 82 },
      { month: "Jun", value: 79 },
      { month: "Jul", value: 70 },
      { month: "Aug", value: 73 },
      { month: "Sep", value: 92 },
      { month: "Oct", value: 98 },
      { month: "Nov", value: 85 },
      { month: "Dec", value: 100 },
    ],
    2026: [
      { month: "Jan", value: 85 },
      { month: "Feb", value: 70 },
      { month: "Mar", value: 85 },
      { month: "Apr", value: 40 },
      { month: "May", value: 80 },
      { month: "Jun", value: 75 },
      { month: "Jul", value: 68 },
      { month: "Aug", value: 66 },
      { month: "Sep", value: 90 },
      { month: "Oct", value: 102 },
      { month: "Nov", value: 74 },
      { month: "Dec", value: 104 },
    ],
  };
  return (
    <div className="p-6 space-y-6 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
          />
        ))}
      </div>
      <RevenueGraph rawDataByYear={rawDataByYear} graphtext={"Total Revenue"} />

      <FinanceTableWithData />
    </div>
  );
}
