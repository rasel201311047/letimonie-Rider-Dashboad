import React from "react";
import { TrendingUp, Users, Car } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case "revenue":
        return <div className="text-xs  font-bold ">JOD</div>;
      case "rides":
        return <Car size={12} />;
      case "onride":
        return <Car size={12} />;
      case "driver":
        return <Car size={12} />;
      case "users":
        return <Users size={12} />;

      default:
        return <TrendingUp size={12} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div
          className={
            "w-6 h-6 rounded-full bg-[#E7E9EC] flex justify-center items-center"
          }
        >
          <div>{getIcon()}</div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
