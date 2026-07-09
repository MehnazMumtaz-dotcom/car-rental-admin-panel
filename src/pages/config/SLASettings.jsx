import React from "react";
import { Info } from "lucide-react";
import { useConfigStore, defaultCityConfig } from "../../store/ConfigStore";
import { useAuthStore } from "../../store/authStore";
import Input from "../../components/ui/Input";
import Switch from "../../components/ui/Switch";

export default function SLASettings() {
  const configs = useConfigStore((st) => st.configs);
  const updateConfig = useConfigStore((st) => st.updateConfig);
  const adminCity = useAuthStore((st) => st.user?.city);

  const cityConfig = configs[adminCity];
  const s = cityConfig?.urgentSurcharge || defaultCityConfig().urgentSurcharge;

  const patch = (data) => updateConfig(adminCity, "urgentSurcharge", { ...s, ...data });

  return (
    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-bold text-textPrimary text-base sm:text-lg">
            3. Urgent Complaint Surcharge {adminCity ? `— ${adminCity}` : ""}
          </h2>
          <p className="text-sm text-textSecondary mt-0.5">
            Extra charge will be applied when customer raises an urgent
            complaint.
          </p>
        </div>
        <Switch
          checked={s.enabled}
          onCheckedChange={(val) => patch({ enabled: val })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Urgent Surcharge Amount (PKR)"
          value={s.amount}
          onChange={(e) => patch({ amount: e.target.value })}
        />

        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex gap-2">
          <Info className="text-warning shrink-0" size={18} />
          <p className="text-sm text-textPrimary">
            This amount will be added on top of the booking amount for
            urgent complaints.
            <br />
            <span className="text-textSecondary">Example: +300 PKR</span>
          </p>
        </div>
      </div>
    </div>
  );
}

