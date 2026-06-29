import { useState, useEffect } from "react";
import { useComplaintStore } from "../../store/complaintStore";
import { X, User, Folder, Bot } from "lucide-react";

export default function ComplaintDetails({ complaint, onClose }) {
  const { complaints, setComplaints, setSelectedComplaint } =
    useComplaintStore();

  const [status, setStatus] = useState("Open");
  const [assignedTo, setAssignedTo] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status || "Open");
      setAssignedTo(complaint.assignedTo || "");
      setNotes(complaint.notes || "");
    }
  }, [complaint]);

  if (!complaint) {
    return (
      <div className="h-full flex items-center justify-center">
        Select complaint
      </div>
    );
  }

  const updateComplaint = (updatedFields) => {
    const updated = complaints.map((c) =>
      c.complaintId === complaint.complaintId
        ? { ...c, ...updatedFields }
        : c
    );

    setComplaints(updated);
    setSelectedComplaint({ ...complaint, ...updatedFields });
  };

  const getAISummary = () => {
    if (status === "Escalated") {
      return "Complaint escalated due to high severity. Immediate senior admin attention required.";
    }

    if (status === "Resolved") {
      return "Complaint successfully resolved and closed after verification.";
    }

    if (status === "In Progress") {
      return "Complaint is currently being handled by assigned admin.";
    }

    if (complaint.priority === "High") {
      return "High priority complaint. Fast response required to avoid SLA risk.";
    }

    if (complaint.slaTimer === "Expired") {
      return "SLA deadline exceeded. Urgent action needed.";
    }

    return "New complaint received. Waiting for assignment and review.";
  };

  return (
    <div className="h-full flex flex-col p-4">

      <div className="flex justify-between items-center border-b pb-2">
        <div className="flex items-center gap-2 font-semibold">
          <Folder size={18} />
          {complaint.complaintId}
        </div>

        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-col flex-1">

        <div className="pt-2">
          <div className="flex items-center gap-2 font-medium">
            <User size={16} />
            {complaint.customer}
          </div>

          <div className="text-sm flex items-center gap-2">
            <Folder size={14} />
            {complaint.category}
          </div>
        </div>

        <div className="border rounded-md p-2 mt-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Bot size={16} />
            AI Summary
          </div>

          <div className="text-xs">
            {getAISummary()}
          </div>
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            updateComplaint({ status: e.target.value });
          }}
          className="w-full border px-3 py-2 mt-2 rounded-md"
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Escalated</option>
        </select>

        <select
          value={assignedTo}
          onChange={(e) => {
            setAssignedTo(e.target.value);
            updateComplaint({ assignedTo: e.target.value });
          }}
          className="w-full border px-3 py-2 mt-2 rounded-md"
        >
          <option value="">Select Admin</option>
          <option value="admin1">Admin 1</option>
          <option value="admin2">Admin 2</option>
          <option value="senior-admin">Senior Admin</option>
        </select>

        <div className="mt-2 flex flex-col flex-1">
          <label className="text-xs mb-1">Notes</label>

          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              updateComplaint({ notes: e.target.value });
            }}
            className="flex-1 border rounded-md p-3 resize-none"
            placeholder="Write notes..."
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2">

        <button
          onClick={() => updateComplaint({ status: "Resolved" })}
          className="py-2 bg-green-600 text-white rounded-md"
        >
          Resolve
        </button>

        <button
          onClick={() => updateComplaint({ status: "Escalated" })}
          className="py-2 bg-yellow-500 text-white rounded-md"
        >
          Escalate
        </button>

        <button
          onClick={() => {
            const ok = window.confirm("Delete?");
            if (!ok) return;
            const updated = complaints.filter(
              (c) => c.complaintId !== complaint.complaintId
            );
            setComplaints(updated);
            setSelectedComplaint(null);
          }}
          className="py-2 bg-red-600 text-white rounded-md"
        >
          Delete
        </button>

      </div>
    </div>
  );
}