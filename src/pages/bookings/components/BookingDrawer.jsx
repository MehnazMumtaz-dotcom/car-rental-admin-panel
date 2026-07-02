import React from "react";
import { X } from "lucide-react";
import useBookingStore from "../../../store/bookingStore";
import Button from "../../../components/ui/Button";

export default function BookingDrawer() {
  const {
    isDrawerOpen,
    selectedBooking,
    closeDrawer,
    deleteBooking,
  } = useBookingStore();

  if (!isDrawerOpen || !selectedBooking) return null;

  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure to delete?");
    if (!confirmDelete) return;

    deleteBooking(selectedBooking.id);
    closeDrawer();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-50 p-5 flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Booking Details</h2>
          <button onClick={closeDrawer}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">

          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-medium">{selectedBooking.customerName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Car</p>
            <p className="font-medium">{selectedBooking.carName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium">{selectedBooking.startDate}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium">{selectedBooking.endDate}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                selectedBooking.status === "confirmed"
                  ? "bg-green-100 text-green-600"
                  : selectedBooking.status === "pending"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {selectedBooking.status}
            </span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 mt-4">
          <Button className="w-full">Edit</Button>
          <Button
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </>
  );
}