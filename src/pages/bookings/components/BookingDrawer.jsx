import { useState } from "react";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

const formatDate = (date) => {
  if (!date) return "N/A";

  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date)) {
    return date.slice(0, 10);
  }

  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "N/A";

  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-textSecondary">{label}</p>
    <p className="font-semibold break-words">{value || "N/A"}</p>
  </div>
);

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

  const startDate = formatDate(
    booking.startDate || booking.start
  );

  const endDate = formatDate(
    booking.endDate || booking.end
  );

  const phone = booking.phone || booking.customer?.phone || "N/A";
  const cnic = booking.cnic || booking.customer?.cnic || "N/A";
  const pickupTime = booking.pickupTime || "N/A";
  const dropTime = booking.dropTime || booking.dropoffTime || "N/A";
  const paymentStatus = booking.paymentStatus || "PENDING";
  const status = booking.status || "ACTIVE";
  const notes = booking.notes || "N/A";

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await onDelete?.(booking.id);

      setShowConfirm(false);
      onClose?.();
      window.dispatchEvent(new Event("bookingUpdated"));
    } catch (error) {
      console.error("Delete booking error:", error);
    }
  };

  const handleOverrideClick = () => {
    setShowOverrideConfirm(true);
  };

  const handleConfirmOverride = async () => {
    try {
      await onOverride?.({
        ...booking,
        forceOverride: true,
        isOverride: true,
      });

      setShowOverrideConfirm(false);
      onClose?.();
      window.dispatchEvent(new Event("bookingUpdated"));
    } catch (err) {
      console.error("Override failed", err);
    }
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-secondary/50 z-[900]"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div
        className="
          fixed right-0 top-0
          h-full
          w-full sm:w-[380px]
          bg-surface
          text-textPrimary
          shadow-card
          z-[1000]
          p-4 sm:p-5
          overflow-y-auto
        "
      >

        <div className="
          flex 
          justify-between 
          items-center 
          border-b 
          border-borderColor 
          pb-3 
          mb-4
        ">

          <h2 className="text-lg font-bold">
            Booking Details
          </h2>

          <button
            onClick={onClose}
            className="
              text-textSecondary
              hover:text-textPrimary
              text-xl
            "
          >
            ✖
          </button>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Detail label="Customer" value={customerName} />
          <Detail label="Phone" value={phone} />
          <Detail label="CNIC" value={cnic} />
          <Detail label="Vehicle" value={vehicleName} />
          <Detail label="Start Date" value={startDate} />
          <Detail label="End Date" value={endDate} />
          <Detail label="Pickup Time" value={pickupTime} />
          <Detail label="Drop Time" value={dropTime} />
          <Detail label="Payment Status" value={paymentStatus} />
          <Detail label="Booking Status" value={status} />
          <Detail label="City" value={booking.city} />
          <Detail label="Notes" value={notes} />
        </div>

        <div className="mt-6 flex flex-col gap-2">

          <button
            onClick={() => {
              onEdit?.(booking);
              onClose?.();
            }}
            className="
              w-full
              bg-warning
              text-white
              py-2
              rounded
              text-sm
            "
          >
            Edit
          </button>

          <button
            onClick={handleDeleteClick}
            className="
              w-full
              bg-danger
              text-white
              py-2
              rounded
              text-sm
            "
          >
            Delete
          </button>

          {booking.hasConflict && (
            <button
              onClick={handleOverrideClick}
              className="
                w-full
                bg-accent
                text-white
                py-2
                rounded
                text-sm
              "
            >
              Override Booking
            </button>
          )}

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
        <div
          className="
            fixed
            inset-0
            z-[1200]
            flex
            items-center
            justify-center
            bg-secondary/50
            p-3
          "
        >

          <div
            className="
              bg-surface
              text-textPrimary
              p-5
              rounded-xl
              shadow-card
              w-full
              max-w-sm
            "
          >

            <h3 className="font-bold text-lg mb-3">
              Override Booking
            </h3>

            <p className="text-sm text-textSecondary mb-4">
              This will override existing booking conflict. Continue?
            </p>

            <div className="flex gap-2">

              <button
                onClick={() => setShowOverrideConfirm(false)}
                className="
                  flex-1
                  border
                  border-borderColor
                  py-2
                  rounded
                "
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmOverride}
                className="
                  flex-1
                  bg-accent
                  text-white
                  py-2
                  rounded
                "
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
