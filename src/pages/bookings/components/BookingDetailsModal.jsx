import React from "react";
import Button from "../../../Components/UI/Button";
import StatusBadge from "../../../Components/UI/StatusBadge";

const BookingDetailsModal = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-[400px] rounded-xl shadow-lg p-6">

        <h2 className="text-xl font-semibold mb-4">
          Booking Details
        </h2>

        <div className="space-y-2 text-sm">

          <p><strong>Customer:</strong> {booking.customerName}</p>

          <p><strong>Vehicle:</strong> {booking.vehicleName}</p>

          <p>
            <strong>Start:</strong>{" "}
            {new Date(booking.start).toLocaleString()}
          </p>

          <p>
            <strong>End:</strong>{" "}
            {new Date(booking.end).toLocaleString()}
          </p>

          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <StatusBadge status={booking.status} />
          </div>

        </div>

        <div className="mt-5">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>

      </div>
    </div>
  );
};

export default BookingDetailsModal;