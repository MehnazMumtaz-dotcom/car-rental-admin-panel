import { useState, useMemo } from "react";

const alertsData = [
  {
    id: "#A-501",
    customer: "Ahmed Khan",
    category: "Vehicle Issue",
    expires: "01h 40m",
    priority: "Urgent",
    date: "2026-05-20",
  },
  {
    id: "#A-502",
    customer: "Sara Ali",
    category: "Billing",
    expires: "03h 20m",
    priority: "High",
    date: "2026-05-21",
  },
  {
    id: "#A-503",
    customer: "Usman Tariq",
    category: "Driver Behavior",
    expires: "05h 10m",
    priority: "Medium",
    date: "2026-05-22",
  },
  {
    id: "#A-504",
    customer: "Hina Sheikh",
    category: "Booking Error",
    expires: "08h 55m",
    priority: "High",
    date: "2026-05-25",
  },
  {
    id: "#A-505",
    customer: "Ali Raza",
    category: "Other",
    expires: "12h 30m",
    priority: "Low",
    date: "2026-05-28",
  },
];

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "Urgent":
      return "bg-danger/10 text-danger";
    case "High":
      return "bg-warning/10 text-warning";
    case "Medium":
      return "bg-warning/10 text-warning";
    case "Low":
      return "bg-success/10 text-success";
    default:
      return "bg-borderColor text-textSecondary";
  }
};

const AlertsTable = ({ startDate, endDate, onRowClick }) => {
  const [showAll, setShowAll] = useState(false);

  const filteredData = useMemo(() => {
    if (!startDate || !endDate) return alertsData;

    return alertsData.filter((item) => {
      const d = new Date(item.date);
      return d >= startDate && d <= endDate;
    });
  }, [startDate, endDate]);

  const visibleData = showAll ? filteredData : filteredData.slice(0, 2);

  return (
    <div className="bg-surface p-4 sm:p-5 rounded-xl shadow-card border border-borderColor">

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-textPrimary text-sm sm:text-base">
          SLA Alerts (Expiring Soon)
        </h3>

        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs sm:text-sm text-primary hover:underline"
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full table-auto text-[10px] sm:text-xs md:text-sm">

          <thead className="text-textSecondary text-left">
            <tr className="border-b border-borderColor">
              <th className="pb-2 px-1">ID</th>
              <th className="pb-2 px-1">Customer</th>
              <th className="pb-2 px-1">Category</th>
              <th className="pb-2 px-1">Expires</th>
              <th className="pb-2 px-1">Priority</th>
            </tr>
          </thead>

          <tbody className="text-textPrimary">

            {visibleData.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className="border-b border-borderColor last:border-none cursor-pointer hover:bg-background transition"
              >

                <td className="py-2 px-1 truncate">{item.id}</td>

                <td className="px-1 truncate">{item.customer}</td>

                <td className="px-1 truncate">{item.category}</td>

                <td className="text-warning font-medium px-1 truncate">
                  ⏱ {item.expires}
                </td>

                <td className="px-1">
                  <span
                    className={`px-2 py-[2px] text-[9px] sm:text-xs rounded-full font-medium whitespace-nowrap ${getPriorityStyle(
                      item.priority
                    )}`}
                  >
                    {item.priority}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>

      <div className="text-xs sm:text-sm text-textSecondary mt-4 text-center">
        Showing {visibleData.length} of {filteredData.length}
      </div>
    </div>
  );
};

export default AlertsTable;