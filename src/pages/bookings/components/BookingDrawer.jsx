import React, { useState } from "react";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

export default function BookingDrawer({
  booking,
  onClose,
  onDelete,
  onEdit,
  onOverride
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOverrideConfirm, setShowOverrideConfirm] = useState(false);

  if (!booking) return null;

  const handleDeleteClick = () => setShowConfirm(true);

  const handleConfirmDelete = () => {
    onDelete?.(booking.id);
    setShowConfirm(false);
  };

  const handleOverrideClick = () => {
    setShowOverrideConfirm(true);
  };

  const handleConfirmOverride = () => {
    onOverride?.(booking);
    setShowOverrideConfirm(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-secondary/50 z-[999]"
        onClick={onClose}
      />

      <div
        className="
          fixed right-0 top-0 h-full
          w-full sm:w-[380px]
          bg-surface text-textPrimary shadow-card z-[1000]
          p-4 sm:p-5 overflow-y-auto
        "
      >

        <div className="flex justify-between items-center border-b border-borderColor pb-2 mb-4">
          <h2 className="text-base sm:text-lg font-bold">
            Booking Details
          </h2>
          <button
            onClick={onClose}
            className="text-lg sm:text-xl text-textSecondary hover:text-textPrimary"
          >
            ✖
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-textSecondary text-xs sm:text-sm">Customer</p>
            <p className="font-semibold">{booking.name}</p>
          </div>

          <div>
            <p className="text-textSecondary text-xs sm:text-sm">Vehicle</p>
            <p className="font-semibold">{booking.vehicle}</p>
          </div>

          <div>
            <p className="text-textSecondary text-xs sm:text-sm">City</p>
            <p className="font-semibold">{booking.city}</p>
          </div>

          <div>
            <p className="text-textSecondary text-xs sm:text-sm">Start Date</p>
            <p className="font-semibold">{booking.startDate}</p>
          </div>

          <div>
            <p className="text-textSecondary text-xs sm:text-sm">End Date</p>
            <p className="font-semibold">{booking.endDate}</p>
          </div>

          <div>
            <p className="text-textSecondary text-xs sm:text-sm">Status</p>
            <p className="font-semibold">{booking.status}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-2">

          <button
            onClick={() => onEdit?.(booking)}
            className="flex-1 bg-warning text-white py-2 rounded text-sm hover:opacity-90"
          >
            Edit
          </button>

          <button
            onClick={handleDeleteClick}
            className="flex-1 bg-danger text-white py-2 rounded text-sm hover:opacity-90"
          >
            Delete
          </button>

          <button
            onClick={handleOverrideClick}
            className="flex-1 bg-accent text-white py-2 rounded text-sm hover:opacity-90"
          >
            Override
          </button>

        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Delete Booking"
        message="Are you sure you want to delete this booking?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />

      {showOverrideConfirm && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-secondary/50 p-3">

          <div className="bg-surface text-textPrimary p-4 rounded shadow-card w-full max-w-[320px] border border-borderColor">

            <h3 className="font-bold text-lg mb-2">
              Override Booking
            </h3>

            <p className="text-sm text-textSecondary mb-4">
              This will override existing bookings and may cause conflicts. Continue?
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-2">

              <button
                onClick={() => setShowOverrideConfirm(false)}
                className="px-3 py-1 border border-borderColor text-textPrimary rounded text-sm hover:bg-background"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmOverride}
                className="px-3 py-1 bg-accent text-white rounded text-sm hover:opacity-90"
              >
                Confirm
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
