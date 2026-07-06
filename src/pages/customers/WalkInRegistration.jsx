import React, { useState } from "react";
import Button from "../../components/ui/Button";

export default function WalkInRegistration({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    cnic: "",
    email: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "This field is mandatory";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "This field is mandatory";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSave?.(form);

    setForm({
      name: "",
      phone: "",
      cnic: "",
      email: "",
      address: "",
      notes: "",
    });

    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      
      <div className="bg-white w-full max-w-[500px] rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-5">
          Walk-in Customer
        </h2>

        <div className="space-y-4">

          <div>
            <input
              name="name"
              placeholder="Name "
              value={form.name}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <input
              name="phone"
              placeholder="Phone Number "
              value={form.phone}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${
                errors.phone ? "border-red-500" : ""
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone}
              </p>
            )}
          </div>
          <input
            name="cnic"
            placeholder="CNIC"
            value={form.cnic}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>

          <Button onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}