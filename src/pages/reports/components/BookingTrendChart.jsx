import React, { useEffect, useState } from "react";

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

import { useReportStore } from "../../../store/reportStore";


export default function BookingTrendChart() {

  const [active, setActive] = useState("weekly");
  const [open, setOpen] = useState(false);
const {
  bookingTrend,
  fetchBookingTrend,
} = useReportStore();


useEffect(() => {

  fetchBookingTrend(active);

}, [active]);
console.log("ACTIVE:", active);
console.log("BOOKING TREND:", bookingTrend);
  const data = (bookingTrend || []).map((item) => ({
  date: item.label,
  value: item.value,
}));



  return (
    <div className="bg-surface p-3 sm:p-4 md:p-6 rounded-2xl border border-borderColor shadow-card w-full">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">

        <div className="flex items-center gap-2 font-semibold text-textPrimary text-sm sm:text-base">
          <Calendar size={18} className="text-primary" />
          Booking Trend
        </div>


        <div className="relative w-full sm:w-auto">

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between w-full sm:w-auto gap-2 px-3 sm:px-4 py-2 bg-background hover:bg-borderColor rounded-md text-sm text-textSecondary transition"
          >

            {active === "weekly" ? "Weekly" : "Monthly"}

            <ChevronDown size={16} />

          </button>


          {open && (

            <div className="absolute right-0 mt-2 w-full sm:w-28 bg-surface border border-borderColor rounded-md shadow-card z-10">


              {active === "weekly" && (

                <div
                  onClick={() => {
                    setActive("monthly");
                    setOpen(false);
                  }}

                  className="px-3 py-2 text-sm text-textPrimary hover:bg-background cursor-pointer"
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

                  className="px-3 py-2 text-sm text-textPrimary hover:bg-background cursor-pointer"
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
              allowDecimals={false}
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