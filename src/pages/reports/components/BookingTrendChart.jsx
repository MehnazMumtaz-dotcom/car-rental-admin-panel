import React, { useState } from "react";

import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { Calendar, ChevronDown } from "lucide-react";

export default function BookingTrendChart() {
  const [active, setActive] = useState("weekly");
  const [open, setOpen] = useState(false);

  const weeklyData = [
    { date: "29 Jun", value: 120 },
    { date: "30 Jun", value: 105 },
    { date: "01 Jul", value: 90 },
    { date: "02 Jul", value: 40 },
    { date: "03 Jul", value: 120 },
    { date: "04 Jul", value: 115 },
    { date: "05 Jul", value: 100 },
  ];

  const monthlyData = [
    { date: "W1", value: 400 },
    { date: "W2", value: 550 },
    { date: "W3", value: 480 },
    { date: "W4", value: 600 },
  ];

  const data = active === "weekly" ? weeklyData : monthlyData;

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-2xl border shadow-sm w-full">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">

        <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm sm:text-base">
          <Calendar size={18} className="text-blue-600" />
          Booking Trend
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

      <div className="w-full h-[200px] sm:h-[240px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>

            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="date"
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

            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#blueGradient)"
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}