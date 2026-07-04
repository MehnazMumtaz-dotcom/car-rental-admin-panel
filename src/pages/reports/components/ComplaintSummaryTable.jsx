import { useState } from "react";
import { AlertCircle } from "lucide-react";

const data = [
  { status: "Total Complaints", count: 52, percentage: "100%" },
  { status: "Open", count: 16, percentage: "30.8%" },
  { status: "In Progress", count: 8, percentage: "15.4%" },
  { status: "Resolved", count: 23, percentage: "44.2%" },
  { status: "Escalated", count: 5, percentage: "9.6%" },
];

const getColor = (status) => {
  switch (status) {
    case "Open":
      return "text-red-500";
    case "In Progress":
      return "text-orange-500";
    case "Resolved":
      return "text-green-600";
    case "Escalated":
      return "text-purple-500";
    default:
      return "text-gray-800";
  }
};

const ComplaintSummaryTable = () => {
  const [showAll, setShowAll] = useState(false);

  const visibleData = showAll ? data : data.slice(0, 4);

  return (
    <div className="bg-white p-3 sm:p-4 md:p-5 rounded-xl border shadow-sm w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">

        {/* ✅ TITLE COLOR CHANGED TO GREEN */}
        <h3 className="font-semibold text-sm sm:text-base text-green-700 flex items-center gap-2">
          <AlertCircle size={18} className="text-red-500" />
          Complaint Summary
        </h3>

        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs sm:text-sm text-blue-600 hover:underline self-start sm:self-auto"
        >
          {showAll ? "Show Less" : "View All"}
        </button>

      </div>

      {/* Table */}
      <div className="overflow-x-auto sm:overflow-visible">

        <table className="w-full text-xs sm:text-sm">

          <thead>
            <tr className="border-b text-gray-500 text-left">
              <th className="py-2">Status</th>
              <th className="py-2">Count</th>
              <th className="py-2">Percentage</th>
            </tr>
          </thead>

          <tbody>
            {visibleData.map((item, i) => {
              const isTotal = item.status === "Total Complaints";

              return (
                <tr key={i} className="border-b last:border-none">

                  <td
                    className={`py-2 ${getColor(item.status)} ${
                      isTotal ? "font-semibold text-black" : ""
                    }`}
                  >
                    {item.status}
                  </td>

                  <td className={isTotal ? "font-semibold" : ""}>
                    {item.count}
                  </td>

                  <td
                    className={`${getColor(item.status)} ${
                      isTotal ? "font-semibold text-black" : ""
                    }`}
                  >
                    {item.percentage}
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-3">
        Showing {visibleData.length} of {data.length}
      </div>

    </div>
  );
};

export default ComplaintSummaryTable;