import { useGetOverviewStatsQuery } from "../../rtkquery/page/dashboadApi";

import MetricCard from "../cardcomponent/MetricCard";
import RevenueGraph from "../cardcomponent/RevenueGraph";
import UserGrowthGraph from "../cardcomponent/UserGrowthGraph";
import RidesTable from "../table/RideTable";

export default function DashboardPage() {
  const { data: overviewdata } = useGetOverviewStatsQuery();
  console.log(overviewdata?.data?.activeUsers);
  const metrics = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: `${overviewdata?.data?.totalRevenue ?? 0} JOD`,
      icon: "revenue",
    },
    {
      id: "rides",
      title: "Active Rides",
      value: `${overviewdata?.data?.activeRides || 0}`,
      icon: "rides",
    },
    {
      id: "users",
      title: "Active Users",
      value: `${overviewdata?.data?.activeUsers || 0}`,
      icon: "users",
    },
  ];

  return (
    <div className="p-6 space-y-6 ">
      {/* the card */}
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

      {/* graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueGraph graphtext={"Total Revenue"} />
        <UserGrowthGraph graphtext={"User growth"} />
      </div>
      <RidesTable />
    </div>
  );
}
