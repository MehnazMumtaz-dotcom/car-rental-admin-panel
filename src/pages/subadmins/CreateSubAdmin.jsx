import React, { useState } from "react";
import { Eye, EyeOff, UserPlus, RotateCcw } from "lucide-react";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

export default function CreateSubAdmin({ formData, setFormData, onSubmit, onReset }) {
  const [showPassword, setShowPassword] = useState(false);

  const update = (field) => (eOrValue) => {
    const value =
      eOrValue && eOrValue.target ? eOrValue.target.value : eOrValue;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5 h-full">
      <h2 className="font-bold text-red-500 text-base sm:text-lg">Create New Sub-Admin</h2>
      <p className="text-sm text-textSecondary mb-4">
        Add a new team member and assign permissions
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="[&_label]:text-blue-600 [&_label]:font-semibold">
          <Input
            label="Full Name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={update("name")}
          />
        </div>
        <div className="[&_label]:text-blue-600 [&_label]:font-semibold">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={update("email")}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-blue-600 font-semibold">Status</label>
          <Select
            value={formData.status}
            onChange={update("status")}
            placeholder="Select status"
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-blue-600 font-semibold">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={formData.password}
              onChange={update("password")}
              className="w-full px-3 py-2 pr-10 rounded-xl border border-borderColor bg-surface text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-5">
        <Button variant="primary" onClick={onSubmit}>
          <span className="flex items-center gap-2">
            <UserPlus size={16} />
            Create Sub-Admin
          </span>
        </Button>
        <Button variant="outline" onClick={onReset}>
          <span className="flex items-center gap-2">
            <RotateCcw size={16} />
            Reset
          </span>
        </Button>
      </div>
    </div>
  );
}