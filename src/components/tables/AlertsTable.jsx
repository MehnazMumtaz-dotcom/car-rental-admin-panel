import { useMemo, useState } from "react";

const getPriorityStyle = (priority) => {
  return priority?.toLowerCase() === "urgent"
    ? "bg-danger/10 text-danger"
    : "bg-primary/10 text-primary";
};

const getAlertStatus = (item) => {
  return {
    ...item,
    expiresText: item.Expires || "N/A",
  };
};

const AlertsTable = ({ data = [], onRowClick }) => {
  const [showAll, setShowAll] = useState(false);

  const alerts = useMemo(() => {
    return data.map((item) => getAlertStatus(item));
  }, [data]);

  const visibleData = showAll ? alerts : alerts.slice(0, 2);

  return (
    <div className="bg-surface p-4 sm:p-5 rounded-xl shadow-card border border-borderColor">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-textPrimary text-sm sm:text-base">
          SLA Alerts (Expiring Soon)
        </h3>

        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="text-xs sm:text-sm text-primary hover:underline cursor-pointer"
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>

      {/* Table */}
      <div className="w-full">
        <table className="w-full table-fixed text-[10px] sm:text-xs md:text-sm">

          {/* HEAD */}
          <thead className="text-textSecondary text-left">
            <tr className="border-b border-borderColor">
              <th className="pb-2 w-[10%]">ID</th>
              <th className="pb-2 w-[20%]">Customer</th>
              <th className="pb-2 hidden md:table-cell w-[25%]">Category</th>
              <th className="pb-2 hidden sm:table-cell w-[25%]">Expires</th>
              <th className="pb-2 text-right w-[20%]">Priority</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="text-textPrimary">
            {visibleData.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className="border-b border-borderColor last:border-none cursor-pointer hover:bg-background"
              >

                {/* ID */}
                <td className="py-2 truncate">
                  #{item.id}
                </td>

                {/* Customer */}
                <td className="truncate">
                  {item.customer || "N/A"}
                </td>

                {/* Category */}
                <td className="hidden md:table-cell truncate">
                  {item.category || "Other"}
                </td>

                {/* Expires */}
                <td className="hidden sm:table-cell">
                  <div className="flex items-center gap-2 text-warning font-medium whitespace-nowrap">
                    <span>⏱</span>
                    <span>{item.expiresText}</span>
                  </div>
                </td>

                {/* Priority */}
                <td className="text-right pr-3">
                  <span
                    className={`
                      inline-block whitespace-nowrap px-2 py-[2px]
                      text-[9px] sm:text-xs rounded-full font-medium capitalize
                      ${getPriorityStyle(item.priority)}
                    `}
                  >
                    {item.priority || "standard"}
                  </span>
                </td>

              </tr>
            ))}

            {/* Empty */}
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

      {/* Footer */}
      <div className="text-xs sm:text-sm text-textSecondary mt-4 text-center">
        Showing {visibleData.length} of {alerts.length}
      </div>

    </div>
  );
};

export default AlertsTable;