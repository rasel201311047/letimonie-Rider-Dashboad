import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";

/* ===== Types ===== */
type ChartData = {
  month: string;
  value: number;
};

type Props = {
  rawDataByYear: Record<number, ChartData[]>;
  graphtext: string;
};

/* ===== Month Template ===== */
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

/* ===== Tooltip ===== */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-md bg-white px-3 py-1 text-sm font-semibold shadow">
        {payload[0].value}
      </div>
    );
  }
  return null;
};

export default function UserGrowthGraph({ rawDataByYear, graphtext }: Props) {
  const CURRENT_YEAR = new Date().getFullYear();

  const START_YEAR = CURRENT_YEAR - 4;
  const END_YEAR = CURRENT_YEAR + 2;

  const [year, setYear] = useState(CURRENT_YEAR);

  /* ===== Year List ===== */
  const allYears = useMemo(() => {
    const years = [];
    for (let y = START_YEAR; y <= END_YEAR; y++) {
      years.push(y);
    }
    return years;
  }, []);

  /* ===== Get Chart Data  ===== */
  const chartData = useMemo(() => {
    const yearData = rawDataByYear[year] || [];

    return MONTHS.map((month) => {
      const found = yearData.find((d) => d.month === month);
      return {
        month,
        value: found ? found.value : 0,
      };
    });
  }, [year]);

  return (
    <div className="rounded-2xl bg-white p-5 w-full">
      {/* Header */}
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold text-[#0F0B18] font-['Inter'] text-lg">
          {graphtext}
        </h3>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-transparent font-semibold text-[#0F0B18] font-['Inter'] text-lg outline-none cursor-pointer"
        >
          {allYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-[340px]">
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9CA3AF" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#1F2937" stopOpacity={1} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />

            <YAxis
              domain={[0, 110]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="#053F53"
              dot={false}
              activeDot={{ r: 6, fill: "#053F53" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
