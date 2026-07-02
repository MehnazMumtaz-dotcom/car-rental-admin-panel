import React, { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import Select from "../../components/ui/Select";
import CustomerDrawer from "./CustomerDrawer";
import WalkInRegistration from "./WalkInRegistration";
import DataTable from "../../components/tables/DataTable";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function CustomerPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);

  const [customerList, setCustomerList] = useState([
    {
      id: "C001",
      name: "Ali Khan",
      phone: "03001234567",
      email: "ali@email.com",
      bookings: 5,
      spent: 25000,
      status: "active",
      joined: "2024-01-10",
      lastActivity: "2024-06-28",
    },
    {
      id: "C002",
      name: "Sara Ahmed",
      phone: "03111234567",
      email: "sara@email.com",
      bookings: 2,
      spent: 12000,
      status: "suspended",
      joined: "2024-02-15",
      lastActivity: "2024-05-12",
    },
    {
      id: "C003",
      name: "Usman Tariq",
      phone: "03211234567",
      email: "usman@email.com",
      bookings: 8,
      spent: 45000,
      status: "active",
      joined: "2024-03-01",
      lastActivity: "2024-06-20",
    },
    {
      id: "C004",
      name: "Ayesha Malik",
      phone: "03021234567",
      email: "ayesha@email.com",
      bookings: 1,
      spent: 5000,
      status: "flagged",
      joined: "2024-03-10",
      lastActivity: "2024-06-10",
    },
    {
      id: "C005",
      name: "Hassan Raza",
      phone: "03331234567",
      email: "hassan@email.com",
      bookings: 3,
      spent: 15000,
      status: "active",
      joined: "2024-04-05",
      lastActivity: "2024-06-25",
    },
    {
      id: "C006",
      name: "Fatima Noor",
      phone: "03451234567",
      email: "fatima@email.com",
      bookings: 6,
      spent: 32000,
      status: "suspended",
      joined: "2024-05-01",
      lastActivity: "2024-06-29",
    },
  ]);

  const searchValue = searchQuery.trim().toLowerCase();

  const filteredCustomers = customerList.filter((c) => {
    return (
      (!searchValue ||
        c.name.toLowerCase().includes(searchValue) ||
        c.phone.includes(searchValue) ||
        c.email.toLowerCase().includes(searchValue)) &&
      (!statusFilter ||
        c.status.toLowerCase() === statusFilter.toLowerCase())
    );
  });

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setIsDrawerOpen(true);
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

  const handleAddCustomer = (data) => {
    const newCustomer = {
      id: `C${String(customerList.length + 1).padStart(3, "0")}`,
      name: data.name,
      phone: data.phone,
      email: data.email || "-",
      bookings: 0,
      spent: 0,
      status: "active",
      joined: new Date().toISOString().split("T")[0],
      lastActivity: new Date().toISOString().split("T")[0],
    };

    setCustomerList((prev) => [...prev, newCustomer]);
    setIsModalOpen(false);
  };

  const handleStatusChange = (id, newStatus) => {
    setCustomerList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );

    setSelectedCustomer((prev) =>
      prev?.id === id ? { ...prev, status: newStatus } : prev
    );
  };

  const confirmDelete = () => {
    setCustomerList((prev) =>
      prev.filter((c) => c.id !== deleteRow.id)
    );

    setSelectedCustomer((prev) =>
      prev?.id === deleteRow.id ? null : prev
    );

    setIsDrawerOpen(false);
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteRow(null);
  };

  const columns = [
    { header: "ID", width: "6%", cell: (row) => <span className="whitespace-nowrap font-semibold">{row.id}</span> },
    { header: "Name", width: "13%", cell: (row) => <span className="whitespace-nowrap font-semibold">{row.name}</span> },
    { header: "Phone", width: "12%", cell: (row) => <span className="whitespace-nowrap">{row.phone}</span> },
    { header: "Email", width: "19%", cell: (row) => <span className="whitespace-nowrap">{row.email}</span> },
    { header: "Bookings", width: "11%", cell: (row) => <span className="whitespace-nowrap text-center">{row.bookings}</span> },
    { header: "Spent", width: "11%", cell: (row) => <span className="whitespace-nowrap">Rs {row.spent.toLocaleString()}</span> },
    {
      header: "Status",
      width: "10%",
      cell: (row) => {
        const styles = {
          active: "bg-green-100 text-green-700",
          suspended: "bg-red-100 text-red-700",
          flagged: "bg-yellow-100 text-yellow-700",
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${styles[row.status] || "bg-gray-100 text-gray-700"}`}>
            {row.status}
          </span>
        );
      },
    },
    { header: "Joined", width: "12%", cell: (row) => <span className="whitespace-nowrap">{row.joined}</span> },
    {
      header: "Actions",
      width: "12%",
      cell: (row) => (
        <div className="flex items-center justify-center gap-3 whitespace-nowrap">
          <button onClick={() => handleRowClick(row)} className="text-blue-500">
            <Eye size={18} />
          </button>
          <button onClick={() => handleRowClick(row)} className="text-amber-500">
            <Pencil size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteRow(row);
              setShowConfirm(true);
            }}
            className="text-red-500"
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

        <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name or email"
          />

          <Select
            placeholder="All Status"
            options={[
              { label: "Active", value: "active" },
              { label: "Suspended", value: "suspended" },
              { label: "Flagged", value: "flagged" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />

          <Button onClick={resetFilters}>Reset</Button>
        </div>

        {/* ✅ FINAL RESPONSIVE FIX */}
        <div className="w-full overflow-x-auto lg:overflow-visible">
          <div className="min-w-[900px] lg:min-w-0">
            <DataTable
              columns={columns}
              data={filteredCustomers}
              onRowClick={handleRowClick}
            />
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

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={cancelDelete}
          />
          <div className="relative z-50">
            <ConfirmDialog
              open={showConfirm}
              title="Delete Customer"
              message="Are you sure you want to delete this customer?"
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
}