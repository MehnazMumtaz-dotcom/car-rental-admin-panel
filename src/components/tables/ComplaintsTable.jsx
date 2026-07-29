import { useMemo, useState } from "react";

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

const mapBackendStatus = (status, timeLeft) => {
  if (timeLeft === "Expired") return "breached";

  if (status === "RESOLVED") return "on-track";
  if (status === "IN_PROGRESS") return "on-track";
  if (status === "OPEN") return "at-risk";

  return "on-track";
};

const formatTime = (val) => {
  if (!val) return "N/A";
  if (val === "Expired") return "Expired";

  const numeric = parseInt(val);

  if (isNaN(numeric)) return val;

  const totalMinutes = numeric;

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  let result = "";

  if (days > 0) result += `${days}d `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m`;

  return result.trim() || "0m";
};

const ComplaintsTable = ({ data = [], onRowClick }) => {

  const [showAll, setShowAll] = useState(false);

  const enriched = useMemo(() => {

    return data

      .filter((c) => c.status !== "RESOLVED")

      .map((c) => {

        const status = mapBackendStatus(c.status, c.timeLeft);

        return {
          ...c,
          status,
          customer:
            c.customer ||
            c.customerName ||
            c.booking?.customerName ||
            "N/A",

          category: c.category || "Other",

          timeText: formatTime(c.timeLeft),
        };
      });

  }, [data]);

  const visibleData = showAll
    ? enriched
    : enriched.slice(0, 2);

  return (
    <div className="bg-surface p-4 sm:p-5 rounded-xl shadow-card border border-borderColor">

      <div className="flex justify-between items-center mb-4">

        <h3 className="font-semibold text-textPrimary text-sm sm:text-base">
          Recent Complaints
        </h3>

        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="text-xs sm:text-sm text-primary hover:underline cursor-pointer"
        >
          {showAll ? "Show Less" : "View All"}
        </button>

      </div>

      <div className="w-full overflow-x-auto">

        <table className="w-full table-fixed text-[10px] sm:text-xs md:text-sm border-collapse">

          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[26%]" />
            <col className="hidden md:table-column md:w-[22%]" />
            <col className="hidden sm:table-column sm:w-[22%]" />
            <col className="w-[18%]" />
          </colgroup>

          <thead className="text-textSecondary text-left">
            <tr className="border-b border-borderColor">
              <th className="pb-2 pr-2">ID</th>
              <th className="pb-2 pr-2">Customer</th>
              <th className="pb-2 pr-2 hidden md:table-cell">Category</th>
              <th className="pb-2 pr-2 hidden sm:table-cell">Time Left</th>
              <th className="pb-2 text-right">Status</th>
            </tr>
          </thead>

          <tbody className="text-textPrimary">

            {visibleData.map((item) => (

              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className="border-b border-borderColor cursor-pointer hover:bg-background"
              >

                <td className="py-2.5 pr-2 truncate">
                  #{item.id}
                </td>

                <td className="py-2.5 pr-2 truncate" title={item.customer}>
                  {item.customer}
                </td>

                <td className="py-2.5 pr-2 hidden md:table-cell truncate text-textSecondary" title={item.category}>
                  {item.category}
                </td>

                <td className="py-2.5 pr-2 hidden sm:table-cell text-warning font-medium whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <span>⏱</span>
                    <span>{item.timeText}</span>
                  </span>
                </td>

                <td className="py-2.5 text-right">
                  <span
                    className={`
                      inline-block whitespace-nowrap
                      px-2 py-[2px]
                      rounded-full
                      text-[9px]
                      sm:text-xs
                      font-medium
                      ${getStatusStyle(item.status)}
                    `}
                  >
                    {statusLabel[item.status]}
                  </span>
                </td>

              </tr>

            ))}

            {visibleData.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-textSecondary">
                  No complaints found.
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