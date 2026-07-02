import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertCircle } from "lucide-react";

const colors = ["#ef4444", "#f59e0b", "#22c55e", "#2563eb"];

const ComplaintChart = ({ weekRange }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!weekRange?.start) return;

    const generated = [
      { name: "Open", value: Math.floor(Math.random() * 20) + 5 },
      { name: "In Progress", value: Math.floor(Math.random() * 20) + 5 },
      { name: "Resolved", value: Math.floor(Math.random() * 20) + 5 },
      { name: "Escalated", value: Math.floor(Math.random() * 10) + 2 },
    ];

    setData(generated);
  }, [weekRange]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-surface p-4 rounded-xl shadow-card h-80 flex flex-col border border-borderColor">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle size={18} className="text-textPrimary" />
        <h3 className="text-textPrimary font-semibold">
          Complaint Status
        </h3>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col md:flex-row flex-1">

        {/* CHART SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative">

          {/* ✅ FIXED MOBILE HEIGHT */}
          <div className="w-full h-[220px] sm:h-[260px] max-w-[280px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="92%"
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={colors[i]} />
                  ))}
                </Pie>

                <Tooltip formatter={(v, n) => [`${v}`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* CENTER TOTAL */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-textPrimary">
              {total}
            </span>
            <span className="text-xs text-textSecondary">
              Total
            </span>
          </div>
        </div>

        {/* LEGEND SIDE */}
        <div className="w-full md:w-1/2 pl-0 md:pl-3 flex flex-col justify-center space-y-2 mt-3 md:mt-0">

          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between">

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: colors[i] }}
                />
                <span className="text-sm text-textPrimary truncate">
                  {item.name}
                </span>
              </div>

              <span className="text-sm font-medium text-textPrimary ml-3 shrink-0">
                {item.value}
              </span>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default ComplaintChart;