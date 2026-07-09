export default function ConflictModal({
  conflict,
  onClose,
  onOverride
}) {
  return (
    <div className="fixed inset-0 bg-secondary/50 flex items-center justify-center z-[99999]">

      <div className="bg-surface text-textPrimary p-5 rounded-xl w-[400px] shadow-card border border-borderColor">

        <h2 className="text-lg font-bold text-danger mb-3">
          ⚠ Conflict Detected
        </h2>

        <p className="text-sm mb-3">
          This vehicle is already booked for selected dates.
        </p>

        <div className="bg-background p-3 rounded text-sm mb-4">
          <p><b>Vehicle:</b> {conflict?.vehicle}</p>
          <p><b>From:</b> {conflict?.startDate}</p>
          <p><b>To:</b> {conflict?.endDate}</p>
        </div>

        <p className="text-xs text-textSecondary mb-4">
          Do you want to override and continue?
        </p>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="w-1/2 border border-borderColor text-textPrimary p-2 rounded hover:bg-background"
          >
            Cancel
          </button>

          <button
            onClick={onOverride}
            className="w-1/2 bg-danger text-white p-2 rounded hover:opacity-90"
          >
            Override Booking
          </button>
        </div>

      </div>

    </div>
  );
}
