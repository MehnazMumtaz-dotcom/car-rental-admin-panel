import { useEffect, useState } from "react";
import { useComplaintStore } from "../../store/complaintStore";
import ComplaintFilters from "./ComplaintFilters";
import DataTable from "../../components/tables/DataTable";
import ComplaintDetails from "./ComplaintDetails";
import ConfirmDialog from "../../components/ui/ConfirmDialog"; 
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function ComplaintList() {
  const {
    complaints,
    setComplaints,
    selectedComplaint,
    setSelectedComplaint,
    closeDrawer,
  } = useComplaintStore();

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    slaType: "",
    assignedTo: "",
    slaStatus: "",
  });

  // ❌ isMobile logic ab remove karne ki zarurat nahi, par use nahi ho raha
  const [isMobile, setIsMobile] = useState(false);

  const [deleteRow, setDeleteRow] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const getRemainingTime = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const totalMinutes = Math.floor(diff / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const enrichedComplaints = complaints.map((c) => ({
    ...c,
    slaTimer: getRemainingTime(c.slaDeadline),
  }));

  const filteredComplaints = enrichedComplaints.filter((c) => {
    const normalize = (value) =>
      (value || "").toString().toLowerCase().replace(/[^a-z0-9]/g, "");

    return (
      (!filters.search ||
        normalize(c.complaintId).includes(normalize(filters.search)) ||
        normalize(c.customer).includes(normalize(filters.search))) &&
      (!filters.status ||
        normalize(c.status) === normalize(filters.status)) &&
      (!filters.category ||
        normalize(c.category).includes(normalize(filters.category))) &&
      (!filters.slaType ||
        normalize(c.slaType) === normalize(filters.slaType)) &&
      (!filters.assignedTo ||
        normalize(c.assignedTo) === normalize(filters.assignedTo))
    );
  });

  const handleDelete = (row) => {
    setDeleteRow(row);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    const updated = complaints.filter(
      (c) => c.complaintId !== deleteRow.complaintId
    );
    setComplaints(updated);
    setDeleteRow(null);
    setShowConfirm(false);
  };

  const statusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap";
    if (status === "Open") return `${base} bg-blue-100 text-blue-700`;
    if (status === "In Progress") return `${base} bg-orange-100 text-orange-700`;
    return `${base} bg-gray-100 text-gray-700`;
  };

  const slaBadge = (slaType) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap";
    return slaType === "Urgent"
      ? `${base} bg-red-100 text-red-600`
      : `${base} bg-green-100 text-green-600`;
  };

  const columns = [
    { header: "ID", accessor: "complaintId", width: "10%" },
    { header: "Customer", accessor: "customer", width: "15%" },
    { header: "Category", accessor: "category", width: "14%" },

    {
      header: "SLA",
      width: "10%",
      cell: (row) => (
        <span className={slaBadge(row.slaType)}>
          {row.slaType}
        </span>
      ),
    },

    {
      header: "Time",
      accessor: "slaTimer",
      width: "12%",
    },

    {
      header: "Status",
      width: "13%",
      cell: (row) => (
        <span className={statusBadge(row.status)}>
          {row.status}
        </span>
      ),
    },

    {
      header: "Assigned",
      accessor: "assignedTo",
      width: "14%",
    },

    {
      header: "Actions",
      width: "14%",
      cell: (row) => (
        <div className="flex items-center gap-4 whitespace-nowrap justify-center">
          <button
            onClick={() => setSelectedComplaint(row)}
            className="text-blue-600"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => setSelectedComplaint(row)}
            className="text-yellow-600"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            className="text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">

      <div className="flex-1 flex flex-col px-4 sm:px-6 pb-4 gap-4 min-w-0">

        <div className="shrink-0">
          <ComplaintFilters onApply={setFilters} />
        </div>

        {/* ✅ FIXED FOR MOBILE */}
        <div className="flex-1 min-w-0 border rounded-xl overflow-x-auto">

          <div className="w-full min-w-[800px]">
            <DataTable
              columns={columns}
              data={filteredComplaints}
              onRowClick={(row) => {
                setTimeout(() => {
                  setSelectedComplaint(row);
                }, 0);
              }}
            />
          </div>

        </div>

      </div>

      {selectedComplaint && (
        <div
          onClick={closeDrawer}
          className="fixed inset-0 bg-black/40"
        />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white transition-transform ${
          selectedComplaint ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ComplaintDetails
          complaint={selectedComplaint}
          onClose={closeDrawer}
        />
      </div>

      {showConfirm && (
        <ConfirmDialog
          open={showConfirm}
          title="Delete Complaint"
          message="Are you sure you want to delete this complaint?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowConfirm(false);
            setDeleteRow(null);
          }}
        />
      )}

    </div>
  );
}