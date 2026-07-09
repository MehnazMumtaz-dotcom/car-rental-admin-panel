import { useMemo, useState } from "react";
import { useSLAStore, getComplaintStatus, formatTimeLeft } from "../../store/SLAStore";
import { useAuthStore } from "../../store/authStore";

const getPriorityStyle = (priority) => {
  return priority === "urgent"
    ? "bg-danger/10 text-danger"
    : "bg-primary/10 text-primary";
};

const AlertsTable = ({ onRowClick }) => {
  const [showAll, setShowAll] = useState(false);
  const complaints = useSLAStore((s) => s.complaints);
  const adminCity = useAuthStore((s) => s.user?.city);

  const alerts = useMemo(() => {
    const now = Date.now();
    return complaints
      .filter((c) => !c.resolved)
      .filter((c) => !adminCity || c.city === adminCity)
      .map((c) => ({ ...c, ...getComplaintStatus(c, now) }))
      .filter((c) => c.status === "at-risk" || c.status === "breached")
      .sort((a, b) => a.msLeft - b.msLeft);
  }, [complaints, adminCity]);
  const visibleData = showAll ? alerts : alerts.slice(0, 2);

  return (
    <div className="bg-surface p-4 sm:p-5 rounded-xl shadow-card border border-borderColor">

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-textPrimary text-sm sm:text-base">
          SLA Alerts (Expiring Soon)
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
            <col className="w-[25%]" />
            <col className="w-[20%]" />
            <col className="w-[21%] hidden md:table-column" />
            <col className="w-[20%] hidden sm:table-column" />
            <col className="w-[10%]" />
          </colgroup>

          <thead className="text-textSecondary text-left">
            <tr className="border-b border-borderColor">
              <th className="pb-2 pr-1">ID</th>
              <th className="pb-2 pr-1">Customer</th>
              <th className="pb-2 pr-1 hidden md:table-cell">Category</th>
              <th className="pb-2 pr-1 hidden sm:table-cell">Expires</th>
              <th className="pb-2 pr-1">Priority</th>
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

                <td className="pr-1 truncate hidden md:table-cell">
                  {item.category}
                </td>

                <td className="pr-1 hidden sm:table-cell text-warning font-medium whitespace-nowrap">
                  ⏱ {formatTimeLeft(item.msLeft)}
                </td>

                <td className="pr-1">
                  <span
                    className={`inline-block whitespace-nowrap px-2 py-[2px] text-[9px] sm:text-xs rounded-full font-medium capitalize ${getPriorityStyle(
                      item.priority
                    )}`}
                  >
                    {item.priority}
                  </span>
                </td>
              </tr>
            ))}

            {visibleData.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-textSecondary">
                  Nothing expiring soon.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      <div className="text-xs sm:text-sm text-textSecondary mt-4 text-center">
        Showing {visibleData.length} of {alerts.length}
      </div>
    </div>
  );
};

export default AlertsTable;