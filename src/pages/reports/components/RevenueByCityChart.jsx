import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BarChart3, ChevronDown } from "lucide-react";

export default function RevenueByCityChart() {
  const [active, setActive] = useState("weekly");
  const [open, setOpen] = useState(false);

  const weeklyData = [
    { city: "Karachi", value: 1200 },
    { city: "Lahore", value: 980 },
    { city: "Islamabad", value: 750 },
    { city: "Multan", value: 500 },
  ];

  const monthlyData = [
    { city: "Karachi", value: 5200 },
    { city: "Lahore", value: 4800 },
    { city: "Islamabad", value: 4100 },
    { city: "Multan", value: 3000 },
  ];

  const data = active === "weekly" ? weeklyData : monthlyData;

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-2xl border shadow-sm w-full">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">

        <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm sm:text-base">
          <BarChart3 size={18} className="text-blue-600" />
          Revenue by City
        </div>

        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between w-full sm:w-auto gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition"
          >
            {active === "weekly" ? "Weekly" : "Monthly"}
            <ChevronDown size={16} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-full sm:w-28 bg-white border rounded-md shadow-md z-10">

              {active === "weekly" && (
                <div
                  onClick={() => {
                    setActive("monthly");
                    setOpen(false);
                  }}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  Monthly
                </div>
              )}

              {active === "monthly" && (
                <div
                  onClick={() => {
                    setActive("weekly");
                    setOpen(false);
                  }}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  Weekly
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[200px] sm:h-[240px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%">

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="city"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            />

            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              fill="#3b82f6"
              barSize={22}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}