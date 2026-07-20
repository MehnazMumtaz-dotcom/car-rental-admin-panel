import { useEffect, useMemo, useState } from "react";

import CalendarToolbar from "./components/CalendarToolbar";
import CalendarView from "./components/CalendarView";
import BookingForm from "./components/BookingForm";
import BookingDrawer from "./components/BookingDrawer";

import { useBookingStore } from "../../store/bookingStore";
import { useAuthStore } from "../../store/authStore";

const toDateInputValue = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function BookingList() {
  const [filters, setFilters] = useState({});
  const [view, setView] = useState("month");
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);

  const allBookings = useBookingStore((s) => s.bookings);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const addBooking = useBookingStore((s) => s.addBooking);
  const updateBookingInStore = useBookingStore((s) => s.updateBooking);
  const deleteBookingInStore = useBookingStore((s) => s.deleteBooking);
  const overrideBookingInStore = useBookingStore((s) => s.overrideBooking);

  const adminCity = useAuthStore((s) => s.user?.city);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const bookings = useMemo(() => {
    return (allBookings || []).filter((b) => b && (!adminCity || b.city === adminCity));
  }, [allBookings, adminCity]);

  const handleSaveBooking = async (newBooking) => {
    if (!newBooking) return;

    await addBooking({
      ...newBooking,
      city: adminCity || newBooking.city || "",
    });

    setShowForm(false);
    setEditingBooking(null);
  };

  const handleUpdateBooking = async (updatedBooking) => {
    if (!updatedBooking) return;

    await updateBookingInStore({
      ...updatedBooking,
      city: adminCity || updatedBooking.city || "",
    });

    setEditingBooking(null);
    setShowForm(false);
  };

  const handleDeleteBooking = async (id) => {
    if (!id) return;

    await deleteBookingInStore(id);
    setSelectedBooking(null);
  };

  const handleOverrideBooking = async (booking) => {
    await overrideBookingInStore({
      ...booking,
      city: adminCity || booking.city || "",
    });
    setSelectedBooking(null);
  };

  return (
    <div className="p-2 sm:p-4 bg-background min-h-screen">
      <CalendarToolbar
        onFilter={setFilters}
        onViewChange={setView}
        onOpenForm={() => {
          setEditingBooking(null);
          setInitialValues(null);
          setShowForm(true);
        }}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        view={view}
        bookings={bookings}
      />

      <CalendarView
        filters={filters}
        bookings={bookings}
        view={view}
        currentDate={currentDate}
        onBookingClick={setSelectedBooking}
        onDeleteBooking={handleDeleteBooking}
        onEditBooking={(booking) => {
          setEditingBooking(booking);
          setShowForm(true);
        }}
          onDayClick={(date) => {
            setEditingBooking(null);
            const selectedDate = toDateInputValue(date);
            setInitialValues(
              selectedDate
                ? { startDate: selectedDate, endDate: selectedDate }
                : null
            );
            setShowForm(true);
          }}
      />

      {showForm && (
        <BookingForm
          onClose={() => {
            setShowForm(false);
            setEditingBooking(null);
            setInitialValues(null);
          }}
          onSave={handleSaveBooking}
          onUpdate={handleUpdateBooking}
          onOverride={handleOverrideBooking}
          editingBooking={editingBooking}
          initialValues={initialValues}
          bookings={bookings}
        />
      )}

      {selectedBooking && (
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
      )}
    </div>
  );
}
