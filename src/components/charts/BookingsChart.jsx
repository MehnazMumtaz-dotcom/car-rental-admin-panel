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
import { FiCalendar } from "react-icons/fi";

const BookingChart = ({ weekRange }) => {
  const [isWeek, setIsWeek] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!weekRange?.start) return;

    // convert "20 May 2025" → Date
    const startDate = new Date(weekRange.start);

    let generated = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);

      generated.push({
        day: d.getDate(),
        fullDate: d.toDateString(),
        bookings: Math.floor(Math.random() * 100) + 20, // 🔥 dummy dynamic data
      });
    }

    setData(generated);
  }, [weekRange]);

  const monthData = [
    { day: 1, bookings: 20 },
    { day: 5, bookings: 40 },
    { day: 10, bookings: 60 },
    { day: 15, bookings: 50 },
    { day: 20, bookings: 80 },
    { day: 25, bookings: 70 },
    { day: 30, bookings: 95 },
  ];

  const chartData = isWeek ? data : monthData;

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
          className="text-xs px-3 py-1 rounded-lg border border-borderColor text-textSecondary hover:bg-surfaceHover transition"
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
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
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