import React, { useState } from "react";
import CalendarToolbar from "./components/CalendarToolbar";
import CalendarView from "./components/CalendarView";
import BookingForm from "./components/BookingForm";
import BookingDrawer from "./components/BookingDrawer";

export default function BookingList() {

  const [filters, setFilters] = useState({});
  const [view, setView] = useState("month");
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [bookings, setBookings] = useState([
  {
    id: 1,
    name: "Ali Raza",
    vehicle: "Corolla",
    city: "Lahore",
    startDate: "2026-07-01",
    endDate: "2026-07-04",
    pickupTime: "10:00",
    dropoffTime: "18:00",
    phone: "03001234567",
    cnic: "35202-1234567-1",
    price: 15000,
    advance: 5000,
    remaining: 10000,
    paymentMethod: "Cash",
    status: "Ongoing",
    notes: "VIP customer"
  },
  {
    id: 2,
    name: "Usman Ahmed",
    vehicle: "Swift",
    city: "Karachi",
    startDate: "2026-07-06",
    endDate: "2026-07-10",
    pickupTime: "09:00",
    dropoffTime: "17:00",
    phone: "03111234567",
    cnic: "42101-7654321-2",
    price: 20000,
    advance: 8000,
    remaining: 12000,
    paymentMethod: "Bank Transfer",
    status: "Upcoming",
    notes: "First time customer"
  },
  {
    id: 3,
    name: "Bilal Khan",
    vehicle: "Civic",
    city: "Karachi",
    startDate: "2026-07-12",
    endDate: "2026-07-15",
    pickupTime: "11:00",
    dropoffTime: "16:00",
    phone: "03211234567",
    cnic: "42101-9999999-1",
    price: 18000,
    advance: 6000,
    remaining: 12000,
    paymentMethod: "Cash",
    status: "Upcoming",
    notes: "Regular client"
  },

  {
    id: 4,
    name: "Ahmed Raza",
    vehicle: "Corolla", 
    city: "Islamabad",
    startDate: "2026-07-03", 
    endDate: "2026-07-05",
    pickupTime: "10:00",
    dropoffTime: "15:00",
    phone: "03331234567",
    cnic: "61101-1234567-3",
    price: 14000,
    advance: 4000,
    remaining: 10000,
    paymentMethod: "Cash",
    status: "Upcoming",
    notes: "Clash booking test"
  },

  {
    id: 5,
    name: "Hassan Ali",
    vehicle: "Sportage",
    city: "Multan",
    startDate: "2026-08-05",
    endDate: "2026-08-08",
    pickupTime: "09:30",
    dropoffTime: "18:30",
    phone: "03451234567",
    cnic: "36102-7654321-5",
    price: 25000,
    advance: 10000,
    remaining: 15000,
    paymentMethod: "Bank Transfer",
    status: "Upcoming",
    notes: "Outstation booking"
  }
]);
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
      city: "",
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
      id: Date.now()
    };

    fullBooking.remaining = fullBooking.price - fullBooking.advance;

    const hasClash = checkBookingClash(fullBooking);

    if (hasClash && !force) {
      const confirmOverride = window.confirm(
        "⚠️ This booking conflicts with an existing booking. Force add?"
      );

      if (!confirmOverride) return;

      handleSaveBooking(fullBooking, true);
      return;
    }

    setBookings((prev) => [...prev, fullBooking]);
  };
  const handleUpdateBooking = (updatedBooking, force = false) => {

    updatedBooking.remaining =
      updatedBooking.price - updatedBooking.advance;

    const hasClash = checkBookingClash(updatedBooking, updatedBooking.id);

    if (hasClash && !force) {
      const confirmOverride = window.confirm(
        "⚠️ This update causes a booking conflict. Force update?"
      );

      if (!confirmOverride) return;

      handleUpdateBooking(updatedBooking, true);
      return;
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === updatedBooking.id ? updatedBooking : b
      )
    );

    setEditingBooking(null);
    setShowForm(false);
  };

  const handleDeleteBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setSelectedBooking(null);
  };

  return (
    <div className="p-2 sm:p-4 bg-gray-100 min-h-screen">

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

    </div>
  );
}
