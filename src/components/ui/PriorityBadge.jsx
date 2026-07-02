export default function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-danger text-white",
    Medium: "bg-warning text-white",
    Low: "bg-success text-white",
  };

  return (
    <span className={`px-2 py-1 rounded-xl text-sm ${styles[priority]}`}>
      {priority}
    </span>
  );
}