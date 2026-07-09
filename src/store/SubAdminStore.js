import { create } from "zustand";
import { persist } from "zustand/middleware";

export const PERMISSIONS = [
  { key: "dashboard", label: "Dashboard", desc: "View dashboard" },
  { key: "complaints", label: "Complaints", desc: "Manage complaints" },
  { key: "bookingCalendar", label: "Booking Calendar", desc: "Manage bookings" },
  { key: "customers", label: "Customers", desc: "Manage customers" },
  { key: "configPanel", label: "Config Panel", desc: "Manage settings" },
  { key: "reports", label: "Reports", desc: "View reports" },
  { key: "subAdmins", label: "Sub-Admins", desc: "Manage sub-admins" },
  { key: "auditLog", label: "Audit Log", desc: "View audit logs" },
];

const defaultSubAdmins = [
  {
    id: 1,
    name: "Farhan Ali",
    email: "farhan@rental.com",
    city: "Lahore",
    status: "active",
    permissions: ["dashboard", "complaints", "bookingCalendar", "customers", "auditLog"],
    lastLogin: "Today, 10:30 AM",
  },
  {
    id: 2,
    name: "Sarah Khan",
    email: "sarah@rental.com",
    city: "Lahore",
    status: "active",
    permissions: ["dashboard", "complaints", "customers"],
    lastLogin: "Today, 09:15 AM",
  },
  {
    id: 3,
    name: "Ali Raza",
    email: "ali@rental.com",
    city: "Multan",
    status: "inactive",
    permissions: ["dashboard", "reports"],
    lastLogin: "2 days ago",
  },
  {
    id: 4,
    name: "Noor Fatima",
    email: "noor@rental.com",
    city: "Multan",
    status: "active",
    permissions: ["dashboard", "bookingCalendar", "customers", "reports"],
    lastLogin: "Yesterday, 04:45 PM",
  },
  {
    id: 5,
    name: "Bilal Sheikh",
    email: "bilal.sheikh@rental.com",
    city: "Karachi",
    status: "active",
    permissions: ["dashboard", "complaints"],
    lastLogin: "Today, 08:00 AM",
  },
  {
    id: 6,
    name: "Nadia Yousaf",
    email: "nadia.yousaf@rental.com",
    city: "Islamabad",
    status: "inactive",
    permissions: ["dashboard"],
    lastLogin: "3 days ago",
  },
];

const defaultAuditLog = [
  {
    id: 1,
    action: 'Sub-admin "Farhan Ali" created',
    by: "Admin",
    time: "Today, 10:30 AM",
    type: "create",
  },
  {
    id: 2,
    action: 'Permissions updated for "Sarah Khan"',
    by: "Admin",
    time: "Today, 09:15 AM",
    type: "update",
  },
  {
    id: 3,
    action: 'Sub-admin "Umair Ahmed" deleted',
    by: "Admin",
    time: "Yesterday, 06:20 PM",
    type: "delete",
  },
  {
    id: 4,
    action: 'Login by "Noor Fatima"',
    by: "System",
    time: "Yesterday, 04:45 PM",
    type: "login",
  },
];

function addLog(entries, action, type) {
  const entry = {
    id: Date.now(),
    action,
    by: "Admin",
    time: "Just now",
    type,
  };
  return [entry, ...entries];
}

export const useSubAdminStore = create(
  persist(
    (set, get) => ({
      subAdmins: defaultSubAdmins,
      auditLog: defaultAuditLog,
      status: "saved", 
      getStats: () => {
        const list = get().subAdmins;
        const total = list.length;
        const active = list.filter((a) => a.status === "active").length;
        const fullAccess = list.filter(
          (a) => a.permissions.length === PERMISSIONS.length
        ).length;
        const restricted = total - fullAccess;
        return { total, active, fullAccess, restricted };
      },

      createSubAdmin: async ({ name, email, status, permissions, city }) => {
        set({ status: "saving" });
        try {
          // const res = await fetch("/api/sub-admins", {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify({ name, email, status, permissions, city }),
          // });
          // if (!res.ok) throw new Error("Create failed");

          await new Promise((resolve) => setTimeout(resolve, 300));

          const newAdmin = {
            id: Date.now(),
            name,
            email,
            city: city || "",
            status: status || "active",
            permissions: permissions || [],
            lastLogin: "Never",
          };

          set((state) => ({
            subAdmins: [newAdmin, ...state.subAdmins],
            auditLog: addLog(
              state.auditLog,
              `Sub-admin "${name}" created`,
              "create"
            ),
            status: "saved",
          }));
        } catch (err) {
          console.error("Create sub-admin failed:", err);
          set({ status: "error" });
        }
      },

      updateSubAdmin: async (id, patch, logMessage) => {
        set({ status: "saving" });
        try {
          // const res = await fetch(`/api/sub-admins/${id}`, {
          //   method: "PUT",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify(patch),
          // });
          // if (!res.ok) throw new Error("Update failed");

          await new Promise((resolve) => setTimeout(resolve, 300));

          set((state) => {
            const target = state.subAdmins.find((a) => a.id === id);
            const message =
              logMessage ||
              (target ? `Permissions updated for "${target.name}"` : "Sub-admin updated");

            return {
              subAdmins: state.subAdmins.map((a) =>
                a.id === id ? { ...a, ...patch } : a
              ),
              auditLog: addLog(state.auditLog, message, "update"),
              status: "saved",
            };
          });
        } catch (err) {
          console.error("Update sub-admin failed:", err);
          set({ status: "error" });
        }
      },

      deleteSubAdmin: async (id) => {
        set({ status: "saving" });
        try {
          // const res = await fetch(`/api/sub-admins/${id}`, { method: "DELETE" });
          // if (!res.ok) throw new Error("Delete failed");

          await new Promise((resolve) => setTimeout(resolve, 300));

          set((state) => {
            const target = state.subAdmins.find((a) => a.id === id);
            return {
              subAdmins: state.subAdmins.filter((a) => a.id !== id),
              auditLog: addLog(
                state.auditLog,
                `Sub-admin "${target?.name || "Unknown"}" deleted`,
                "delete"
              ),
              status: "saved",
            };
          });
        } catch (err) {
          console.error("Delete sub-admin failed:", err);
          set({ status: "error" });
        }
      },
    }),
    {
      name: "fixitnow_subadmins",
      partialize: (state) => ({
        subAdmins: state.subAdmins,
        auditLog: state.auditLog,
      }),
    }
  )
);