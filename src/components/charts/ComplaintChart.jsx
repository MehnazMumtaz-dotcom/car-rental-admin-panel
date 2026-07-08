import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertCircle } from "lucide-react";
import { useSLAStore, getComplaintStatus } from "../../store/SLAStore";
import { useAuthStore } from "../../store/authStore";

const STATUS_META = [
  { key: "on-track", name: "On Track", color: "#22c55e" },
  { key: "at-risk", name: "At Risk", color: "#f59e0b" },
  { key: "breached", name: "Breached", color: "#ef4444" },
];

const ComplaintChart = () => {
  const complaints = useSLAStore((s) => s.complaints);
  const adminCity = useAuthStore((s) => s.user?.city);

  const data = useMemo(() => {
    const now = Date.now();
    const active = complaints
      .filter((c) => !c.resolved)
      .filter((c) => !adminCity || c.city === adminCity)
      .map((c) => getComplaintStatus(c, now).status);

    return STATUS_META.map((s) => ({
      name: s.name,
      color: s.color,
      value: active.filter((status) => status === s.key).length,
    }));
  }, [complaints, adminCity]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-surface p-3 sm:p-4 rounded-xl shadow-card h-auto md:h-80 flex flex-col border border-borderColor">

      <div className="flex items-center gap-2 mb-3">
        <AlertCircle size={18} className="text-textPrimary shrink-0" />
        <h3 className="text-textPrimary font-semibold text-sm sm:text-base whitespace-nowrap">
          Complaint Status
        </h3>
      </div>

      <div className="flex flex-col md:flex-row flex-1 gap-4">


        <div className="w-full md:w-1/2 flex items-center justify-center relative">

          <div className="w-full h-[200px] sm:h-[240px] md:h-[260px] max-w-[260px] sm:max-w-[300px] lg:max-w-[340px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="90%"
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip formatter={(v, n) => [`${v}`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xl sm:text-2xl font-bold text-textPrimary whitespace-nowrap">
              {total}
            </span>
            <span className="text-[10px] sm:text-xs text-textSecondary whitespace-nowrap">
              Total
            </span>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-3 mt-2 md:mt-0 min-w-0">

          {data.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2"
            >

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />

                <span className="text-xs sm:text-sm text-textPrimary whitespace-nowrap truncate">
                  {item.name}
                </span>
              </div>

              <span className="text-xs sm:text-sm font-medium text-textPrimary shrink-0 whitespace-nowrap">
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
