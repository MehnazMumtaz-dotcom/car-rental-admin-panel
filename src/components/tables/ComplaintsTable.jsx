import { useState, useMemo } from "react";

const complaintsData = [
  {
    id: "#C-1021",
    customer: "Ali Raza",
    category: "Vehicle Issue",
    sla: "2d 4h 15m",
    status: "Open",
    date: "2026-05-20",
  },
  {
    id: "#C-1020",
    customer: "Sara Khan",
    category: "Billing",
    sla: "4d 10h 30m",
    status: "In Progress",
    date: "2026-05-21",
  },
  {
    id: "#C-1019",
    customer: "Usman Malik",
    category: "Driver Behavior",
    sla: "1d 6h 20m",
    status: "Open",
    date: "2026-05-22",
  },
  {
    id: "#C-1018",
    customer: "Hina Batool",
    category: "Booking Error",
    sla: "5d 12h 45m",
    status: "In Progress",
    date: "2026-05-25",
  },
  {
    id: "#C-1017",
    customer: "Ahmed Nadeem",
    category: "Other",
    sla: "6d 3h 10m",
    status: "Open",
    date: "2026-05-28",
  },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Open":
      return "bg-red-100 text-red-600";
    case "In Progress":
      return "bg-orange-100 text-orange-600";
    case "Resolved":
      return "bg-green-100 text-green-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const ComplaintsTable = ({ startDate, endDate, onRowClick }) => {
  const [showAll, setShowAll] = useState(false);

  const filteredData = useMemo(() => {
    if (!startDate || !endDate) return complaintsData;

    return complaintsData.filter((item) => {
      const d = new Date(item.date);
      return d >= startDate && d <= endDate;
    });
  }, [startDate, endDate]);

  const visibleData = showAll
    ? filteredData
    : filteredData.slice(0, 2);

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
            <th className="pb-2 px-1">SLA</th>
            <th className="pb-2 px-1">Status</th>
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

              <td className="px-1 truncate text-textSecondary">
                {item.category}
              </td>

              <td className="px-1 truncate text-warning font-medium">
                ⏱ {item.sla}
              </td>

              <td className="px-1">
                <span
                  className={`px-2 py-[2px] text-[9px] sm:text-xs rounded-full font-medium whitespace-nowrap ${getStatusStyle(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </td>

            </tr>
          ))}

        </tbody>
      </table>

      <div className="text-xs sm:text-sm text-textSecondary mt-4 text-center">
        Showing {visibleData.length} of {filteredData.length}
      </div>
    </div>
  );
};

export default ComplaintsTable;