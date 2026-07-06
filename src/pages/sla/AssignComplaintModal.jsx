import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AGENTS } from "../../store/SLAStore";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

export default function AssignComplaintModal({ complaint, onClose, onAssign }) {
  const [agent, setAgent] = useState("");

  useEffect(() => {
    if (complaint) setAgent(complaint.assignedTo || "");
  }, [complaint]);

  if (!complaint) return null;

  const handleSave = () => {
    if (!agent) return;
    onAssign(complaint.id, agent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/50">
      <div className="bg-surface rounded-xl shadow-card border border-borderColor w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-borderColor">
          <h2 className="font-semibold text-textPrimary">
            Assign {complaint.id}
          </h2>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-textPrimary"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <label className="text-sm text-textSecondary mb-1 block">
            Assign to agent
          </label>
          <Select
            value={agent}
            onChange={setAgent}
            placeholder="Select an agent"
            options={AGENTS.map((a) => ({ label: a, value: a }))}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 px-5 py-4 border-t border-borderColor">
          <Button variant="primary" onClick={handleSave}>
            Assign
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
