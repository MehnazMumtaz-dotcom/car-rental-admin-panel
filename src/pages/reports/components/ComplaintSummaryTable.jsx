import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { useSLAStore, getComplaintStatus } from "../../../store/SLAStore";
import { useAuthStore } from "../../../store/authStore";

const getColor = (status) => {
  switch (status) {
    case "On Track":
      return "text-success";
    case "At Risk":
      return "text-warning";
    case "Breached":
      return "text-danger";
    default:
      return "text-textPrimary";
  }
};

const ComplaintSummaryTable = () => {
  const [showAll, setShowAll] = useState(false);
  const complaints = useSLAStore((s) => s.complaints);
  const adminCity = useAuthStore((s) => s.user?.city);

  const data = useMemo(() => {
    const now = Date.now();
    const active = complaints
      .filter((c) => !adminCity || c.city === adminCity)
      .map((c) => ({ ...c, ...getComplaintStatus(c, now) }));

    const total = active.length;
    const resolvedCount = complaints.filter(
      (c) => c.resolved && (!adminCity || c.city === adminCity)
    ).length;
    const onTrack = active.filter((c) => c.status === "on-track").length;
    const atRisk = active.filter((c) => c.status === "at-risk").length;
    const breached = active.filter((c) => c.status === "breached").length;

    const allComplaints = total + resolvedCount;
    const pct = (n) => (allComplaints === 0 ? "0.0%" : `${((n / allComplaints) * 100).toFixed(1)}%`);

    return [
      { status: "Total Complaints", count: allComplaints, percentage: "100%" },
      { status: "On Track", count: onTrack, percentage: pct(onTrack) },
      { status: "At Risk", count: atRisk, percentage: pct(atRisk) },
      { status: "Breached", count: breached, percentage: pct(breached) },
      { status: "Resolved", count: resolvedCount, percentage: pct(resolvedCount) },
    ];
  }, [complaints, adminCity]);

  const visibleData = showAll ? data : data.slice(0, 4);

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
            {visibleData.map((item, i) => {
              const isTotal = item.status === "Total Complaints";

              return (
                <tr key={i} className="border-b border-borderColor last:border-none">

                  <td
                    className={`py-2 ${getColor(item.status)} ${
                      isTotal ? "font-semibold text-textPrimary" : ""
                    }`}
                  >
                    {item.status}
                  </td>

                  <td className={`text-textPrimary ${isTotal ? "font-semibold" : ""}`}>
                    {item.count}
                  </td>

                  <td
                    className={`${getColor(item.status)} ${
                      isTotal ? "font-semibold text-textPrimary" : ""
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

      <div className="text-center text-xs text-textSecondary mt-3">
        Showing {visibleData.length} of {data.length}
      </div>

    </div>
  );
};

export default ComplaintSummaryTable;