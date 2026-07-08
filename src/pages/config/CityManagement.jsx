import React from "react";
import { Building2 } from "lucide-react";
import { useConfigStore } from "../../store/ConfigStore";
import { useAuthStore } from "../../store/authStore";
import StatusBadge from "../../components/ui/StatusBadge";
import Switch from "../../components/ui/Switch";

// NOTE: this used to list ALL cities (Karachi/Lahore/Islamabad/Faisalabad)
// with toggle switches for each - a serious multi-tenant leak, since it let
// a Lahore admin enable/disable Karachi's or Islamabad's tenant. An admin
// only ever runs one city's business, so this now only shows and controls
// their own city's status.
export default function CityManagement() {
  const configs = useConfigStore((s) => s.configs);
  const toggleCityActive = useConfigStore((s) => s.toggleCityActive);
  const adminCity = useAuthStore((s) => s.user?.city);

  const cityConfig = configs[adminCity];
  const isActive = cityConfig?.active ?? true;

  return (
    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="font-bold text-textPrimary text-base sm:text-lg">
          4. City Settings
        </h2>
        <p className="text-sm text-textSecondary mt-0.5">
          Enable or disable your branch on the platform.
        </p>
      </div>

      <div className="flex items-center justify-between border border-borderColor rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Building2 size={16} />
          </div>
          <div>
            <p className="font-medium text-textPrimary">
              {adminCity || "Your City"}
            </p>
            <StatusBadge status={isActive ? "active" : "inactive"} />
          </div>
        </div>

        <Switch
          checked={isActive}
          onCheckedChange={(val) => toggleCityActive(adminCity, val)}
        />
      </div>
    </div>
  );
}