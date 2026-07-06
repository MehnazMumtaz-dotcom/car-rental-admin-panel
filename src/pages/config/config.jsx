import React from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

import { useConfigStore } from "../../store/ConfigStore";
import CommisionConfig from "./CommisionConfig";
import PricingConfig from "./PricingConfig";
import SLASettings from "./SLASettings";
import CityManagement from "./CityManagement";

function FooterBar() {
  const status = useConfigStore((s) => s.status);
  const lastSaved = useConfigStore((s) => s.lastSaved);

  const isSaving = status === "saving";
  const isError = status === "error";

  return (
    <div
      className={`border rounded-xl px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
        isSaving
          ? "bg-warning/10 border-warning/30"
          : isError
          ? "bg-danger/10 border-danger/30"
          : "bg-success/10 border-success/30"
      }`}
    >
      <div className="flex items-start sm:items-center gap-3">
        {isSaving ? (
          <Loader2 className="text-warning shrink-0 animate-spin mt-0.5 sm:mt-0" size={22} />
        ) : isError ? (
          <AlertCircle className="text-danger shrink-0 mt-0.5 sm:mt-0" size={22} />
        ) : (
          <CheckCircle2 className="text-success shrink-0 mt-0.5 sm:mt-0" size={22} />
        )}
        <div>
          <p className="text-sm font-semibold text-textPrimary">
            {isSaving
              ? "Saving changes..."
              : isError
              ? "Save failed. Please try again."
              : "Real-time Apply: All changes are saved and applied instantly."}
          </p>
          <p className="text-xs text-textSecondary">
            {isSaving
              ? "Please wait a moment."
              : isError
              ? "Your last change could not be saved to the server."
              : lastSaved
              ? `Last saved at ${new Date(lastSaved).toLocaleTimeString()}`
              : "No need to refresh or reload the page."}
          </p>
        </div>
      </div>
      <button
        type="button"
        disabled={isSaving}
        className={`flex items-center justify-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-xl transition w-full sm:w-auto ${
          isSaving
            ? "bg-warning/70 cursor-wait"
            : isError
            ? "bg-danger hover:opacity-90"
            : "bg-success hover:opacity-90"
        }`}
      >
        {isSaving ? (
          <Loader2 size={16} className="animate-spin" />
        ) : isError ? (
          <AlertCircle size={16} />
        ) : (
          <CheckCircle2 size={16} />
        )}
        {isSaving ? "Saving..." : isError ? "Retry" : "All changes live"}
      </button>
    </div>
  );
}

export default function Confi() {
  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 pt-0">
      <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
        <CommisionConfig />
        <PricingConfig />
        <SLASettings />
        <CityManagement />
        <FooterBar />
      </div>
    </div>
  );
}
