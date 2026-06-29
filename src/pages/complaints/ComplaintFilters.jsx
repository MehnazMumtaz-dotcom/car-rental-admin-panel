import { useState } from "react";

export default function ComplaintFilters({ onApply }) {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    slaType: "",
    assignedTo: "",
    slaStatus: "",
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    const resetData = {
      search: "",
      status: "",
      category: "",
      slaType: "",
      assignedTo: "",
      slaStatus: "",
    };

    setFilters(resetData);
    onApply(resetData);
  };

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <div className="bg-surface p-4 rounded-xl shadow-card border border-borderColor flex flex-col gap-4">

      <div className="flex flex-wrap gap-3">

        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search by ID or Customer"
          className="flex-1 min-w-[200px] px-3 py-2 border border-borderColor rounded-xl bg-surface text-textPrimary focus:ring-2 focus:ring-primary outline-none"
        />

        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="min-w-[160px] px-3 py-2 border border-borderColor rounded-xl bg-surface text-textPrimary focus:ring-2 focus:ring-primary"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="inprogress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="min-w-[160px] px-3 py-2 border border-borderColor rounded-xl bg-surface text-textPrimary focus:ring-2 focus:ring-primary"
        >
          <option value="">All Categories</option>
          <option value="billing">Billing</option>
          <option value="vehicle">Vehicle Issue</option>
          <option value="driver">Driver Behavior</option>
          <option value="booking">Booking Error</option>
          <option value="other">Other</option>
        </select>

        <select
          name="slaType"
          value={filters.slaType}
          onChange={handleChange}
          className="min-w-[160px] px-3 py-2 border border-borderColor rounded-xl bg-surface text-textPrimary focus:ring-2 focus:ring-primary"
        >
          <option value="">All SLA Type</option>
          <option value="standard">Standard</option>
          <option value="urgent">Urgent</option>
        </select>

        <select
          name="assignedTo"
          value={filters.assignedTo}
          onChange={handleChange}
          className="min-w-[160px] px-3 py-2 border border-borderColor rounded-xl bg-surface text-textPrimary focus:ring-2 focus:ring-primary"
        >
          <option value="">All Assigned</option>
          <option value="admin">Admin</option>
          <option value="subadmin">Sub-Admin</option>
        </select>

  
        <select
          name="slaStatus"
          value={filters.slaStatus}
          onChange={handleChange}
          className="min-w-[180px] px-3 py-2 border border-borderColor rounded-xl bg-surface text-textPrimary focus:ring-2 focus:ring-primary"
        >
          <option value="">All SLA Status</option>
          <option value="active">Active</option>
          <option value="near">Near Deadline</option>
          <option value="overdue">Overdue</option>
        </select>

      </div>

      <div className="flex flex-wrap justify-end gap-2">

        <button
          onClick={handleReset}
          className="px-4 py-2 border border-borderColor rounded-xl text-textPrimary hover:bg-background transition"
        >
          Reset
        </button>

        <button
          onClick={handleApply}
          className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primaryHover transition"
        >
          Apply Filters
        </button>

      </div>
    </div>
  );
}