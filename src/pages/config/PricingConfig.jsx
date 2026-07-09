import React from "react";
import { Info } from "lucide-react";
import { useConfigStore, defaultCityConfig } from "../../store/ConfigStore";
import { useAuthStore } from "../../store/authStore";
import Input from "../../components/ui/Input";
import Switch from "../../components/ui/Switch";

export default function PricingConfig() {
  const configs = useConfigStore((s) => s.configs);
  const updateConfig = useConfigStore((s) => s.updateConfig);
  const adminCity = useAuthStore((s) => s.user?.city);

  const cityConfig = configs[adminCity];
  const m = cityConfig?.minBooking || defaultCityConfig().minBooking;

  const patch = (data) => updateConfig(adminCity, "minBooking", { ...m, ...data });

  return (
    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-bold text-textPrimary text-base sm:text-lg">
            2. Minimum Booking Fee {adminCity ? `— ${adminCity}` : ""}
          </h2>
          <p className="text-sm text-textSecondary mt-0.5">
            Set the minimum booking amount. Bookings below this amount will
            not be allowed.
          </p>
        </div>
        <Switch
          checked={m.enabled}
          onCheckedChange={(val) => patch({ enabled: val })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Minimum Booking Amount (PKR)"
          value={m.amount}
          onChange={(e) => patch({ amount: e.target.value })}
        />

        <div className="bg-success/10 border border-success/30 rounded-lg p-4 flex gap-2">
          <Info className="text-success shrink-0" size={18} />
          <p className="text-sm text-textPrimary">
            Booking amount must be at least this value.
            <br />
            <span className="text-textSecondary">Example: 1000 PKR</span>
          </p>
        </div>
      </div>
    </div>
  );
}
