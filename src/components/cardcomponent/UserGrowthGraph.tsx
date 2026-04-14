import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";
import { useGetUserGrowthQuery } from "../../rtkquery/page/dashboadApi";

/* ===== Types ===== */
type Props = {
  graphtext: string;
};

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

export default function UserGrowthGraph({ graphtext }: Props) {
  const CURRENT_YEAR = new Date().getFullYear();
  const START_YEAR = CURRENT_YEAR - 4;
  const END_YEAR = CURRENT_YEAR + 2;

  const [year, setYear] = useState(CURRENT_YEAR);

  /* ===== API Call ===== */
  const { data, isLoading } = useGetUserGrowthQuery(year);

  /* ===== Year List ===== */
  const allYears = useMemo(() => {
    const years = [];
    for (let y = START_YEAR; y <= END_YEAR; y++) {
      years.push(y);
    }
    return years;
  }, []);

  /* ===== Chart Data from API ===== */
  const chartData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item) => ({
      month: item.label,
      value: item.count,
    }));
  }, [data]);

  /* ===== Max Y-axis value ===== */
  const maxValue = useMemo(() => {
    if (!chartData.length) return 10;
    const max = Math.max(...chartData.map((d) => d.value));
    return max <= 0 ? 10 : Math.ceil(max * 1.2);
  }, [chartData]);

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
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading...
          </div>
        ) : (
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
                domain={[0, maxValue]}
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
        )}
      </div>
    </div>
  );
}
