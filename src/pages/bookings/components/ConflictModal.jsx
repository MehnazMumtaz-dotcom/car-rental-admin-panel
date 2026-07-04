export default function ConflictModal({
  conflict,
  onClose,
  onOverride
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]">

      <div className="bg-white p-5 rounded-xl w-[400px] shadow-xl">

        <h2 className="text-lg font-bold text-red-600 mb-3">
          ⚠ Conflict Detected
        </h2>

        <p className="text-sm mb-3">
          This vehicle is already booked for selected dates.
        </p>

        <div className="bg-gray-100 p-3 rounded text-sm mb-4">
          <p><b>Vehicle:</b> {conflict?.vehicle}</p>
          <p><b>From:</b> {conflict?.startDate}</p>
          <p><b>To:</b> {conflict?.endDate}</p>
        </div>

        <p className="text-xs text-gray-600 mb-4">
          Do you want to override and continue?
        </p>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="w-1/2 border p-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onOverride}
            className="w-1/2 bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Override Booking
          </button>
        </div>

      </div>

    </div>
  );
}