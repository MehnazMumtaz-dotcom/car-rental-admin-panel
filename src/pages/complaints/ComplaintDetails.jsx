import { useState, useEffect } from "react";
import { useComplaintStore } from "../../store/complaintStore";
import { X, User, Folder, Bot } from "lucide-react";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

export default function ComplaintDetails({ complaint, onClose }) {
  const { complaints, setComplaints, setSelectedComplaint } =
    useComplaintStore();

  const [status, setStatus] = useState("Open");
  const [assignedTo, setAssignedTo] = useState("");
  const [notes, setNotes] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status || "Open");
      setAssignedTo(complaint.assignedTo || "");
      setNotes(complaint.notes || "");
    }
  }, [complaint]);

  if (!complaint) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-gray-500">
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

  const handleDelete = () => {
    const updated = complaints.filter(
      (c) => c.complaintId !== complaint.complaintId
    );
    setComplaints(updated);
    setSelectedComplaint(null);
    setOpenDialog(false);
  };

  return (
    <div className="h-full flex flex-col p-3 sm:p-4 overflow-y-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b pb-2">

        <div className="flex items-center gap-2 font-semibold text-sm sm:text-base">
          <Folder size={18} />
          {complaint.complaintId}
        </div>

        <button onClick={onClose} className="self-end sm:self-auto">
          <X size={18} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 gap-2 mt-2">

        {/* CUSTOMER INFO */}
        <div>
          <div className="flex items-center gap-2 font-medium text-sm">
            <User size={16} />
            {complaint.customer}
          </div>

          <div className="text-xs flex items-center gap-2 text-gray-600">
            <Folder size={14} />
            {complaint.category}
          </div>
        </div>

        {/* AI SUMMARY */}
        <div className="border rounded-md p-2 bg-gray-50">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Bot size={16} />
            AI Summary
          </div>

          <div className="text-xs mt-1 text-gray-700">
            {getAISummary()}
          </div>
        </div>

        {/* STATUS */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            updateComplaint({ status: e.target.value });
          }}
          className="w-full border px-3 py-2 rounded-md text-sm"
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
          <option>Escalated</option>
        </select>

        {/* ASSIGN */}
        <select
          value={assignedTo}
          onChange={(e) => {
            setAssignedTo(e.target.value);
            updateComplaint({ assignedTo: e.target.value });
          }}
          className="w-full border px-3 py-2 rounded-md text-sm"
        >
          <option value="">Select Admin</option>
          <option value="admin1">Admin 1</option>
          <option value="admin2">Admin 2</option>
          <option value="senior-admin">Senior Admin</option>
        </select>

        {/* NOTES */}
        <div className="flex flex-col flex-1 min-h-[120px] sm:min-h-[150px]">
          <label className="text-xs mb-1">Notes</label>

          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              updateComplaint({ notes: e.target.value });
            }}
            className="flex-1 border rounded-md p-2 sm:p-3 resize-none text-sm"
            placeholder="Write notes..."
          />
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3">

        <button
          onClick={() => updateComplaint({ status: "Resolved" })}
          className="py-2 bg-green-600 text-white rounded-md text-sm"
        >
          Resolve
        </button>

        <button
          onClick={() => updateComplaint({ status: "Escalated" })}
          className="py-2 bg-yellow-500 text-white rounded-md text-sm"
        >
          Escalate
        </button>

        <button
          onClick={() => setOpenDialog(true)}
          className="py-2 bg-red-600 text-white rounded-md text-sm"
        >
          Delete
        </button>

      </div>

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={openDialog}
        title="Delete Complaint"
        message="Are you sure you want to delete this complaint?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setOpenDialog(false)}
      />
    </div>
  );
}