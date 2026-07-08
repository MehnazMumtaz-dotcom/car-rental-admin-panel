import { useMemo, useState } from "react";
import { useSLAStore, getComplaintStatus, formatTimeLeft } from "../../store/SLAStore";
import { useAuthStore } from "../../store/authStore";

const getStatusStyle = (status) => {
  switch (status) {
    case "on-track":
      return "bg-success/10 text-success";
    case "at-risk":
      return "bg-warning/10 text-warning";
    case "breached":
      return "bg-danger/10 text-danger";
    default:
      return "bg-borderColor text-textPrimary";
  }
};

const statusLabel = {
  "on-track": "On Track",
  "at-risk": "At Risk",
  breached: "Breached",
};

const ComplaintsTable = ({ onRowClick }) => {
  const [showAll, setShowAll] = useState(false);
  const complaints = useSLAStore((s) => s.complaints);
  const adminCity = useAuthStore((s) => s.user?.city);

  const enriched = useMemo(() => {
    const now = Date.now();
    return complaints
      .filter((c) => !c.resolved)
      .filter((c) => !adminCity || c.city === adminCity)
      .map((c) => ({ ...c, ...getComplaintStatus(c, now) }))
      .sort((a, b) => a.msLeft - b.msLeft);
  }, [complaints, adminCity]);

  const visibleData = showAll ? enriched : enriched.slice(0, 5);

  return (
    <div className="bg-surface p-4 sm:p-5 rounded-xl shadow-card border border-borderColor">

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-textPrimary text-sm sm:text-base">
          Recent Complaints
        </h3>

        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs sm:text-sm text-primary hover:underline"
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>

      <table className="w-full table-auto text-[10px] sm:text-xs md:text-sm">

        <thead className="text-textSecondary text-left">
          <tr className="border-b border-borderColor">
            <th className="pb-2 px-1">ID</th>
            <th className="pb-2 px-1">Customer</th>
            <th className="pb-2 px-1">Category</th>
            <th className="pb-2 px-1">Time Left</th>
            <th className="pb-2 px-1">Status</th>
          </tr>
        </thead>

        <tbody className="text-textPrimary">

          {visibleData.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className="border-b border-borderColor last:border-none cursor-pointer hover:bg-background transition"
            >
              <td className="py-2 px-1 truncate">{item.id}</td>

              <td className="px-1 truncate">{item.customer}</td>

              <td className="px-1 truncate text-textSecondary">
                {item.category}
              </td>

              <td className="px-1 truncate text-warning font-medium whitespace-nowrap">
                ⏱ {formatTimeLeft(item.msLeft)}
              </td>

              <td className="px-1">
                <span
                  className={`px-2 py-[2px] text-[9px] sm:text-xs rounded-full font-medium whitespace-nowrap ${getStatusStyle(
                    item.status
                  )}`}
                >
                  {statusLabel[item.status]}
                </span>
              </td>

            </tr>
          ))}

          {visibleData.length === 0 && (
            <tr>
              <td colSpan={5} className="py-4 text-center text-textSecondary">
                No open complaints.
              </td>
            </tr>
          )}

        </tbody>
      </table>

      <div className="text-xs sm:text-sm text-textSecondary mt-4 text-center">
        Showing {visibleData.length} of {enriched.length}
      </div>
    </div>
  );
};

export default ComplaintsTable;