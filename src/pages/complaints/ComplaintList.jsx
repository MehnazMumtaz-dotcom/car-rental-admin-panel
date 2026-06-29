import { useEffect, useState } from "react";
import { useComplaintStore } from "../../store/complaintStore";
import ComplaintFilters from "./ComplaintFilters";
import DataTable from "../../components/tables/DataTable";
import ComplaintDetails from "./ComplaintDetails";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function ComplaintList() {
  const {
    complaints,
    setComplaints,
    selectedComplaint,
    setSelectedComplaint,
    isDrawerOpen,
    closeDrawer,
  } = useComplaintStore();

  const [filters, setFilters] = useState({
    status: "",
    category: "",
  });

  const [isMobile, setIsMobile] = useState(false);

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
    const statusMatch = filters.status ? c.status === filters.status : true;
    const categoryMatch = filters.category
      ? c.category === filters.category
      : true;

    return statusMatch && categoryMatch;
  });

  const handleDelete = (row) => {
    if (!window.confirm("Delete this complaint?")) return;

    const updated = complaints.filter(
      (c) => c.complaintId !== row.complaintId
    );

    setComplaints(updated);
  };

  const handleEdit = (row) => {
    setSelectedComplaint(row);
  };

  const statusBadge = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    if (status === "Open")
      return `${base} bg-blue-100 text-blue-700`;
    if (status === "In Progress")
      return `${base} bg-orange-100 text-orange-700`;
    return `${base} bg-gray-100 text-gray-700`;
  };

  const slaBadge = (slaType) => {
    const base = "px-2 py-1 rounded-full text-xs font-medium";
    return slaType === "Urgent"
      ? `${base} bg-red-100 text-red-600`
      : `${base} bg-green-100 text-green-600`;
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      <div className="flex-1 flex flex-col px-4 sm:px-6 pb-4 gap-4">
        <h1 className="text-xl font-semibold">Complaint Queue</h1>

        <ComplaintFilters onApply={setFilters} />

        <div className="flex-1 min-h-0 bg-surface border rounded-xl">

          {!isMobile && (
            <DataTable
              columns={[
                { header: "ID" },
                { header: "Customer" },
                { header: "Category" },
                { header: "SLA" },
                { header: "Time" },
                { header: "Status" },
                { header: "Assigned" },
                { header: "Actions" },
              ]}
              data={filteredComplaints}
              renderRow={(row) => (
                <tr
                  key={row.complaintId}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-3 py-2">{row.complaintId}</td>
                  <td className="px-3 py-2">{row.customer}</td>
                  <td className="px-3 py-2 text-gray-500">
                    {row.category}
                  </td>

                  <td className="px-3 py-2">
                    <span className={slaBadge(row.slaType)}>
                      {row.slaType}
                    </span>
                  </td>

                  <td className="px-3 py-2 text-red-600">
                    {row.slaTimer}
                  </td>

                  <td className="px-3 py-2">
                    <span className={statusBadge(row.status)}>
                      {row.status}
                    </span>
                  </td>

                  <td className="px-3 py-2">
                    {row.assignedTo || "Unassigned"}
                  </td>

                  <td className="px-3 py-2 flex gap-3">
                    <button
                      onClick={() => setSelectedComplaint(row)}
                      className="text-blue-600"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => handleEdit(row)}
                      className="text-yellow-600"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(row)}
                      className="text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )}
            />
          )}

        </div>
      </div>

      {isDrawerOpen && (
        <div
          onClick={closeDrawer}
          className="fixed inset-0 bg-black/40"
        />
      )}

      <div
        className={`fixed right-0 top-0 h-full bg-white transition ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ComplaintDetails
          complaint={selectedComplaint}
          onClose={closeDrawer}
        />
      </div>
    </div>
  );
}