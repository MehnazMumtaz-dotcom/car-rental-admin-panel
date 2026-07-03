import React from "react";
import Button from "../../../components/ui/Button";

export default function CalendarToolbar({
  view,
  onPrev,
  onNext,
  onToday,
  currentDate,
}) {
  // ✅ Month + Year format
  const monthYear = currentDate?.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-2 flex-wrap">
      
      {/* 🔹 Navigation Buttons */}
      <Button variant="outline" onClick={onPrev}>
        {"<"}
      </Button>

      <Button variant="outline" onClick={onNext}>
        {">"}
      </Button>

      <Button variant="outline" onClick={onToday}>
        Today
      </Button>

      {/* 🔹 Month Display */}
      <span className="ml-4 font-semibold text-gray-700">
        {monthYear}
      </span>

      {/* 🔹 View Label (existing concept preserved) */}
      <span className="ml-2 text-sm text-gray-500 capitalize">
        ({view} view)
      </span>
    </div>
  );
}