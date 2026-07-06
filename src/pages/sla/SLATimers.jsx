import React, { useEffect, useMemo, useState } from "react";
import { FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

import { useSLAStore, getComplaintStatus } from "../../store/SLAStore";
import ComplaintFilters from "./ComplaintFilters";
import ComplaintTable from "./ComplaintTable";

function StatCard({ icon: Icon, label, value, sub, tone }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  };

  return (
    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-3 sm:p-4 flex items-center gap-2 sm:gap-3 min-w-0">
      <div
        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 ${tones[tone]}`}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-textSecondary truncate">{label}</p>
        <p className="text-lg sm:text-2xl font-semibold text-textPrimary">{value}</p>
        <p className={`text-xs font-medium truncate ${tones[tone].split(" ")[1]}`}>{sub}</p>
      </div>
    </div>
  );
}

const emptyFilters = { search: "", status: "", priority: "", category: "" };

export default function SLATimers() {
  const complaints = useSLAStore((s) => s.complaints);
  const refresh = useSLAStore((s) => s.refresh);
  const status = useSLAStore((s) => s.status);

  const [filters, setFilters] = useState(emptyFilters);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    const active = complaints.filter((c) => !c.resolved);
    const withStatus = active.map((c) => getComplaintStatus(c, now).status);

    const total = active.length;
    const onTrack = withStatus.filter((s) => s === "on-track").length;
    const atRisk = withStatus.filter((s) => s === "at-risk").length;
    const breached = withStatus.filter((s) => s === "breached").length;

    const pct = (n) => (total === 0 ? "0.0" : ((n / total) * 100).toFixed(2));

    return {
      total,
      onTrack,
      atRisk,
      breached,
      onTrackPct: pct(onTrack),
      atRiskPct: pct(atRisk),
      breachedPct: pct(breached),
    };
  }, [complaints, now]);

  const isRefreshing = status === "saving";

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard
          icon={FileText}
          label="Total Complaints"
          value={stats.total}
          sub="All time"
          tone="primary"
        />
        <StatCard
          icon={CheckCircle2}
          label="On Track"
          value={stats.onTrack}
          sub={`${stats.onTrackPct}% of total`}
          tone="success"
        />
        <StatCard
          icon={Clock}
          label="At Risk"
          value={stats.atRisk}
          sub={`${stats.atRiskPct}% of total`}
          tone="warning"
        />
        <StatCard
          icon={AlertTriangle}
          label="Breached"
          value={stats.breached}
          sub={`${stats.breachedPct}% of total`}
          tone="danger"
        />
      </div>

      <div className="mb-4">
        <ComplaintFilters
          filters={filters}
          setFilters={setFilters}
          onRefresh={refresh}
          isRefreshing={isRefreshing}
        />
      </div>
      <ComplaintTable filters={filters} now={now} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 bg-surface rounded-xl shadow-card border border-borderColor p-4 flex flex-col sm:flex-row gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-success shrink-0" />
            <div>
              <p className="text-sm font-medium text-textPrimary">On Track</p>
              <p className="text-xs text-textSecondary">SLA time is safe</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-warning shrink-0" />
            <div>
              <p className="text-sm font-medium text-textPrimary">At Risk</p>
              <p className="text-xs text-textSecondary">SLA time is running low</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-danger shrink-0" />
            <div>
              <p className="text-sm font-medium text-textPrimary">Breached</p>
              <p className="text-xs text-textSecondary">SLA time has expired</p>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-textPrimary">
          SLA Timers are updated in real-time. Breached complaints are auto-escalated.
        </div>
      </div>
    </div>
  );
}
