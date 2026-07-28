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
import api from "../../services/api";

const RevenueChart = () => {
  const [isWeek, setIsWeek] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const type = isWeek ? "week" : "month";

        const res = await api.get(
          `/dashboard/revenue-trend?type=${type}`
        );

        console.log("Revenue Trend:", res.data);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.data || res.data.revenue || [];

        setChartData(
          data.map((item) => ({
            day: item.day || item.label || item.date,
            revenue:
              Number(
                item.revenue ||
                item.totalRevenue ||
                item.value ||
                0
              ),
            fullDate: item.date || item.label || "",
          }))
        );

      } catch (error) {
        console.log("Revenue Error:", error);
      }
    };

    fetchRevenue();
  }, [isWeek]);


  const formatYAxis = (value) => `${value / 1000}K`;

  return (
    <div className="bg-surface p-4 sm:p-5 rounded-xl shadow-card h-80 flex flex-col border border-borderColor">

      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-textPrimary font-semibold text-sm sm:text-base">
          Revenue (PKR)
        </h3>

        <button
          onClick={() => setIsWeek(!isWeek)}
          className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-lg border border-borderColor text-textSecondary hover:bg-background transition"
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
                    <div className="bg-surface border border-borderColor rounded-lg px-3 py-2 text-xs shadow-card">

                      <p className="text-textSecondary mb-1">
                        {payload[0].payload.fullDate ||
                          `Day ${payload[0].payload.day}`}
                      </p>

                      <p className="text-textPrimary font-medium">
                        Revenue: PKR{" "}
                        {Number(payload[0].value).toLocaleString()}
                      </p>

                    </div>
                  );
                }

                return null;
              }}
            />


            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">

                <stop
                  offset="0%"
                  stopColor="#22c55e"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="#22c55e"
                  stopOpacity={0}
                />

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