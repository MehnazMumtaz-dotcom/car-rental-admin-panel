import React from "react";
import { Building2 } from "lucide-react";
import { useConfigStore } from "../../store/ConfigStore";
import StatusBadge from "../../components/ui/StatusBadge";

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

export default function CityManagement() {
  const cities = useConfigStore((s) => s.config.cities);
  const updateCity = useConfigStore((s) => s.updateCity);

  return (
    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="font-bold text-red-600 text-base sm:text-lg">
          4. City Settings
        </h2>
        <p className="text-sm text-textSecondary mt-0.5">
          Enable or disable cities available on the platform.
        </p>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-borderColor text-left text-textSecondary">
              <th className="py-2 font-medium">City Name</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city, index) => (
              <tr
                key={city.name}
                className="border-b border-borderColor last:border-0"
              >
                <td className="py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-textPrimary font-medium">
                    <Building2 size={16} className="text-textSecondary shrink-0" />
                    {city.name}
                  </div>
                </td>
                <td className="py-3 whitespace-nowrap">
                  <span className="capitalize">
                    <StatusBadge status={city.active ? "active" : "inactive"} />
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex justify-end">
                    <ToggleSwitch
                      enabled={city.active}
                      onChange={(val) => updateCity(index, { active: val })}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

