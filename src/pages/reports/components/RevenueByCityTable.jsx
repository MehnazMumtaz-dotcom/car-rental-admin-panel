import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";

import { useReportStore } from "../../../store/reportStore";


const RevenueByCityTable = () => {

  const [showAll, setShowAll] = useState(false);


  const {
    revenueByCity,
    fetchReports,
  } = useReportStore();



  useEffect(() => {

    fetchReports();

  }, []);



  const totalRevenue = revenueByCity.reduce(
  (sum, item) => sum + item.revenue,
  0
);

const data = [
  ...revenueByCity.map((item) => ({
    city: item.city,
    revenue: item.revenue,
    percentage: totalRevenue
      ? ((item.revenue / totalRevenue) * 100).toFixed(1) + "%"
      : "0%",
  })),

    {
      city: "Total",
      revenue: revenueByCity.reduce(
        (sum, item) => sum + item.revenue,
        0
      ),
      percentage: "100%",
    },
  ];



  const visibleData = showAll ? data : data.slice(0, 2);



  return (
    <div className="bg-surface p-3 sm:p-4 md:p-5 rounded-xl border border-borderColor shadow-card w-full">


      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">


        <h3 className="font-semibold text-sm sm:text-base text-textPrimary flex items-center gap-2">

          <BarChart3 size={18} className="text-primary" />

          Revenue by City

        </h3>



        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs sm:text-sm text-primary hover:underline self-start sm:self-auto"
        >

          {showAll ? "Show Less" : "View All"}

        </button>


      </div>



      <div className="overflow-x-auto sm:overflow-visible">


        <table className="w-full text-xs sm:text-sm table-auto">


          <thead>

            <tr className="border-b border-borderColor text-textSecondary text-left">

              <th className="py-2 pr-2">
                City
              </th>

              <th className="py-2 pr-2">
                Revenue
              </th>

              <th className="py-2 pr-2">
                %
              </th>

            </tr>

          </thead>



          <tbody>


            {visibleData.map((item, index) => {

              const isTotal = item.city === "Total";


              return (

                <tr
                  key={index}
                  className="border-b border-borderColor last:border-none hover:bg-background transition"
                >


                  <td
                    className={`py-2 pr-2 whitespace-nowrap ${
                      isTotal
                        ? "font-semibold text-success"
                        : "text-textPrimary"
                    }`}
                  >

                    {item.city}

                  </td>



                  <td
                    className={`py-2 pr-2 whitespace-nowrap ${
                      isTotal
                        ? "font-semibold text-success"
                        : "text-textPrimary"
                    }`}
                  >

                    PKR {item.revenue.toLocaleString()}

                  </td>



                  <td
                    className={`py-2 pr-2 whitespace-nowrap ${
                      isTotal
                        ? "font-semibold text-success"
                        : "text-textPrimary"
                    }`}
                  >

                    {item.percentage}

                  </td>


                </tr>

              );

            })}



            {data.length === 0 && (

              <tr>

                <td
                  colSpan={3}
                  className="py-4 text-center text-textSecondary"
                >

                  No revenue yet.

                </td>

              </tr>

            )}


          </tbody>


        </table>


      </div>



      <div className="text-center text-xs text-textSecondary mt-3">

        Showing {visibleData.length} of {data.length}

      </div>


    </div>
  );
};


export default RevenueByCityTable;