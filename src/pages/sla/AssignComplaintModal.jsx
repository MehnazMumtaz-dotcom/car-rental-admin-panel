import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "../../components/ui/Button";
import { useSubAdminStore } from "../../store/subAdminStore";
import { useAuthStore } from "../../store/authStore";

export default function AssignComplaintModal({
  complaint,
  onClose,
  onAssign,
}) {
  const subAdmins = useSubAdminStore((s) => s.subAdmins);
  const fetchSubAdmins = useSubAdminStore((s) => s.fetchSubAdmins);

  const authUser = useAuthStore((s) => s.user);

  const [selectedUser, setSelectedUser] = useState("");

  const canAssign = ["ADMIN", "SUB_ADMIN"].includes(
    authUser?.role?.toUpperCase()
  );

  useEffect(() => {
    if (complaint) {
      setSelectedUser(
        complaint.assignedTo?.id
          ? String(complaint.assignedTo.id)
          : ""
      );

      fetchSubAdmins?.();
    }
  }, [complaint]);

  if (!complaint) return null;

  const currentUser = {
    ...authUser,
    name: authUser?.name || "Main Admin",
  };

  const admins = [
    ...(subAdmins || []),
    currentUser,
  ].filter(
    (u, index, self) =>
      u &&
      ["ADMIN", "SUB_ADMIN"].includes(
        u.role?.toUpperCase()
      ) &&
      self.findIndex((x) => x.id === u.id) === index
  );

  const handleSave = async () => {
    if (!selectedUser) {
      alert("Please select sub-admin");
      return;
    }

    try {
      await onAssign(
        complaint.id,
        Number(selectedUser)
      );
      onClose();
    } catch (err) {
      console.log("Assign failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/50">
      <div className="bg-surface rounded-xl shadow-card border border-borderColor w-full max-w-sm">
        
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold">
            Assign Complaint {complaint.id}
          </h2>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5">
          {canAssign ? (
            <>
              <p className="text-sm text-textSecondary mb-3">
                Assign complaint to sub-admin:
              </p>

              <select
                className="w-full border rounded-lg p-2"
                value={selectedUser}
                onChange={(e) =>
                  setSelectedUser(e.target.value)
                }
              >
                <option value="">
                  Select Admin
                </option>

                {admins.map((a) => (
                  <option
                    key={a.id}
                    value={a.id}
                  >
                    {a.name}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <div className="text-sm text-textSecondary">
              You don't have permission to assign complaints.
            </div>
          )}
        </div>

        <div className="flex gap-3 px-5 py-4 border-t">
          {canAssign && (
            <Button
              variant="primary"
              onClick={handleSave}
            >
              {complaint.assignedTo
                ? "Reassign"
                : "Assign"}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}