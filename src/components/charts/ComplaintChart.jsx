import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertCircle } from "lucide-react";
import api from "../../services/api";

const COLORS = {
  onTrack: "#22c55e",
  atRisk: "#f59e0b",
  breached: "#ef4444",
  completed: "#9ca3af",
};

const ComplaintChart = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchComplaintSummary = async () => {
      try {
        const res = await api.get(
          "/dashboard/complaint-summary"
        );

        const chartData = [
          {
            name: "On Track",
            value: res.data.onTrack || 0,
            color: COLORS.onTrack,
          },
          {
            name: "At Risk",
            value: res.data.atRisk || 0,
            color: COLORS.atRisk,
          },
          {
            name: "Breached",
            value: res.data.breached || 0,
            color: COLORS.breached,
          },
          {
            name: "Completed",
            value: res.data.completed || 0,
            color: COLORS.completed,
          },
        ];

        setData(chartData);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.log("Error:", err);
      }
    };

    fetchComplaintSummary();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-4 w-full h-[300px] flex flex-col">
      
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle size={18} />
        <h2 className="font-semibold text-sm">Complaint Summary</h2>
      </div>

      <div className="flex flex-col md:flex-row flex-1 items-center justify-between gap-4">
        <div className="relative w-full md:w-[55%] h-[200px] md:h-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={50}   
                outerRadius={75}   
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-gray-500">Total</span>
            <span className="text-base font-bold">{total}</span>
          </div>
        </div>

        <div className="w-full md:w-[45%] flex flex-col gap-2 text-sm">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: item.color }}
                ></span>
                <span>{item.name}</span>
              </div>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ComplaintChart;