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

  // ✅ CHANGE: default 2 records
  const visibleData = showAll ? enriched : enriched.slice(0, 2);

  return (
    <div className="bg-surface p-4 sm:p-5 rounded-xl shadow-card border border-borderColor">

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-textPrimary text-sm sm:text-base">
          Recent Complaints
        </h3>

        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="text-xs sm:text-sm text-primary hover:underline shrink-0 cursor-pointer"
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>

      <div className="w-full">
        <table className="w-full table-fixed text-[10px] sm:text-xs md:text-sm">
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[19%]" />
            <col className="w-[20%] hidden md:table-column" />
            <col className="w-[20%] hidden sm:table-column" />
            <col className="w-[12%]" />
          </colgroup>

          <thead className="text-textSecondary text-left">
            <tr className="border-b border-borderColor">
              <th className="pb-2 pr-1">ID</th>
              <th className="pb-2 pr-1">Customer</th>
              <th className="pb-2 pr-1 hidden md:table-cell">Category</th>
              <th className="pb-2 pr-1 hidden sm:table-cell">Time Left</th>
              <th className="pb-2 pr-1">Status</th>
            </tr>
          </thead>

          <tbody className="text-textPrimary">

            {visibleData.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className="border-b border-borderColor last:border-none cursor-pointer hover:bg-background transition"
              >
                <td className="py-2 pr-1 truncate">{item.id}</td>

                <td className="pr-1 truncate">{item.customer}</td>

                <td className="pr-1 truncate hidden md:table-cell text-textSecondary">
                  {item.category}
                </td>

                <td className="pr-1 hidden sm:table-cell text-warning font-medium whitespace-nowrap">
                  ⏱ {formatTimeLeft(item.msLeft)}
                </td>

                <td className="pr-1">
                  <span
                    className={`inline-block whitespace-nowrap px-2 py-[2px] text-[9px] sm:text-xs rounded-full font-medium ${getStatusStyle(
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
      </div>

      <div className="text-xs sm:text-sm text-textSecondary mt-4 text-center">
        Showing {visibleData.length} of {enriched.length}
      </div>
    </div>
  );
};

export default ComplaintsTable;
