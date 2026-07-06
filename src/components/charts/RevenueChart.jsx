import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  CartesianGrid,
} from "recharts";

const RevenueChart = ({ weekRange }) => {
  const [isWeek, setIsWeek] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!weekRange?.start) return;

    const startDate = new Date(weekRange.start);

    let generated = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);

      generated.push({
        day: d.getDate(),
        fullDate: d.toDateString(),
        revenue: Math.floor(Math.random() * 300000) + 100000,
      });
    }

    setData(generated);
  }, [weekRange]);

  const monthData = [
    { day: 1, revenue: 100000 },
    { day: 5, revenue: 180000 },
    { day: 10, revenue: 260000 },
    { day: 15, revenue: 220000 },
    { day: 20, revenue: 350000 },
    { day: 25, revenue: 300000 },
    { day: 30, revenue: 420000 },
  ];

  const chartData = isWeek ? data : monthData;

  const formatYAxis = (value) => `${value / 1000}K`;

  return (
    <div className="bg-surface p-4 sm:p-5 rounded-xl shadow-card h-80 flex flex-col border border-borderColor">

      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-textPrimary font-semibold text-sm sm:text-base">
          Revenue (PKR)
        </h3>

        <button
          onClick={() => setIsWeek(!isWeek)}
          className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-lg border border-borderColor text-textSecondary hover:bg-surfaceHover transition"
        >
          {isWeek ? "This Week" : "This Month"}
        </button>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              stroke="#eef2f7"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tickFormatter={(value) => `${value}`}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              dy={6}
            />


            <YAxis
              tickFormatter={formatYAxis}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              width={30} 
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-sm">
                      <p className="text-gray-500 mb-1">
                        {payload[0].payload.fullDate}
                      </p>
                      <p className="text-black font-medium">
                        Revenue: PKR {payload[0].value.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

  
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="none"
              fill="url(#revenueFill)"
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ r: 2 }} 
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;