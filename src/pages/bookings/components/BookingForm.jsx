import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ConflictModal from "./ConflictModal";

export default function BookingForm({
  onClose,
  onSave,
  onUpdate,
  editingBooking,
  bookings = []
}) {
  const [form, setForm] = useState({
    vehicle: "",
    customerType: "walkin",
    name: "",
    phone: "",
    cnic: "",
    startDate: "",
    endDate: "",
    pickupTime: "",
    dropTime: "",
    dailyRate: "",
    discount: "",
    status: "Pending",
    paymentStatus: "Unpaid",
    paymentMethod: "Cash",
    city: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});
  const [conflictData, setConflictData] = useState(null);
  const [pendingBooking, setPendingBooking] = useState(null);

  useEffect(() => {
    if (editingBooking) {
      setForm({ ...editingBooking });
    }
  }, [editingBooking]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const calculateDays = () => {
    if (!form.startDate || !form.endDate) return 0;

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    if (isNaN(start) || isNaN(end)) return 0;

    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff >= 0 ? diff + 1 : 0;
  };

  const totalDays = calculateDays();

  const totalPrice =
    totalDays * (Number(form.dailyRate) || 0) -
    (Number(form.discount) || 0);

  const checkConflict = (newBooking) => {
    return bookings.find((b) => {
      if (editingBooking && b.id === editingBooking.id) return false;

      const sameVehicle = b.vehicle === newBooking.vehicle;

      return (
        sameVehicle &&
        newBooking.startDate <= b.endDate &&
        newBooking.endDate >= b.startDate
      );
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.vehicle) newErrors.vehicle = "Required";
    if (!form.name) newErrors.name = "Required";
    if (!form.phone) newErrors.phone = "Required";
    if (!form.cnic) newErrors.cnic = "Required";
    if (!form.startDate) newErrors.startDate = "Required";
    if (!form.endDate) newErrors.endDate = "Required";
    if (!form.pickupTime) newErrors.pickupTime = "Required";
    if (!form.dropTime) newErrors.dropTime = "Required";
    if (!form.dailyRate) newErrors.dailyRate = "Required";
    if (!form.city) newErrors.city = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const bookingData = {
      ...form,
      dailyRate: Number(form.dailyRate) || 0,
      discount: Number(form.discount) || 0,
      totalDays,
      totalPrice,
      id: editingBooking ? editingBooking.id : Date.now()
    };

    const conflict = checkConflict(bookingData);

    if (conflict) {
      setConflictData(conflict);
      setPendingBooking(bookingData);
      return;
    }

    if (editingBooking) onUpdate?.(bookingData);
    else onSave?.(bookingData);

    onClose?.();
  };

  const handleOverride = () => {
    const finalBooking = {
      ...pendingBooking,
      isConflict: true
    };

    if (editingBooking) onUpdate?.(finalBooking);
    else onSave?.(finalBooking);

    setConflictData(null);
    setPendingBooking(null);
    onClose?.();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <>

      <div className="fixed inset-0 bg-secondary/50 z-[9990]" />

      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4">

        <div
          className="w-full sm:w-[520px] max-h-[90vh] bg-surface text-textPrimary border border-borderColor rounded-xl shadow-card overflow-y-auto p-3 sm:p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h2 className="font-bold text-base sm:text-lg">
              {editingBooking ? "Edit Booking" : "Add Booking"}
            </h2>
            <button onClick={onClose}>✖</button>
          </div>

          {[
            ["vehicle", "Vehicle"],
            ["name", "Customer Name"],
            ["phone", "Phone"],
            ["cnic", "CNIC"],
            ["city", "City"],
            ["dailyRate", "Daily Rate"]
          ].map(([key, placeholder]) => (
            <div key={key}>
              <input
                className="w-full border border-borderColor bg-surface text-textPrimary rounded p-2 mb-2 text-sm"
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
              {errors[key] && (
                <p className="text-danger text-xs">{errors[key]}</p>
              )}
            </div>
          ))}

          <input
            type="date"
            className="w-full border p-2 mb-2 text-sm"
            value={form.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />

          <input
            type="date"
            className="w-full border p-2 mb-2 text-sm"
            value={form.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />

          <input
            type="time"
            className="w-full border p-2 mb-2 text-sm"
            value={form.pickupTime}
            onChange={(e) => handleChange("pickupTime", e.target.value)}
          />

          <input
            type="time"
            className="w-full border p-2 mb-2 text-sm"
            value={form.dropTime}
            onChange={(e) => handleChange("dropTime", e.target.value)}
          />

          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={onClose}
              className="w-full sm:w-1/2 border border-borderColor text-textPrimary rounded p-2 text-sm hover:bg-background"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="w-full sm:w-1/2 bg-primary hover:bg-primaryHover text-white rounded p-2 text-sm"
            >
              {editingBooking ? "Update Booking" : "Save Booking"}
            </button>
          </div>

        </div>
      </div>

      {conflictData && (
        <ConflictModal
          conflict={conflictData}
          onClose={() => {
            setConflictData(null);
            setPendingBooking(null);
          }}
          onOverride={handleOverride}
        />
      )}
    </>,
    document.body
  );
}