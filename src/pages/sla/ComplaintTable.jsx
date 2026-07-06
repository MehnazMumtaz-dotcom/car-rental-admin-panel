import React, { useMemo, useState } from "react";
import { Eye, UserPlus, CheckCircle2 } from "lucide-react";
import {
  useSLAStore,
  getComplaintStatus,
  formatTimeLeft,
} from "../../store/SLAStore";
import ComplaintDetailModal from "./ComplaintDetailModal";
import AssignComplaintModal from "./AssignComplaintModal";

const PAGE_SIZE = 6;

function initials(name) {
  if (!name) return "--";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PriorityPill({ priority }) {
  const isUrgent = priority === "urgent";
  return (
    <span
      className={`px-1.5 py-0.5 rounded-lg text-xs font-medium whitespace-nowrap ${
        isUrgent ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary"
      }`}
    >
      {isUrgent ? "Urgent" : "Standard"}
    </span>
  );
}

function StatusPill({ status }) {
  const map = {
    "on-track": { label: "On Track", cls: "bg-success/10 text-success" },
    "at-risk": { label: "At Risk", cls: "bg-warning/10 text-warning" },
    breached: { label: "Breached", cls: "bg-danger/10 text-danger" },
  };
  const s = map[status];
  return (
    <span className={`px-1.5 py-0.5 rounded-lg text-xs font-medium whitespace-nowrap ${s.cls}`}>
      {s.label}
    </span>
  );
}

function TimeLeftBar({ msLeft, totalMs, status }) {
  const barColor = {
    "on-track": "bg-success",
    "at-risk": "bg-warning",
    breached: "bg-danger",
  }[status];

  const elapsedPct =
    status === "breached"
      ? 100
      : Math.min(100, Math.max(0, ((totalMs - msLeft) / totalMs) * 100));

  return (
    <div>
      <p
        className={`text-xs font-medium mb-1 whitespace-nowrap ${
          status === "breached" ? "text-danger" : "text-textPrimary"
        }`}
      >
        {formatTimeLeft(msLeft)}
      </p>
      <div className="w-full h-1.5 rounded-full bg-borderColor overflow-hidden">
        <div className={`h-full ${barColor}`} style={{ width: `${elapsedPct}%` }} />
      </div>
    </div>
  );
}

export default function ComplaintTable({ filters, now }) {
  const complaints = useSLAStore((s) => s.complaints);
  const resolveComplaint = useSLAStore((s) => s.resolveComplaint);
  const assignComplaint = useSLAStore((s) => s.assignComplaint);

  const [page, setPage] = useState(1);
  const [viewingComplaint, setViewingComplaint] = useState(null);
  const [assigningComplaint, setAssigningComplaint] = useState(null);

  const enriched = useMemo(() => {
    return complaints
      .filter((c) => !c.resolved)
      .map((c) => ({ ...c, ...getComplaintStatus(c, now) }));
  }, [complaints, now]);

  const filtered = useMemo(() => {
    return enriched.filter((c) => {
      const matchesSearch = filters.search
        ? c.id.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      const matchesStatus = filters.status ? c.status === filters.status : true;
      const matchesPriority = filters.priority
        ? c.priority === filters.priority
        : true;
      const matchesCategory = filters.category
        ? c.category === filters.category
        : true;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [enriched, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5">
      <div className="w-full">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[13%]" />
            <col className="w-[9%] hidden md:table-column" />
            <col className="w-[8%]" />
            <col className="w-[7%] hidden lg:table-column" />
            <col className="w-[19%] hidden sm:table-column" />
            <col className="w-[9%]" />
            <col className="w-[18%] hidden lg:table-column" />
            <col className="w-[17%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-borderColor text-left text-textSecondary">
              <th className="py-2 pr-1 font-medium">Complaint ID</th>
              <th className="py-2 pr-1 font-medium hidden md:table-cell">Category</th>
              <th className="py-2 pr-1 font-medium">Priority</th>
              <th className="py-2 pr-1 font-medium hidden lg:table-cell">SLA Type</th>
              <th className="py-2 pr-1 font-medium hidden sm:table-cell">Time Left</th>
              <th className="py-2 pr-1 font-medium">Status</th>
              <th className="py-2 pr-1 font-medium hidden lg:table-cell">
                Assigned To
              </th>
              <th className="py-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c) => {
              const slaDays = c.priority === "urgent" ? 7 : 14;
              return (
                <tr key={c.id} className="border-b border-borderColor last:border-0">
                  <td className="py-3 pr-1 font-medium text-primary truncate">
                    {c.id}
                  </td>
                  <td className="py-3 pr-1 text-textSecondary hidden md:table-cell truncate">
                    {c.category}
                  </td>
                  <td className="py-3 pr-1">
                    <PriorityPill priority={c.priority} />
                  </td>
                  <td className="py-3 pr-1 text-textSecondary hidden lg:table-cell whitespace-nowrap">
                    {slaDays} Days
                  </td>
                  <td className="py-3 pr-1 hidden sm:table-cell">
                    <TimeLeftBar msLeft={c.msLeft} totalMs={c.totalMs} status={c.status} />
                  </td>
                  <td className="py-3 pr-1">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="py-3 pr-1 hidden lg:table-cell">
                    {c.assignedTo ? (
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center shrink-0">
                          {initials(c.assignedTo)}
                        </span>
                        <span className="text-textPrimary text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                          {c.assignedTo}
                        </span>
                      </div>
                    ) : (
                      <span className="text-textSecondary text-xs">--</span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="text-textSecondary hover:text-primary shrink-0"
                        aria-label="View details"
                        onClick={() => setViewingComplaint(c)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="text-textSecondary hover:text-primary shrink-0"
                        aria-label="Assign complaint"
                        onClick={() => setAssigningComplaint(c)}
                      >
                        <UserPlus size={16} />
                      </button>
                      <button
                        className="text-success hover:opacity-80 shrink-0"
                        aria-label="Resolve complaint"
                        onClick={() => resolveComplaint(c.id)}
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-textSecondary">
                  No complaints match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
        <p className="text-xs text-textSecondary">
          Showing {paginated.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{" "}
          {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
          entries
        </p>
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2 py-1 rounded-lg border border-borderColor text-textSecondary disabled:opacity-40"
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(0, 5)
            .map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  n === currentPage
                    ? "bg-primary text-white"
                    : "border border-borderColor text-textPrimary"
                }`}
              >
                {n}
              </button>
            ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-2 py-1 rounded-lg border border-borderColor text-textSecondary disabled:opacity-40"
          >
            {">"}
          </button>
        </div>
      </div>

      <ComplaintDetailModal
        complaint={viewingComplaint}
        onClose={() => setViewingComplaint(null)}
      />
      <AssignComplaintModal
        complaint={assigningComplaint}
        onClose={() => setAssigningComplaint(null)}
        onAssign={assignComplaint}
      />
    </div>
  );
}
