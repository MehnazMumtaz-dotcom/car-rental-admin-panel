export default function StatusBadge({ status }) {
  const styles = {
    active: "bg-success text-white",
    inactive: "bg-danger text-white",
    open: "bg-warning text-white",
    closed: "bg-success text-white",
    pending: "bg-primary text-white",
    suspended: "bg-danger text-white",
    flagged: "bg-warning text-white",
  };

  const key = status?.toLowerCase();

  return (
    <span
      className={`inline-block whitespace-nowrap px-2 py-1 rounded-xl text-xs font-medium capitalize ${
        styles[key] || "bg-borderColor text-textPrimary"
      }`}
    >
      {status}
    </span>
  );
}