import React from "react";
import { Coins, Percent, Layers, Info } from "lucide-react";
import { useConfigStore } from "../../store/ConfigStore";

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

export default function CommisionConfig() {
  const c = useConfigStore((s) => s.config.commission);
  const updateConfig = useConfigStore((s) => s.updateConfig);

  const patch = (data) => updateConfig("commission", { ...c, ...data });

  const options = [
    {
      key: "flat",
      icon: <Coins className="text-success" size={28} />,
      title: "Flat Commission",
      desc: "Fixed amount will be charged on each booking",
    },
    {
      key: "percentage",
      icon: <Percent className="text-primary" size={28} />,
      title: "Percentage Commission",
      desc: "Percentage will be charged on each booking",
    },
    {
      key: "hybrid",
      icon: <Layers className="text-secondary" size={28} />,
      title: "Hybrid (Flat + Percentage)",
      desc: "Both fixed amount and percentage will be charged",
    },
  ];

  return (
    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-textPrimary">
            1. Commission Settings
          </h2>
          <p className="text-sm text-textSecondary">
            Choose how platform commission will be calculated on each booking.
          </p>
        </div>
        <ToggleSwitch
          enabled={c.enabled}
          onChange={(val) => patch({ enabled: val })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((opt) => (
          <div
            key={opt.key}
            onClick={() => patch({ type: opt.key })}
            className={`relative border rounded-xl p-4 cursor-pointer transition ${
              c.type === opt.key
                ? "border-success bg-success/5"
                : "border-borderColor"
            }`}
          >
            <span
              className={`absolute top-3 left-3 w-4 h-4 rounded-full border flex items-center justify-center ${
                c.type === opt.key ? "border-success" : "border-borderColor"
              }`}
            >
              {c.type === opt.key && (
                <span className="w-2 h-2 rounded-full bg-success" />
              )}
            </span>

            <div className="flex flex-col items-center text-center mt-3">
              {opt.icon}
              <h3 className="font-semibold text-textPrimary mt-2">
                {opt.title}
              </h3>
              <p className="text-xs text-textSecondary mt-1">{opt.desc}</p>

              {opt.key === "flat" && (
                <div
                  className="flex items-center border border-borderColor rounded-xl mt-3 w-full overflow-hidden bg-surface"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="px-3 py-2 text-sm bg-background text-textSecondary shrink-0">
                    PKR
                  </span>
                  <input
                    type="text"
                    value={c.flatAmount}
                    onChange={(e) => patch({ flatAmount: e.target.value })}
                    className="flex-1 px-2 py-2 text-sm outline-none bg-transparent text-textPrimary focus:ring-2 focus:ring-primary rounded-r-xl"
                  />
                </div>
              )}

              {opt.key === "percentage" && (
                <div
                  className="flex items-center border border-borderColor rounded-xl mt-3 w-full overflow-hidden bg-surface"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={c.percentage}
                    onChange={(e) => patch({ percentage: e.target.value })}
                    className="flex-1 px-3 py-2 text-sm outline-none bg-transparent text-textPrimary focus:ring-2 focus:ring-primary rounded-l-xl"
                  />
                  <span className="px-3 py-2 text-sm bg-background text-textSecondary shrink-0">
                    %
                  </span>
                </div>
              )}

              {opt.key === "hybrid" && (
                <div
                  className="flex items-center gap-1 mt-3 w-full min-w-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center border border-borderColor rounded-xl overflow-hidden flex-1 min-w-0 bg-surface">
                    <span className="px-2 py-2 text-xs bg-background text-textSecondary shrink-0">
                      PKR
                    </span>
                    <input
                      type="text"
                      value={c.hybridFlat}
                      onChange={(e) => patch({ hybridFlat: e.target.value })}
                      className="w-full min-w-0 px-2 py-2 text-sm outline-none bg-transparent text-textPrimary"
                    />
                  </div>
                  <span className="text-textSecondary text-sm shrink-0">+</span>
                  <div className="flex items-center border border-borderColor rounded-xl overflow-hidden flex-1 min-w-0 bg-surface">
                    <input
                      type="text"
                      value={c.hybridPercentage}
                      onChange={(e) =>
                        patch({ hybridPercentage: e.target.value })
                      }
                      className="w-full min-w-0 px-2 py-2 text-sm outline-none bg-transparent text-textPrimary"
                    />
                    <span className="px-2 py-2 text-xs bg-background text-textSecondary shrink-0">
                      %
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm text-success mt-4">
        <Info size={16} />
        This commission setting will be applied immediately to all new bookings.
      </div>
    </div>
  );
}
