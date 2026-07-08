import React, { useMemo, useState } from "react";
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
import { useBookingStore } from "../../../store/bookingStore";
import { useAuthStore } from "../../../store/authStore";

// NOTE: this used to show revenue across ALL cities (Karachi/Lahore/
// Islamabad/Multan) side by side, which broke multi-tenancy - an admin
// scoped to one city should never see another tenant's revenue. Since an
// admin only ever has one city, this now breaks their own city's revenue
// down by vehicle instead.
export default function RevenueByCityChart() {
  const [active, setActive] = useState("weekly");
  const [open, setOpen] = useState(false);

  const bookings = useBookingStore((s) => s.bookings);
  const adminCity = useAuthStore((s) => s.user?.city);

  const cityBookings = useMemo(
    () => bookings.filter((b) => !adminCity || b.city === adminCity),
    [bookings, adminCity]
  );

  const buildByVehicle = (rangeDays) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - rangeDays);

    const inRange = cityBookings.filter((b) => new Date(b.startDate) >= cutoff);

    const totals = {};
    inRange.forEach((b) => {
      totals[b.vehicle] = (totals[b.vehicle] || 0) + (Number(b.price) || 0);
    });

    return Object.entries(totals).map(([vehicle, value]) => ({
      city: vehicle, // keeping the "city" key so the chart's dataKey below still works
      value,
    }));
  };

  const weeklyData = useMemo(() => buildByVehicle(7), [cityBookings]);
  const monthlyData = useMemo(() => buildByVehicle(30), [cityBookings]);

  const data = active === "weekly" ? weeklyData : monthlyData;

  return (
    <div className="bg-surface p-3 sm:p-4 md:p-6 rounded-2xl border border-borderColor shadow-card w-full">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">

        <div className="flex items-center gap-2 font-semibold text-textPrimary text-sm sm:text-base">
          <BarChart3 size={18} className="text-primary" />
          Revenue by Vehicle {adminCity ? `— ${adminCity}` : ""}
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
              formatter={(v) => [`PKR ${v.toLocaleString()}`, "Revenue"]}
            />

            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              fill="#3b82f6"
              barSize={22}
            />

          </BarChart>
        </ResponsiveContainer>

        {data.length === 0 && (
          <p className="text-center text-sm text-textSecondary -mt-32">
            No revenue in this range yet.
          </p>
        )}
      </div>
    </div>
  );
}