import React from "react";
import { X } from "lucide-react";
import { formatTimeLeft } from "../../store/SLAStore";
import Button from "../../components/ui/Button";

const STATUS_LABELS = {
  "on-track": { label: "On Track", cls: "bg-success/10 text-success" },
  "at-risk": { label: "At Risk", cls: "bg-warning/10 text-warning" },
  breached: { label: "Breached", cls: "bg-danger/10 text-danger" },
};

export default function ComplaintDetailModal({ complaint, onClose }) {
  if (!complaint) return null;

  const s = STATUS_LABELS[complaint.status];
  const slaDays = complaint.priority === "urgent" ? 7 : 14;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/50">
      <div className="bg-surface rounded-xl shadow-card border border-borderColor w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-borderColor">
          <h2 className="font-semibold text-textPrimary">{complaint.id}</h2>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-textPrimary"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-textSecondary">Category</span>
            <span className="text-textPrimary font-medium">{complaint.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-textSecondary">Priority</span>
            <span className="text-textPrimary font-medium capitalize">
              {complaint.priority}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-textSecondary">SLA Window</span>
            <span className="text-textPrimary font-medium">{slaDays} Days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-textSecondary">Deadline</span>
            <span className="text-textPrimary font-medium">
              {new Date(complaint.deadline).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-textSecondary">Time Left</span>
            <span className="text-textPrimary font-medium">
              {formatTimeLeft(complaint.msLeft)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-textSecondary">Status</span>
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${s.cls}`}>
              {s.label}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-textSecondary">Assigned To</span>
            <span className="text-textPrimary font-medium">
              {complaint.assignedTo || "Unassigned"}
            </span>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-borderColor">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
