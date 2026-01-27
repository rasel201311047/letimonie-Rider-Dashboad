import type { Ride } from "../../types";
import MetricCard from "../cardcomponent/MetricCard";
import RevenueGraph from "../cardcomponent/RevenueGraph";
import UserGrowthGraph from "../cardcomponent/UserGrowthGraph";
import RidesTable from "../table/RideTable";

export default function DashboardPage() {
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

  const rides: Ride[] = [
    {
      id: "#15FHM",
      driver: "Pierre Martin",
      rider: "Marie L.",
      pickupLocation: "15 Rue de Rivoli, Paris",
      destination: "Aéroport Lyon-Saint-Exupéry",
      status: "In Progress",
    },
    {
      id: "#02HHM",
      driver: "Jean Dubois",
      rider: "Sophie M.",
      pickupLocation: "45 Avenue des Champs-Élysées",
      destination: "Tour Eiffel",
      status: "In Progress",
    },
    {
      id: "#15HHM",
      driver: "Thomas Bernard",
      rider: "Luc R.",
      pickupLocation: "22 Boulevard Saint-Germain",
      destination: "Gare du Nord",
      status: "Picking Up",
    },
    {
      id: "#63DFE",
      driver: "Marie Curie",
      rider: "Alexandre P.",
      pickupLocation: "8 Rue de la Paix",
      destination: "Nice Côte d'Azur Airport",
      status: "In Progress",
    },
    {
      id: "#89GHJ",
      driver: "Robert Durand",
      rider: "Isabelle C.",
      pickupLocation: "67 Rue de Rivoli, Paris",
      destination: "Cité du Vin",
      status: "Cancel",
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
        <RevenueGraph
          rawDataByYear={rawDataByYear}
          graphtext={"Total Revenue"}
        />
        <UserGrowthGraph
          rawDataByYear={rawDataByYear}
          graphtext={"User growth"}
        />
      </div>
      <RidesTable rides={rides} />
    </div>
  );
}
