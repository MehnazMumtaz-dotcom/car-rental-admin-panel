import { useState, useMemo } from "react";
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
import { FiCalendar } from "react-icons/fi";
import { useBookingStore } from "../../store/bookingStore";
import { useAuthStore } from "../../store/authStore";

const BookingChart = ({ weekRange }) => {
  const [isWeek, setIsWeek] = useState(true);
  const allBookings = useBookingStore((s) => s.bookings);
  const adminCity = useAuthStore((s) => s.user?.city);

  const cityBookings = useMemo(
    () => allBookings.filter((b) => !adminCity || b.city === adminCity),
    [allBookings, adminCity]
  );

  const weekData = useMemo(() => {
    if (!weekRange?.start) return [];

    const startDate = new Date(weekRange.start);
    const generated = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split("T")[0];

      const count = cityBookings.filter((b) => b.startDate === iso).length;

      generated.push({
        day: d.getDate(),
        fullDate: d.toDateString(),
        bookings: count,
      });
    }

    return generated;
  }, [weekRange, cityBookings]);

  const monthData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const generated = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const count = cityBookings.filter((b) => b.startDate === iso).length;
      generated.push({ day, bookings: count });
    }
    return generated;
  }, [cityBookings]);

  const chartData = isWeek ? weekData : monthData;

  return (
    <div className="bg-surface p-5 rounded-xl shadow-card h-80 flex flex-col border border-borderColor">

      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-2">
          <FiCalendar className="text-primary" />
          <h3 className="text-textPrimary font-semibold">
            Booking Volume
          </h3>
        </div>

        <button
          onClick={() => setIsWeek(!isWeek)}
          className="text-xs px-3 py-1 rounded-lg border border-borderColor text-textSecondary hover:bg-background transition"
        >
          {isWeek ? "This Week" : "This Month"}
        </button>

      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>

            <CartesianGrid stroke="#eef2f7" strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="day"
              tickFormatter={(value) => `${value}`}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8", dy: 8 }}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-surface border border-borderColor rounded-lg px-3 py-2 text-xs shadow-card">
                      <p className="text-textSecondary mb-1">
                        {payload[0].payload.fullDate || `Day ${payload[0].payload.day}`}
                      </p>
                      <p className="text-textPrimary font-medium">
                        Bookings: {payload[0].value}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <defs>
              <linearGradient id="bookingFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="bookings"
              stroke="none"
              fill="url(#bookingFill)"
            />

            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#22c55e" }}
              activeDot={{ r: 6 }}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingChart;