import React from "react";
import { RefreshCw } from "lucide-react";
import { CATEGORIES, PRIORITIES } from "../../store/SLAStore";
import SearchInput from "../../components/ui/SearchInput";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

export default function ComplaintFilters({ filters, setFilters, onRefresh, isRefreshing }) {
  const update = (field) => (value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
        <Select
          value={filters.status}
          onChange={update("status")}
          placeholder="All Status"
          options={[
            { label: "All Status", value: "" },
            { label: "On Track", value: "on-track" },
            { label: "At Risk", value: "at-risk" },
            { label: "Breached", value: "breached" },
          ]}
        />
        <Select
          value={filters.priority}
          onChange={update("priority")}
          placeholder="All Priority"
          options={[
            { label: "All Priority", value: "" },
            ...PRIORITIES.map((p) => ({ label: p.label, value: p.key })),
          ]}
        />
        <Select
          value={filters.category}
          onChange={update("category")}
          placeholder="All Categories"
          options={[
            { label: "All Categories", value: "" },
            ...CATEGORIES.map((c) => ({ label: c, value: c })),
          ]}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">
        <div className="w-full sm:w-64">
          <SearchInput
            placeholder="Search complaint ID..."
            value={filters.search}
            onChange={update("search")}
          />
        </div>
        <Button variant="outline" onClick={onRefresh}>
          <span className="flex items-center gap-2 whitespace-nowrap">
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </span>
        </Button>
      </div>
    </div>
  );
}
