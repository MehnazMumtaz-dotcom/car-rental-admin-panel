import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { PERMISSIONS } from "../../store/SubAdminStore";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

export default function EditSubAdminModal({ admin, onClose, onSave }) {
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    status: "active",
    permissions: [],
  });

  useEffect(() => {
    if (admin) {
      setDraft({
        name: admin.name,
        email: admin.email,
        status: admin.status,
        permissions: admin.permissions,
      });
    }
  }, [admin]);

  if (!admin) return null;

  const update = (field) => (eOrValue) => {
    const value =
      eOrValue && eOrValue.target ? eOrValue.target.value : eOrValue;
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const togglePermission = (key) => {
    setDraft((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter((k) => k !== key)
        : [...prev.permissions, key],
    }));
  };

  const handleSave = () => {
    onSave(admin.id, draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/50">

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="bg-surface rounded-xl shadow-card border border-borderColor w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide">
        
        <div className="flex items-center justify-between px-5 py-4 border-b border-borderColor">
          <h2 className="font-semibold text-textPrimary">Edit Sub-Admin</h2>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-textPrimary"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={draft.name}
              onChange={update("name")}
            />
            <Input
              label="Email Address"
              type="email"
              value={draft.email}
              onChange={update("email")}
            />
          </div>

          <div className="flex flex-col gap-1 sm:w-1/2">
            <label className="text-sm text-textSecondary">Status</label>
            <Select
              value={draft.status}
              onChange={update("status")}
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-textPrimary mb-2">
              Permissions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PERMISSIONS.map((perm) => {
                const checked = draft.permissions.includes(perm.key);
                return (
                  <label
                    key={perm.key}
                    className={`flex items-start gap-2 border rounded-xl p-2.5 cursor-pointer transition ${
                      checked
                        ? "border-primary bg-primary/5"
                        : "border-borderColor"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePermission(perm.key)}
                      className="mt-0.5 h-4 w-4 rounded border-borderColor text-primary focus:ring-primary shrink-0"
                    />
                    <span>
                      <span className="block text-sm font-medium text-textPrimary">
                        {perm.label}
                      </span>
                      <span className="block text-xs text-textSecondary">
                        {perm.desc}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 px-5 py-4 border-t border-borderColor">
          <Button variant="primary" onClick={handleSave}>
            Save changes
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}