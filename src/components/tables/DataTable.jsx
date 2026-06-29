import React, { useState, useMemo, useEffect } from "react";

export default function DataTable({
  columns = [],
  data = [],
  renderRow,

  totalPages: serverTotalPages,
  currentPage: serverCurrentPage,
  onPageChange,
  onSortChange,
}) {
  const rowsPerPage = 5;

  const [localPage, setLocalPage] = useState(1);

  const isServerMode =
    typeof serverCurrentPage === "number" &&
    typeof serverTotalPages === "number";

  const currentPage = isServerMode ? serverCurrentPage : localPage;

  const totalPages = isServerMode
    ? serverTotalPages
    : Math.ceil(data.length / rowsPerPage);

  
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (!isServerMode) {
      setLocalPage(1);
    }
  }, [data]);

  const paginatedData = useMemo(() => {
    if (isServerMode) return data;

    const start = (localPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, localPage, isServerMode]);

  const handlePrev = () => {
    if (currentPage === 1) return;

    if (isServerMode) {
      onPageChange?.(currentPage - 1, rowsPerPage);
    } else {
      setLocalPage((p) => Math.max(p - 1, 1));
    }
  };

  const handleNext = () => {
    if (currentPage === totalPages) return;

    if (isServerMode) {
      onPageChange?.(currentPage + 1, rowsPerPage);
    } else {
      setLocalPage((p) => Math.min(p + 1, totalPages));
    }
  };

  const handleSort = (col) => {
    if (!col.sortable) return;

    let newOrder = "asc";

    if (sortField === col.accessor) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    setSortField(col.accessor);
    setSortOrder(newOrder);


    if (isServerMode) {
      onSortChange?.({
        field: col.accessor,
        order: newOrder,
        page: 1,
        limit: rowsPerPage,
      });
      return;
    }

    const sorted = [...data].sort((a, b) => {
      const valA = a[col.accessor];
      const valB = b[col.accessor];

      if (valA < valB) return newOrder === "asc" ? -1 : 1;
      if (valA > valB) return newOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  return (
    <div className="bg-surface rounded-xl border border-borderColor shadow-card flex flex-col w-full min-h-[200px]">
      <div className="flex-1 min-h-0 overflow-hidden">
        <table className="w-full text-sm table-fixed">

          <thead className="bg-background border-b border-borderColor text-textSecondary">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  onClick={() => handleSort(col)}
                  className={`px-3 py-2 text-left ${
                    col.sortable ? "cursor-pointer select-none" : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.header}

                    {col.sortable && sortField === col.accessor && (
                      <span className="text-xs">
                        {sortOrder === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="text-center py-6 text-textSecondary"
                >
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) =>
                renderRow ? renderRow(row, index) : null
              )
            )}
          </tbody>

        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-borderColor bg-surface">

        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-lg text-sm ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primaryHover"
          }`}
        >
          Previous
        </button>

        <span className="text-sm text-textSecondary">
          Page{" "}
          <span className="text-textPrimary font-semibold">
            {currentPage}
          </span>{" "}
          of {totalPages || 1}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-3 py-1 rounded-lg text-sm ${
            currentPage === totalPages || totalPages === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primaryHover"
          }`}
        >
          Next
        </button>

      </div>
    </div>
  );
}