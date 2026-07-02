export default function SideDrawer({ isOpen, onClose, children }) {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "visible" : "invisible"}`}>
            <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-surface shadow-lg p-4 overflow-y-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="mb-4 text-danger font-medium hover:underline"
        >
          ✕ Close
        </button>

        {children}
      </div>
    </div>
  );
}