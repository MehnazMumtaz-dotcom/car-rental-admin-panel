import React, { useState } from "react";
import CalendarToolbar from "./components/CalendarToolbar";
import VehicleFilter from "./components/VehicleFilter";
import CalendarView from "./components/CalendarView";
import BookingDrawer from "./components/BookingDrawer";
import ConflictModal from "./components/ConflictModal";
import BookingForm from "./components/BookingForm";
import useBookingStore from "../../store/BookingStore";

export default function BookingCalendar() {
  const [view, setView] = useState("monthly");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [showConflict, setShowConflict] = useState(false);
  const [pendingBooking, setPendingBooking] = useState(null);

  const { addBooking } = useBookingStore();

  return (
    <div className="flex w-full h-full gap-4 p-4">
      
      <VehicleFilter />

      <div className="flex flex-col flex-1 gap-4">

        <CalendarToolbar
          view={view}
          setView={setView}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          onAddBooking={() => setPendingBooking({})} 
        />

        <CalendarView
          view={view}
          currentDate={currentDate}
          onBookingClick={setSelectedBooking}
        />
      </div>

      <BookingDrawer
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
      {pendingBooking && (
        <BookingForm
          onClose={() => setPendingBooking(null)}
          onConflict={(data) => {
            setPendingBooking(data);
            setShowConflict(true);
          }}
        />
      )}

      <ConflictModal
        open={showConflict}
        onClose={() => setShowConflict(false)}
        onConfirm={() => {
          addBooking({ ...pendingBooking, override: true }); // 💥 FORCE SAVE
          setShowConflict(false);
          setPendingBooking(null);
        }}
      />
    </div>
  );
}