import React, { useMemo, useState } from "react";
import CalendarToolbar from "./components/CalendarToolbar";
import CalendarView from "./components/CalendarView";
import BookingForm from "./components/BookingForm";
import BookingDrawer from "./components/BookingDrawer";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useBookingStore } from "../../store/bookingStore";
import { useAuthStore } from "../../store/authStore";

export default function BookingList() {

  const [filters, setFilters] = useState({});
  const [view, setView] = useState("month");
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [pendingClash, setPendingClash] = useState(null);

  const allBookings = useBookingStore((s) => s.bookings);
  const addBooking = useBookingStore((s) => s.addBooking);
  const updateBookingInStore = useBookingStore((s) => s.updateBooking);
  const deleteBookingInStore = useBookingStore((s) => s.deleteBooking);
  const adminCity = useAuthStore((s) => s.user?.city);
  const bookings = useMemo(
    () => allBookings.filter((b) => !adminCity || b.city === adminCity),
    [allBookings, adminCity]
  );

  const checkBookingClash = (newBooking, ignoreId = null) => {
    return bookings.some((b) => {
      if (ignoreId && b.id === ignoreId) return false;

      return (
        b.vehicle === newBooking.vehicle &&
        newBooking.startDate <= b.endDate &&
        newBooking.endDate >= b.startDate
      );
    });
  };

  const handleSaveBooking = (newBooking, force = false) => {

    const fullBooking = {
      name: "",
      vehicle: "",
      city: adminCity || "",
      startDate: "",
      endDate: "",
      pickupTime: "",
      dropoffTime: "",
      phone: "",
      cnic: "",
      price: 0,
      advance: 0,
      remaining: 0,
      paymentMethod: "",
      status: "Upcoming",
      notes: "",
      ...newBooking,
      id: Date.now(),
    };

    fullBooking.remaining = fullBooking.price - fullBooking.advance;

    const hasClash = checkBookingClash(fullBooking);

    if (hasClash && !force) {
      setPendingClash({ type: "create", booking: fullBooking });
      return;
    }

    addBooking(fullBooking);
  };

  const handleUpdateBooking = (updatedBooking, force = false) => {

    updatedBooking.remaining =
      updatedBooking.price - updatedBooking.advance;

    const hasClash = checkBookingClash(updatedBooking, updatedBooking.id);

    if (hasClash && !force) {
      setPendingClash({ type: "update", booking: updatedBooking });
      return;
    }

    updateBookingInStore(updatedBooking);

    setEditingBooking(null);
    setShowForm(false);
  };

  const handleDeleteBooking = (id) => {
    deleteBookingInStore(id);
    setSelectedBooking(null);
  };

  const handleConfirmClash = () => {
    if (!pendingClash) return;
    if (pendingClash.type === "create") {
      handleSaveBooking(pendingClash.booking, true);
    } else {
      handleUpdateBooking(pendingClash.booking, true);
    }
    setPendingClash(null);
  };

  return (
    <div className="p-2 sm:p-4 bg-background min-h-screen">

      <CalendarToolbar
        onFilter={setFilters}
        onViewChange={setView}
        onOpenForm={() => {
          setEditingBooking(null);
          setShowForm(true);
        }}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        view={view}
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
      />

      {showForm && (
        <BookingForm
          onClose={() => {
            setShowForm(false);
            setEditingBooking(null);
          }}
          onSave={handleSaveBooking}
          onUpdate={handleUpdateBooking}
          editingBooking={editingBooking}
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
        />
      )}

      <ConfirmDialog
        open={!!pendingClash}
        title="Booking Conflict"
        message={
          pendingClash?.type === "create"
            ? "This booking conflicts with an existing booking for the same vehicle. Force add anyway?"
            : "This update causes a booking conflict for the same vehicle. Force update anyway?"
        }
        confirmText="Force Continue"
        onConfirm={handleConfirmClash}
        onCancel={() => setPendingClash(null)}
      />

    </div>
  );
}