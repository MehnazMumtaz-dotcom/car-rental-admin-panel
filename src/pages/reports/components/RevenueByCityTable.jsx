import { useState } from "react";
import { BarChart3 } from "lucide-react";

const data = [
  { city: "Karachi", revenue: "350,000", percentage: "28.1%" },
  { city: "Lahore", revenue: "250,000", percentage: "20.1%" },
  { city: "Islamabad", revenue: "180,000", percentage: "14.4%" },
  { city: "Faisalabad", revenue: "120,000", percentage: "9.6%" },
  { city: "Rawalpindi", revenue: "80,000", percentage: "6.4%" },
  { city: "Total", revenue: "1,245,750", percentage: "100%" },
];

const RevenueByCityTable = () => {
  const [showAll, setShowAll] = useState(false);

  const visibleData = showAll ? data : data.slice(0, 4);

  return (
    <div className="bg-white p-3 sm:p-4 md:p-5 rounded-xl border shadow-sm w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">

        {/* Title unchanged, only icon color changed */}
        <h3 className="font-semibold text-sm sm:text-base text-green-700 flex items-center gap-2">
          <BarChart3 size={18} className="text-red-500" />
          Revenue by City
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

        <table className="w-full text-xs sm:text-sm table-auto">

          <thead>
            <tr className="border-b text-gray-500 text-left">
              <th className="py-2 pr-2">City</th>
              <th className="py-2 pr-2">Revenue</th>
              <th className="py-2 pr-2">%</th>
            </tr>
          </thead>

          <tbody>
            {visibleData.map((item, index) => {
              const isTotal = item.city === "Total";

              return (
                <tr
                  key={index}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  <td
                    className={`py-2 pr-2 whitespace-nowrap ${
                      isTotal ? "font-semibold text-green-600" : ""
                    }`}
                  >
                    {item.city}
                  </td>

                  <td
                    className={`py-2 pr-2 whitespace-nowrap ${
                      isTotal ? "font-semibold text-green-600" : ""
                    }`}
                  >
                    PKR {item.revenue}
                  </td>

                  <td
                    className={`py-2 pr-2 whitespace-nowrap ${
                      isTotal ? "font-semibold text-green-600" : ""
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

export default RevenueByCityTable;