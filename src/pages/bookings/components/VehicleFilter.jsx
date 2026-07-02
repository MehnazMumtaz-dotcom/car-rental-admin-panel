import React from "react";
import Select from "../../../components/ui/Select";

export default function VehicleFilter({ value, onChange }) {
  const options = [
    { label: "All Cars", value: "" },
    { label: "Toyota Corolla", value: "corolla" },
    { label: "Honda Civic", value: "civic" },
    { label: "Suzuki Alto", value: "alto" },
  ];

  return (
    <Select
      label="Select Car"
      options={options}
      value={value}
      onChange={onChange}
    />
  );
}