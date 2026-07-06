import React from "react";
import { Info } from "lucide-react";
import { useConfigStore } from "../../store/ConfigStore";
import Input from "../../components/ui/Input";

function ToggleSwitch({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${
        enabled ? "bg-success justify-end" : "bg-borderColor justify-start"
      }`}
    >
      <span className="w-4 h-4 bg-white rounded-full shadow" />
    </button>
  );
}

export default function SLASettings() {
  const s = useConfigStore((st) => st.config.urgentSurcharge);
  const updateConfig = useConfigStore((st) => st.updateConfig);

  const patch = (data) => updateConfig("urgentSurcharge", { ...s, ...data });

  return (
    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-textPrimary">
            3. Urgent Complaint Surcharge
          </h2>
          <p className="text-sm text-textSecondary">
            Extra charge will be applied when customer raises an urgent
            complaint.
          </p>
        </div>
        <ToggleSwitch
          enabled={s.enabled}
          onChange={(val) => patch({ enabled: val })}
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


