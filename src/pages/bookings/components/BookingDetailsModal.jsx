import React from "react";
import Button from "../../../components/ui/Button";
import StatusBadge from "../../../components/ui/StatusBadge";


const formatDateTime = (date) => {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleString();
  } catch {
    return "N/A";
  }
};

const BookingDetailsModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const customerName =
    booking.customer?.name ||
    booking.customerName ||
    booking.name ||
    "Walk-in Customer";


  const vehicleName =
    booking.vehicle?.name ||
    booking.vehicleName ||
    booking.vehicle ||
    "N/A";

 
  const startDate = booking.startDate || booking.start;
  const endDate = booking.endDate || booking.end;

  return (
    <div className="fixed inset-0 bg-secondary/50 flex items-center justify-center z-50">

      <div className="bg-surface text-textPrimary border border-borderColor w-[400px] rounded-xl shadow-card p-6">

        <h2 className="text-xl font-semibold mb-4">
          Booking Details
        </h2>

        <div className="space-y-2 text-sm">

          <p><strong>Customer:</strong> {customerName}</p>

          <p><strong>Vehicle:</strong> {vehicleName}</p>

          <p>
            <strong>Start:</strong>{" "}
            {formatDateTime(startDate)}
          </p>

          <p>
            <strong>End:</strong>{" "}
            {formatDateTime(endDate)}
          </p>

          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <StatusBadge status={booking.status || "Pending"} />
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