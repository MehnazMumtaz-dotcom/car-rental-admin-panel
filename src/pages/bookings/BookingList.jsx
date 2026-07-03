import React, { useState } from "react";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import CalendarToolbar from "./components/CalendarToolbar";
import VehicleFilter from "./components/VehicleFilter";
import CalendarView from "./components/CalendarView";

export default function BookingList() {
  const [view, setView] = useState("monthly");
  const [selectedCar, setSelectedCar] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === "monthly") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === "monthly") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="p-6 pt-0"> {/* 🔥 TOP PADDING REMOVE */}
      
      {/* 🔹 FILTER BAR */}
      <div className="bg-white border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        
        {/* Left Side Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          
          {/* 🚗 Car Select */}
          <div className="w-full sm:w-56">
            <VehicleFilter
              value={selectedCar}
              onChange={setSelectedCar}
            />
          </div>

          {/* 📆 View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={view === "monthly" ? "primary" : "outline"}
              onClick={() => setView("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={view === "weekly" ? "primary" : "outline"}
              onClick={() => setView("weekly")}
            >
              Weekly
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <CalendarToolbar
          view={view}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          currentDate={currentDate}
        />
      </div>

      {/* 🔹 CALENDAR */}
      <div className="bg-white border rounded-lg p-6 min-h-[500px]">
        <CalendarView
          currentDate={currentDate}
          view={view}
        />
      </div>
    </div>
  );
}