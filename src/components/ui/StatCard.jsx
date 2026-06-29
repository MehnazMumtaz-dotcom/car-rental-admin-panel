import React from "react";
import { Users, DollarSign, Calendar, AlertCircle } from "lucide-react";

const StatCard = ({ title, value, previousValue = 0, icon, color }) => {
  const current = Number(value) || 0;
  const prev = Number(previousValue) || 0;

  let change = 0;
  if (prev > 0) {
    change = ((current - prev) / prev) * 100;
  }

  const isPositive = change >= 0;

  const formatValue = () => {
    if (title.toLowerCase().includes("revenue")) {
      return `PKR ${current.toLocaleString()}`;
    }
    return current.toLocaleString();
  };

  const colors = {
    blue: "bg-primary/10 text-primary",
    green: "bg-success/10 text-success",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-danger/10 text-danger",
  };

  const selectedColor = colors[color] || colors.blue;

  const icons = {
    users: Users,
    revenue: DollarSign,
    bookings: Calendar,
    complaints: AlertCircle,
  };

  const Icon = icons[icon] || Users;

  return (
    <div className="
      bg-surface border border-border rounded-xl p-4 sm:p-5
      shadow-card hover:shadow-md transition w-full
    ">

      {/* TOP */}
      <div className="
        flex items-center gap-3
        flex-col sm:flex-row
        text-center
      ">
        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${selectedColor}`}>
          <Icon size={18} />
        </div>

        <p className="text-sm text-textSecondary font-medium">
          {title}
        </p>
      </div>

      {/* VALUE (STRICT CENTER) */}
      <div className="flex justify-center mt-4">
        <h3 className="text-lg sm:text-xl font-semibold text-textPrimary text-center">
          {formatValue()}
        </h3>
      </div>

      {/* % CHANGE (ALSO CENTERED) */}
      <p
        className={`
          text-sm mt-2 font-medium text-center
          ${isPositive ? "text-success" : "text-danger"}
        `}
      >
        {isPositive ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
        <span className="text-textSecondary font-normal ml-1">
          Last 7 days
        </span>
      </p>
    </div>
  );
};

export default StatCard;