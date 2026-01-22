import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getDataForYear = (
  rawDataByYear: Record<number, { month: string; value: number }[]>,
  year: number
) => {
  const yearData = rawDataByYear[year] ?? [];
  const map = Object.fromEntries(yearData.map((d) => [d.month, d.value]));

  return MONTHS.map((month) => ({
    month,
    value: map[month] ?? 0,
  }));
};

type Props = {
  rawDataByYear: Record<number, { month: string; value: number }[]>;
  graphtext: string;
};

const CustomTooltip = ({ active, payload, coordinate }: any) => {
  if (active && payload?.length) {
    return (
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md bg-[#0B1F33] px-2 py-1 text-xs font-semibold text-white shadow"
        style={{ left: coordinate?.x, top: coordinate?.y }}
      >
        {payload[0].value}
      </div>
    );
  }
  return null;
};

export default function RevenueGraph({ rawDataByYear, graphtext }: Props) {
  const CURRENT_YEAR = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => CURRENT_YEAR - 4 + i);

  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [open, setOpen] = useState(false);

  const chartData = getDataForYear(rawDataByYear, selectedYear);

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#0F0B18]">{graphtext}</h3>

        {/* Year dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 font-medium text-[#0F0B18]"
          >
            {selectedYear}
            <span className={`transition ${open ? "rotate-180" : ""}`}>
              <ChevronDown size={24} />
            </span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-24 rounded-md bg-white shadow z-50">
              {years.map((y) => (
                <div
                  key={y}
                  onClick={() => {
                    setSelectedYear(y);
                    setOpen(false);
                  }}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  {y}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[340px]">
        <ResponsiveContainer>
          <BarChart data={chartData} barCategoryGap={32}>
            <CartesianGrid vertical={false} strokeOpacity={0.2} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} domain={[0, 120]} />
            <Tooltip cursor={false} content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="#053F53"
              radius={[999, 999, 999, 999]}
              maxBarSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
