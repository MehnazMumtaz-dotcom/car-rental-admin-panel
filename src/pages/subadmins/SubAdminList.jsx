import React, { useMemo, useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { useSubAdminStore, PERMISSIONS } from "../../store/SubAdminStore";
import { useAuthStore } from "../../store/authStore";
import SearchInput from "../../components/ui/SearchInput";
import Select from "../../components/ui/Select";
import StatusBadge from "../../components/ui/StatusBadge";
import EditSubAdminModal from "./EditSubAdminModal";

const PAGE_SIZE = 4;

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function SubAdminList() {
  const allSubAdmins = useSubAdminStore((s) => s.subAdmins);
  const deleteSubAdmin = useSubAdminStore((s) => s.deleteSubAdmin);
  const updateSubAdmin = useSubAdminStore((s) => s.updateSubAdmin);
  const adminCity = useAuthStore((s) => s.user?.city);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [editingAdmin, setEditingAdmin] = useState(null);

  const subAdmins = useMemo(
    () => allSubAdmins.filter((a) => !adminCity || a.city === adminCity),
    [allSubAdmins, adminCity]
  );

  const filtered = useMemo(() => {
    return subAdmins.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? a.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [subAdmins, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const toggleStatus = (admin) => {
    updateSubAdmin(
      admin.id,
      { status: admin.status === "active" ? "inactive" : "active" },
      `Status changed for "${admin.name}"`
    );
  };

  const handleSaveEdit = (id, draft) => {
    updateSubAdmin(id, draft, `Sub-admin "${draft.name}" updated`);
  };

  return (
    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-red-600">Sub-Admin List</h2>
          <p className="text-sm text-textSecondary">
            All sub-admin accounts in your organization
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="w-full sm:w-56">
            <SearchInput
              placeholder="Search sub-admin..."
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
            />
          </div>
          <div className="w-full sm:w-40">
            <Select
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              placeholder="All Status"
              options={[
                { label: "All Status", value: "" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="w-full">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[6%]" />
            <col className="w-[18%]" />
            <col className="w-[24%] hidden md:table-column" />
            <col className="w-[12%]" />
            <col className="w-[10%] hidden sm:table-column" />
            <col className="w-[14%] hidden lg:table-column" />
            <col className="w-[16%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-borderColor text-left text-textSecondary">
              <th className="py-2 font-medium">#</th>
              <th className="py-2 font-medium">Name</th>
              <th className="py-2 font-medium hidden md:table-cell">Email</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium hidden sm:table-cell">Perms</th>
              <th className="py-2 font-medium hidden lg:table-cell">
                Last Login
              </th>
              <th className="py-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((admin, idx) => (
              <tr
                key={admin.id}
                className="border-b border-borderColor last:border-0"
              >
                <td className="py-3 text-textSecondary">
                  {(currentPage - 1) * PAGE_SIZE + idx + 1}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                      {initials(admin.name)}
                    </span>
                    <span className="font-medium text-textPrimary truncate">
                      {admin.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-textSecondary hidden md:table-cell">
                  <span className="truncate block">{admin.email}</span>
                </td>
                <td className="py-3">
                  <button onClick={() => toggleStatus(admin)}>
                    <StatusBadge status={admin.status} />
                  </button>
                </td>
                <td className="py-3 text-textPrimary hidden sm:table-cell">
                  {admin.permissions.length}/{PERMISSIONS.length}
                </td>
                <td className="py-3 text-textSecondary hidden lg:table-cell whitespace-nowrap">
                  {admin.lastLogin}
                </td>
                <td className="py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      className="text-textSecondary hover:text-primary shrink-0"
                      aria-label="Edit sub-admin"
                      onClick={() => setEditingAdmin(admin)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="text-danger hover:opacity-80 shrink-0"
                      aria-label="Delete sub-admin"
                      onClick={() => deleteSubAdmin(admin.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-textSecondary"
                >
                  No sub-admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
        <p className="text-xs text-textSecondary">
          Showing {paginated.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{" "}
          {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
          entries
        </p>
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2 py-1 rounded-lg border border-borderColor text-textSecondary disabled:opacity-40"
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`px-3 py-1 rounded-lg text-sm ${
                n === currentPage
                  ? "bg-primary text-white"
                  : "border border-borderColor text-textPrimary"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-2 py-1 rounded-lg border border-borderColor text-textSecondary disabled:opacity-40"
          >
            {">"}
          </button>
        </div>
      </div>

      <EditSubAdminModal
        admin={editingAdmin}
        onClose={() => setEditingAdmin(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}


