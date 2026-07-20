import { useEffect, useState } from "react";

import CalendarToolbar from "./components/CalendarToolbar";
import VehicleFilter from "./components/VehicleFilter";
import CalendarView from "./components/CalendarView";
import BookingDrawer from "./components/BookingDrawer";
import BookingForm from "./components/BookingForm";

import { useBookingStore } from "../../store/bookingStore";

const formatDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function BookingCalendar() {
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

  const bookings = useBookingStore((state) => state.bookings);
  const fetchBookings = useBookingStore((state) => state.fetchBookings);
  const addBooking = useBookingStore((state) => state.addBooking);
  const updateBooking = useBookingStore((state) => state.updateBooking);
  const deleteBooking = useBookingStore((state) => state.deleteBooking);
  const overrideBooking = useBookingStore((state) => state.overrideBooking);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const openCreateModal = (date) => {
    setEditingBooking(null);
    setInitialValues(date ? { startDate: formatDate(date), endDate: formatDate(date) } : null);
    setShowForm(true);
    setSelectedBooking(null);
  };

  const handleCreateBooking = async (booking) => {
    await addBooking(booking);
    setShowForm(false);
    setEditingBooking(null);
  };

  const handleUpdateBooking = async (booking) => {
    await updateBooking(booking);
    setShowForm(false);
    setEditingBooking(null);
  };

  const handleDeleteBooking = async (id) => {
    await deleteBooking(id);
    setSelectedBooking(null);
  };

  const handleOverrideBooking = async (booking) => {
    await overrideBooking(booking);
    setSelectedBooking(null);
  };

  return (
    <div className="flex w-full h-full gap-4 p-4">
      <VehicleFilter />

      <div className="flex flex-col flex-1 gap-4">
        <CalendarToolbar
          view={view}
          onViewChange={setView}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onOpenForm={() => openCreateModal(null)}
        />

        <CalendarView
          view={view}
          currentDate={currentDate}
          bookings={bookings}
          onBookingClick={setSelectedBooking}
          onEditBooking={(booking) => {
            setEditingBooking(booking);
            setShowForm(true);
          }}
          onDeleteBooking={handleDeleteBooking}
          onDayClick={(date) => openCreateModal(date)}
        />
      </div>

      <BookingDrawer
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onDelete={handleDeleteBooking}
        onEdit={(booking) => {
          setSelectedBooking(null);
          setEditingBooking(booking);
          setShowForm(true);
        }}
        onOverride={handleOverrideBooking}
      />

      {showForm && (
        <BookingForm
          editingBooking={editingBooking}
          onClose={() => {
            setShowForm(false);
            setEditingBooking(null);
            setInitialValues(null);
          }}
          onSave={handleCreateBooking}
          onUpdate={handleUpdateBooking}
          onOverride={handleOverrideBooking}
          initialValues={initialValues}
        />
      )}
    </div>
  );
}
