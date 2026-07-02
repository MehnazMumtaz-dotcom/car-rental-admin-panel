import React, { useState, useMemo, useEffect } from "react";

export default function DataTable({
  columns = [],
  data = [],
  progressPending = false,
  onRowClick,
}) {
  const rowsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, currentPage]);

  return (
    <div className="w-full overflow-hidden">

      {/* LOADING */}
      {progressPending && (
        <div className="p-4 text-center text-gray-500">
          Loading...
        </div>
      )}

      {/* TABLE */}
      <div className="w-full overflow-hidden">
        <table className="w-full table-fixed text-sm">

          {/* HEADER */}
          <thead className="bg-gray-100 border-b">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  style={{
                    width: col.width,
                  }}
                  className="px-4 py-3 text-left font-medium text-gray-600 whitespace-normal break-words"
                >
                  {col.header || col.name}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row.id || index}
                  onClick={() => onRowClick?.(row)}
                  className="border-b hover:bg-gray-50 cursor-pointer transition"
                >
                  {columns.map((col, i) => (
                    <td
                      key={i}
                      style={{
                        width: col.width,
                      }}
                      className="px-4 py-3 align-middle min-w-0 whitespace-normal break-words"
                    >
                      {col.cell
                        ? col.cell(row)
                        : col.selector
                        ? col.selector(row)
                        : col.accessor
                        ? row[col.accessor]
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 px-2">

        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
}
