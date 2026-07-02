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
    <div className="p-3 sm:p-4 md:p-6">

      {/* HEADER */}
      <div className="bg-surface border border-borderColor rounded-xl p-3 sm:p-4 
      flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 md:mb-6">

        {/* LEFT SIDE */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

          {/* FILTER */}
          <div className="w-full sm:w-56">
            <VehicleFilter
              value={selectedCar}
              onChange={setSelectedCar}
            />
          </div>

          {/* VIEW BUTTONS */}
          <div className="flex w-full sm:w-auto gap-2">
            <Button
              className="flex-1 sm:flex-none"
              variant={view === "monthly" ? "primary" : "outline"}
              onClick={() => setView("monthly")}
            >
              Monthly
            </Button>

            <Button
              className="flex-1 sm:flex-none"
              variant={view === "weekly" ? "primary" : "outline"}
              onClick={() => setView("weekly")}
            >
              Weekly
            </Button>
          </div>
        </div>

        {/* RIGHT SIDE (Toolbar) */}
        <div className="w-full lg:w-auto overflow-x-auto">
          <CalendarToolbar
            view={view}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={handleToday}
            currentDate={currentDate}
          />
        </div>
      </div>

      {/* CALENDAR */}
      <div className="bg-surface border border-borderColor rounded-xl 
      p-3 sm:p-4 md:p-6 
      min-h-[400px] sm:min-h-[450px] md:min-h-[500px] 
      overflow-x-auto">

        <CalendarView
          currentDate={currentDate}
          view={view}
        />
      </div>
    </div>
  );
}