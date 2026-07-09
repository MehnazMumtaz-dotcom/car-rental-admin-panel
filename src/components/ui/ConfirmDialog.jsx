import React from "react";

const ConfirmDialog = ({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-secondary/50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-surface rounded-xl shadow-card border border-borderColor w-full max-w-sm p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-textPrimary mb-2">{title}</h3>
        <p className="text-sm text-textSecondary mb-5">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl font-medium text-sm border border-borderColor text-textPrimary hover:bg-background transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-xl font-medium text-sm bg-danger text-white hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

