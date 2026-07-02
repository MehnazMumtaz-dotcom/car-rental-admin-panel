import SearchInput from "./SearchInput";
import Select from "./Select";

const Filters = ({ filters, setFilters }) => {
  const handleSearchChange = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleStatusChange = (value) => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  return (
    <div className="bg-surface p-4 rounded-xl shadow-card border border-borderColor">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">

        <div className="w-full md:w-1/3">
          <SearchInput
            placeholder="Search customer..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>


        <div className="w-full md:w-1/4">
          <Select
            value={filters.status}
            onChange={handleStatusChange}
            options={[
              { label: "All Status", value: "" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
        </div>

      </div>
    </div>
  );
};

export default Filters;