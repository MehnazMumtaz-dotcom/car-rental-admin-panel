import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function StatCard({
  title,
  value,
  current = 0,
  lastWeek = 0,
  percentage = 0, // ✅ ADD
  icon: Icon,
  iconBg,
  iconColor,
}) {
  const isUp = percentage >= 0;

  return (
    <div className="
      bg-surface border border-borderColor rounded-xl shadow-card 
      p-4 sm:p-5 
      flex flex-col 
      h-full
    ">
      
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`p-2 sm:p-3 rounded-full ${iconBg}`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
        </div>
        <p className="text-xs sm:text-sm text-textSecondary font-semibold">
          {title}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center py-2 sm:py-3">
        <h2 className="
          text-xl sm:text-2xl 
          font-semibold 
          text-textPrimary
        ">
          {value}
        </h2>
      </div>

   <div
  className={`
    flex items-center gap-1 
    text-[10px] sm:text-xs font-normal
    ${isUp ? "text-success" : "text-danger"}
  `}
>
  {isUp ? (
    <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
  ) : (
    <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />
  )}

  <span>
    {Math.abs(percentage).toFixed(1)}% {isUp ? "growth" : "decline"} · Last 7 days
  </span>
</div>
    </div>
  );
}