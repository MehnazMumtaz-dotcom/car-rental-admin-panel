import React from "react";
import { Info } from "lucide-react";
import { PERMISSIONS } from "../../store/SubAdminStore";

export default function RoleManagement({
  selectedPermissions = [],
  onToggle,
}) {
  const safePermissions = Array.isArray(selectedPermissions)
    ? selectedPermissions
    : [];

  const isChecked = (key) => safePermissions.includes(key);

  return (
    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5 h-full">
      <h2 className="font-semibold text-red-600">Assign Permissions</h2>

      <p className="text-sm text-textSecondary mb-4">
        Select what this sub-admin can access
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.isArray(PERMISSIONS) && PERMISSIONS.length > 0 ? (
          PERMISSIONS.map((perm) => {
            const checked = isChecked(perm.key);

            return (
              <label
                key={perm.key}
                className={`flex items-start gap-2 border rounded-xl p-3 cursor-pointer transition ${
                  checked
                    ? "border-primary bg-primary/5"
                    : "border-borderColor"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle && onToggle(perm.key)}
                  className="mt-1 h-4 w-4 rounded border-borderColor text-primary focus:ring-primary shrink-0"
                />

                <span>
                  <span className="block text-sm font-semibold text-primary">
                    {perm.label || "No Label"}
                  </span>

                  <span className="block text-xs text-textSecondary">
                    {perm.desc || ""}
                  </span>
                </span>
              </label>
            );
          })
        ) : (
          <p className="text-sm text-textSecondary">
            No permissions available
          </p>
        )}
      </div>

      <div className="flex items-start gap-2 text-sm text-success bg-success/10 border border-success/30 rounded-lg p-3 mt-4">
        <Info size={16} className="shrink-0 mt-0.5" />
        Permissions control what sections this sub-admin can access.
      </div>
    </div>
  );
}