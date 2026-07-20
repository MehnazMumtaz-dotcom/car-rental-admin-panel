import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ConflictModal from "./ConflictModal";
import { useVehicleStore } from "../../../store/vehicleStore";
import { useCustomerStore } from "../../../store/CustomerStore";

const defaultFormState = {
  vehicleId: "",
  customerId: "",
  customerType: "WALK_IN",
  name: "",
  customerName: "",
  phone: "",
  cnic: "",
  city: "",
  startDate: "",
  endDate: "",
  pickupTime: "",
  dropTime: "",
  dailyRate: "",
  discount: "",
  advance: "",
  notes: "",
};

const formatDate = (date) => {
  if (!date) return "";

  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function BookingForm({
  onClose,
  onSave,
  onUpdate,
  onOverride,
  editingBooking,
  initialValues,
}) {
  const vehicles = useVehicleStore((state) => state.vehicles);
  const fetchVehicles = useVehicleStore((state) => state.fetchVehicles);

  const customers = useCustomerStore((state) => state.customers);
  const fetchCustomers = useCustomerStore((state) => state.fetchCustomers);

  useEffect(() => {
    Promise.all([fetchVehicles(), fetchCustomers()]).catch((error) => {
      console.error("Unable to load booking form data", error);
    });
  }, [fetchVehicles, fetchCustomers]);

  const [form, setForm] = useState(() => {
    if (editingBooking) {
      const isRegistered = Boolean(editingBooking.customerId || editingBooking.source === "ONLINE");
      return {
        ...defaultFormState,
        vehicleId: editingBooking.vehicleId || "",
        customerId: editingBooking.customerId || "",
        customerType: isRegistered ? "ONLINE" : "WALK_IN",
        name: editingBooking.customer?.name || editingBooking.customerName || "",
        customerName: editingBooking.customer?.name || editingBooking.customerName || "",
        phone: editingBooking.phone || "",
        cnic: editingBooking.cnic || "",
        city: editingBooking.city || "",
        startDate: formatDate(editingBooking.startDate),
        endDate: formatDate(editingBooking.endDate),
        pickupTime: editingBooking.pickupTime || "",
        dropTime: editingBooking.dropTime || "",
        dailyRate: editingBooking.dailyRate || "",
        discount: editingBooking.discount || "",
        advance: editingBooking.advance || "",
        notes: editingBooking.notes || "",
      };
    }

    if (initialValues) {
      return {
        ...defaultFormState,
        startDate: initialValues.startDate || "",
        endDate: initialValues.endDate || "",
      };
    }

    return { ...defaultFormState };
  });
  const [originalDates] = useState(() => ({
    startDate: editingBooking ? form.startDate : null,
    endDate: editingBooking ? form.endDate : null,
  }));
  const [conflictData, setConflictData] = useState(null);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const vehicleOptions = Array.isArray(vehicles) ? vehicles : [];
  const customerOptions = Array.isArray(customers) ? customers : [];

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "name" && { customerName: value }),
    }));
  };

  const calculateDays = () => {
    if (!form.startDate || !form.endDate) return 0;
    const start = new Date(`${form.startDate}T00:00:00`);
    const end = new Date(`${form.endDate}T00:00:00`);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff >= 0 ? diff + 1 : 0;
  };

  const totalDays = calculateDays();
  const totalPrice = totalDays * (Number(form.dailyRate) || 0) - (Number(form.discount) || 0);

  const validate = () => {
    const newErrors = {};

    if (!form.vehicleId) newErrors.vehicleId = "Required";
    if (!form.startDate) newErrors.startDate = "Required";
    if (!form.endDate) newErrors.endDate = "Required";
    if (!form.dailyRate) newErrors.dailyRate = "Required";

    if (form.customerType === "ONLINE") {
      if (!form.customerId) newErrors.customerId = "Required";
    } else {
      if (!form.name) newErrors.name = "Required";
      if (!form.phone) newErrors.phone = "Required";
    }

    if (!form.city) newErrors.city = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatBookingData = (override = false) => {
    const booking = {
      customerId: form.customerType === "ONLINE" && form.customerId ? Number(form.customerId) : null,
      vehicleId: Number(form.vehicleId),
      customerName: form.customerType === "ONLINE" ? form.customerName?.trim() || form.name?.trim() || null : form.customerName?.trim() || form.name?.trim() || null,
      phone: form.phone,
      cnic: form.cnic || null,
      city: form.city,
      pickupTime: form.pickupTime || null,
      dropTime: form.dropTime || null,
      dailyRate: Number(form.dailyRate),
      totalPrice: Number(totalPrice),
      advance: Number(form.advance) || 0,
      discount: Number(form.discount) || 0,
      notes: form.notes || null,
      forceOverride: override,
      source: form.customerType === "ONLINE" ? "ONLINE" : "WALK_IN",
    };

    if (!editingBooking || form.startDate !== originalDates.startDate) {
      booking.startDate = form.startDate;
    }

    if (!editingBooking || form.endDate !== originalDates.endDate) {
      booking.endDate = form.endDate;
    }

    return booking;
  };

  const handleSave = async () => {
    setSubmitError("");
    if (!validate()) return;

    const bookingData = {
      ...formatBookingData(false),
      id: editingBooking?.id,
    };

    try {
      if (editingBooking) {
        await onUpdate?.(bookingData);
      } else {
        await onSave?.(bookingData);
      }
      onClose?.();
    } catch (error) {
      const conflict = error?.response?.data?.conflictBooking;

      if (conflict) {
        setConflictData(conflict);
        setPendingBooking(bookingData);
        return;
      }

      console.error("Booking error", error);
      setSubmitError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to save booking. Please try again."
      );
    }
  };

  const handleOverride = async () => {
    if (!pendingBooking) return;

    const booking = {
      ...pendingBooking,
      forceOverride: true,
      isOverride: true,
    };

    try {
      if (editingBooking) {
        await onUpdate?.(booking);
      } else if (onOverride) {
        await onOverride(booking);
      } else {
        await onSave?.(booking);
      }

      setConflictData(null);
      setPendingBooking(null);
      onClose?.();
    } catch (err) {
      console.error("Override failed", err);
      setSubmitError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to override the booking conflict."
      );
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 z-[9990]" />

      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <div className="w-full sm:w-[520px] max-h-[90vh] bg-white border rounded-xl shadow overflow-y-auto p-5">
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h2 className="font-bold">{editingBooking ? "Edit Booking" : "Add Booking"}</h2>
            <button onClick={onClose}>✖</button>
          </div>

          <select
            className="w-full border p-2 mb-2"
            value={form.customerType}
            onChange={(e) => {
              const value = e.target.value;
              setForm((prev) => ({
                ...prev,
                customerType: value,
                customerId: value === "ONLINE" ? prev.customerId : "",
                name: value === "ONLINE" ? prev.name : prev.name,
              }));
            }}
          >
            <option value="WALK_IN">Walk-in Customer</option>
            <option value="ONLINE">Registered Customer</option>
          </select>

          <select
            className={`w-full border p-2 mb-2 ${errors.vehicleId ? "border-danger" : ""}`}
            value={form.vehicleId}
            onChange={(e) => handleChange("vehicleId", e.target.value)}
          >
            <option value="">Select Vehicle</option>
            {vehicleOptions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          {form.customerType === "ONLINE" ? (
            <select
              className={`w-full border p-2 mb-2 ${errors.customerId ? "border-danger" : ""}`}
              value={form.customerId}
              onChange={(e) => {
                const selected = customerOptions.find((c) => c.id === Number(e.target.value));
                setForm((prev) => ({
                  ...prev,
                  customerId: e.target.value,
                  customerName: selected?.name || "",
                  name: selected?.name || "",
                  phone: selected?.phone || "",
                  city: selected?.city || prev.city,
                }));
              }}
            >
              <option value="">Select Registered Customer</option>
              {customerOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              className={`w-full border p-2 mb-2 ${errors.name ? "border-danger" : ""}`}
              placeholder="Walk-in Customer Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          )}

          {[
            ["phone", "Phone"],
            ["cnic", "CNIC"],
            ["city", "City"],
            ["dailyRate", "Daily Rate"],
            ["discount", "Discount"],
            ["advance", "Advance"],
          ].map(([key, label]) => (
            <input
              key={key}
              className={`w-full border p-2 mb-2 ${errors[key] ? "border-danger" : ""}`}
              placeholder={label}
              value={form[key]}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          ))}

          <input
            type="date"
            className={`w-full border p-2 mb-2 ${errors.startDate ? "border-danger" : ""}`}
            value={form.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />

          <input
            type="date"
            className={`w-full border p-2 mb-2 ${errors.endDate ? "border-danger" : ""}`}
            value={form.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="time"
              className="w-full border p-2"
              value={form.pickupTime}
              onChange={(e) => handleChange("pickupTime", e.target.value)}
              aria-label="Pickup time"
            />
            <input
              type="time"
              className="w-full border p-2"
              value={form.dropTime}
              onChange={(e) => handleChange("dropTime", e.target.value)}
              aria-label="Drop time"
            />
          </div>

          <textarea
            className="w-full border p-2 mb-2"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={3}
          />

          <div className="text-sm font-semibold mb-3">
            Days: {totalDays} | Total: {totalPrice}
          </div>

          {(Object.keys(errors).length > 0 || submitError) && (
            <p className="text-sm text-danger mb-3">
              {submitError || "Please complete all required fields."}
            </p>
          )}

          <div className="flex gap-2">
            <button onClick={onClose} className="w-1/2 border p-2">
              Cancel
            </button>

            <button onClick={handleSave} className="w-1/2 bg-blue-600 text-white p-2">
              {editingBooking ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {conflictData && (
        <ConflictModal
          conflict={conflictData}
          open={Boolean(conflictData)}
          onClose={() => {
            setConflictData(null);
            setPendingBooking(null);
          }}
          onConfirm={handleOverride}
        />
      )}
    </>,
    document.body
  );
}
