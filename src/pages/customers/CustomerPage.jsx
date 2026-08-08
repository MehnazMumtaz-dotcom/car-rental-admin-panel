import React, { useEffect, useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import Select from "../../components/ui/Select";
import StatusBadge from "../../components/ui/StatusBadge";
import CustomerDrawer from "./CustomerDrawer";
import WalkInRegistration from "./WalkInRegistration";
import DataTable from "../../components/tables/DataTable";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useCustomerStore } from "../../store/CustomerStore";
import { useAuthStore } from "../../store/authStore";
import {
  useFetchCustomers,
  useFetchCustomerById,
  useCreateCustomer,
  useUpdateCustomerPatch,
  useDeleteCustomer,
} from "../../hooks/useCustomers";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function CustomerPage() {
  const { customers: allCustomers } = useCustomerStore();
  const loading = useCustomerStore((s) => s.loading);
  const error = useCustomerStore((s) => s.error);

  const { fetchCustomers } = useFetchCustomers();
  const { fetchById } = useFetchCustomerById();
  const { create } = useCreateCustomer();
  const { update } = useUpdateCustomerPatch();
  const { remove } = useDeleteCustomer();

  const companyId = useAuthStore(
    (s) => s.user?.companyId || s.user?.company_id
  );
  const adminCity = useAuthStore((s) => s.user?.city);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);


  useEffect(() => {
    if (companyId) {
      fetchCustomers();
    }
  }, [companyId]);

  const cityCustomers = useMemo(
    () => allCustomers,
    [allCustomers]
  );

  const searchValue = searchQuery.trim().toLowerCase();

  const filteredCustomers = cityCustomers.filter((c) => {
    return (
      (!searchValue ||
        c.name?.toLowerCase().includes(searchValue) ||
        c.phone?.includes(searchValue) ||
        c.email?.toLowerCase().includes(searchValue)) &&

      (!statusFilter ||
        c.status === statusFilter.toUpperCase())
    );
  });

  const handleRowClick = async (customer) => {
    try {
      const fullCustomer = await fetchById(customer.id);
      setSelectedCustomer(fullCustomer);
      setIsDrawerOpen(true);
    } catch (err) {
      console.error("Failed to load customer details:", err);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
  };

  useEffect(() => {
    const openWalkInCustomer = () => setIsModalOpen(true);
    window.addEventListener("openWalkInCustomer", openWalkInCustomer);
    return () =>
      window.removeEventListener("openWalkInCustomer", openWalkInCustomer);
  }, []);

  const handleAddCustomer = async (data) => {
    try {
      await create({
        name: data.name,
        phone: data.phone,
        email: data.email || "-",
        companyId: Number(companyId),
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Add customer failed:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await update(id, { status: newStatus });

      setSelectedCustomer((prev) =>
        prev?.id === id ? { ...prev, status: newStatus } : prev
      );
    } catch (err) {
      console.error("Status change failed:", err);
    }
  };

  const confirmDelete = async () => {
    if (!deleteRow) return;

    try {
      await remove(deleteRow.id);

      setSelectedCustomer((prev) =>
        prev?.id === deleteRow.id ? null : prev
      );

      setIsDrawerOpen(false);
      setShowConfirm(false);
      setDeleteRow(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteRow(null);
  };

  const columns = [
    {
      header: "ID",
      width: "6%",
      cell: (row) => (
        <span className="whitespace-nowrap font-semibold">
          {row.id}
        </span>
      ),
    },
    {
      header: "Name",
      width: "13%",
      cell: (row) => (
        <span className="whitespace-nowrap font-semibold">
          {row.name}
        </span>
      ),
    },
    {
      header: "Phone",
      width: "12%",
      cell: (row) => (
        <span className="whitespace-nowrap">
          {row.phone}
        </span>
      ),
    },
    {
      header: "Email",
      width: "22%",
      cell: (row) => (
        <span className="whitespace-nowrap">
          {row.email}
        </span>
      ),
    },
    {
      header: "Bookings",
      width: "12%",
      cell: (row) => (
        <span className="whitespace-nowrap text-center">
          {row.bookings || 0}
        </span>
      ),
    },
    {
      header: "Spent",
      width: "10%",
      cell: (row) => (
        <span className="whitespace-nowrap">
          Rs {(row.spent || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Status",
      width: "12%",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Joined",
      width: "12%",
      cell: (row) => {
        if (!row.createdAt) return "-";

        const date = new Date(row.createdAt);
        const formatted = date.toLocaleDateString("en-GB");

        return (
          <span className="whitespace-nowrap">
            {formatted}
          </span>
        );
      },
    },
    {
      header: "Actions",
      width: "12%",
      cell: (row) => (
        <div className="flex items-center justify-center gap-3 whitespace-nowrap">
          <button
            onClick={() => handleRowClick(row)}
            className="text-textSecondary hover:text-primary"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleRowClick(row)}
            className="text-textSecondary hover:text-warning"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteRow(row);
              setShowConfirm(true);
            }}
            className="text-textSecondary hover:text-danger"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-background min-h-screen p-4 md:p-6 w-full">
      <div className="bg-surface rounded-xl shadow-card p-5 md:p-6 w-full min-w-0">

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-danger/10 text-danger text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name or email"
          />

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All Status"
            options={[
              { label: "All Status", value: "" },
              { label: "Active", value: "active" },
              { label: "Suspended", value: "suspended" },
              { label: "Flagged", value: "flagged" },
            ]}
          />

          <Button onClick={resetFilters}>Reset</Button>
        </div>

        <div className="w-full overflow-x-auto lg:overflow-visible">
          <div className="min-w-[900px] lg:min-w-0">
            {loading ? (
              <div className="text-center py-10 text-textSecondary">
                Loading customers...
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredCustomers}
                onRowClick={handleRowClick}
              />
            )}
          </div>
        </div>

      </div>

      {isDrawerOpen && (
        <CustomerDrawer
          isOpen={isDrawerOpen}
          customer={selectedCustomer}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedCustomer(null);
          }}
          onStatusChange={handleStatusChange}
        />
      )}

      {isModalOpen && (
        <WalkInRegistration
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddCustomer}
        />
      )}

      <ConfirmDialog
        open={showConfirm}
        title="Delete Customer"
        message="Are you sure you want to delete this customer?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}