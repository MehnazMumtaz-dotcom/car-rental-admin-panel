import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

import { useReportStore } from "../../../store/reportStore";


const getColor = (status) => {
  switch (status) {
    case "RESOLVED":
      return "text-success";

    case "IN_PROGRESS":
      return "text-warning";

    case "OPEN":
      return "text-danger";

    default:
      return "text-textPrimary";
  }
};


const ComplaintSummaryTable = () => {

  const [showAll, setShowAll] = useState(false);


  const {
    complaintSummary,
    fetchReports,
  } = useReportStore();



  useEffect(() => {

    fetchReports();

  }, []);



  const allStatuses = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "ESCALATED",
];


const data = allStatuses.map((status) => {

  const item = complaintSummary.find(
    (c) => c.status === status
  );

  return {
    status,
    count: item?.count || 0,
    percentage: item
      ? `${item.percentage}%`
      : "0%",
  };

});


  const visibleData = showAll ? data : data.slice(0, 2);



  return (
    <div className="bg-surface p-3 sm:p-4 md:p-5 rounded-xl border border-borderColor shadow-card w-full">


      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">


        <h3 className="font-semibold text-sm sm:text-base text-textPrimary flex items-center gap-2">

          <AlertCircle size={18} className="text-danger" />

          Complaint Summary

        </h3>



        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs sm:text-sm text-primary hover:underline self-start sm:self-auto"
        >

          {showAll ? "Show Less" : "View All"}

        </button>


      </div>



      <div className="overflow-x-auto sm:overflow-visible">


        <table className="w-full text-xs sm:text-sm">


          <thead>

            <tr className="border-b border-borderColor text-textSecondary text-left">

              <th className="py-2">Status</th>

              <th className="py-2">Count</th>

              <th className="py-2">Percentage</th>

            </tr>

          </thead>



          <tbody>


            {visibleData.map((item, i) => (

              <tr
                key={i}
                className="border-b border-borderColor last:border-none"
              >


                <td
                  className={`py-2 ${getColor(item.status)}`}
                >

                  {item.status}

                </td>



                <td className="text-textPrimary">

                  {item.count}

                </td>



                <td
                  className={`${getColor(item.status)}`}
                >

                  {item.percentage}

                </td>


              </tr>

            ))}


          </tbody>


        </table>


      </div>



      <div className="text-center text-xs text-textSecondary mt-3">

        Showing {visibleData.length} of {data.length}

      </div>


    </div>
  );
};


export default ComplaintSummaryTable;