import { create } from "zustand";
import { persist } from "zustand/middleware";

// Fixed AI-sorted categories (per spec: Billing, Vehicle Issue, Driver Behavior, Booking Error, Other)
export const CATEGORIES = [
  "Billing",
  "Vehicle Issue",
  "Driver Behavior",
  "Booking Error",
  "Other",
];

// Standard = 14 days, Urgent = 7 days (urgent costs the customer extra)
export const PRIORITIES = [
  { key: "standard", label: "Standard", slaDays: 14 },
  { key: "urgent", label: "Urgent", slaDays: 7 },
];

export const AGENTS = [
  "Sarah Ahmed",
  "M. Kashif",
  "Fatima Ali",
  "Junaid Tariq",
  "Ali Raza",
];

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const now = Date.now();

const defaultComplaints = [
  {
    id: "CMP-2025-00128",
    customer: "Ali Raza",
    category: "Billing",
    priority: "standard",
    city: "Lahore",
    deadline: now + 10 * DAY + 4 * HOUR + 32 * 60 * 1000,
    assignedTo: "Sarah Ahmed",
    resolved: false,
  },
  {
    id: "CMP-2025-00127",
    customer: "Sara Khan",
    category: "Vehicle Issue",
    priority: "urgent",
    city: "Lahore",
    deadline: now + 1 * DAY + 6 * HOUR + 15 * 60 * 1000,
    assignedTo: "M. Kashif",
    resolved: false,
  },
  {
    id: "CMP-2025-00126",
    customer: "Usman Malik",
    category: "Driver Behavior",
    priority: "standard",
    city: "Multan",
    deadline: now + 3 * DAY + 2 * HOUR + 45 * 60 * 1000,
    assignedTo: "Fatima Ali",
    resolved: false,
  },
  {
    id: "CMP-2025-00125",
    customer: "Hina Batool",
    category: "Booking Error",
    priority: "urgent",
    city: "Multan",
    deadline: now + 45 * 60 * 1000,
    assignedTo: null,
    resolved: false,
  },
  {
    id: "CMP-2025-00124",
    customer: "Ahmed Nadeem",
    category: "Billing",
    priority: "standard",
    city: "Lahore",
    deadline: now + 12 * DAY + 18 * HOUR + 10 * 60 * 1000,
    assignedTo: "Junaid Tariq",
    resolved: false,
  },
  {
    id: "CMP-2025-00123",
    customer: "Bilal Sheikh",
    category: "Other",
    priority: "urgent",
    city: "Multan",
    deadline: now - (2 * HOUR + 20 * 60 * 1000),
    assignedTo: null,
    resolved: false,
  },
  {
    id: "CMP-2025-00122",
    customer: "Ayesha Noor",
    category: "Vehicle Issue",
    priority: "standard",
    city: "Lahore",
    deadline: now + 6 * DAY + 2 * HOUR,
    assignedTo: "Sarah Ahmed",
    resolved: false,
  },
  {
    id: "CMP-2025-00121",
    customer: "Kashif Iqbal",
    category: "Billing",
    priority: "urgent",
    city: "Multan",
    deadline: now + 4 * DAY,
    assignedTo: "Fatima Ali",
    resolved: false,
  },
  {
    id: "CMP-2025-00120",
    customer: "Mehak Fatima",
    category: "Booking Error",
    priority: "standard",
    city: "Lahore",
    deadline: now + 9 * DAY,
    assignedTo: null,
    resolved: false,
  },
  {
    id: "CMP-2025-00119",
    customer: "Tariq Jameel",
    category: "Driver Behavior",
    priority: "urgent",
    city: "Multan",
    deadline: now + 5 * HOUR,
    assignedTo: "M. Kashif",
    resolved: false,
  },
];

// Given a complaint and the current time, derive its live SLA status.
// "at-risk" once less than 25% of the total SLA window remains.
export function getComplaintStatus(complaint, nowTs) {
  const priorityMeta = PRIORITIES.find((p) => p.key === complaint.priority);
  const totalMs = (priorityMeta?.slaDays || 7) * DAY;
  const msLeft = complaint.deadline - nowTs;

  let status = "on-track";
  if (msLeft <= 0) status = "breached";
  else if (msLeft < totalMs * 0.25) status = "at-risk";

  return { msLeft, status, totalMs };
}

export function formatTimeLeft(msLeft) {
  const abs = Math.abs(msLeft);
  const d = Math.floor(abs / DAY);
  const h = Math.floor((abs % DAY) / HOUR);
  const m = Math.floor((abs % HOUR) / (60 * 1000));

  const sign = msLeft < 0 ? "-" : "";
  if (d > 0) return `${sign}${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
  return `${sign}${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
}

export const useSLAStore = create(
  persist(
    (set, get) => ({
      complaints: defaultComplaints,
      status: "saved",

      // Multi-tenant: only complaints belonging to the admin's own city
      getComplaintsByCity: (city) => {
        if (!city) return get().complaints;
        return get().complaints.filter((c) => c.city === city);
      },

      resolveComplaint: async (id) => {
        set({ status: "saving" });
        try {
          // const res = await fetch(`/api/complaints/${id}/resolve`, { method: "POST" });
          // if (!res.ok) throw new Error("Resolve failed");

          await new Promise((resolve) => setTimeout(resolve, 300));

          set((state) => ({
            complaints: state.complaints.map((c) =>
              c.id === id ? { ...c, resolved: true } : c
            ),
            status: "saved",
          }));
        } catch (err) {
          console.error("Resolve complaint failed:", err);
          set({ status: "error" });
        }
      },
      assignComplaint: async (id, agentName) => {
        set({ status: "saving" });
        try {
          // const res = await fetch(`/api/complaints/${id}/assign`, {
          //   method: "PUT",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify({ assignedTo: agentName }),
          // });
          // if (!res.ok) throw new Error("Assign failed");

          await new Promise((resolve) => setTimeout(resolve, 300));

          set((state) => ({
            complaints: state.complaints.map((c) =>
              c.id === id ? { ...c, assignedTo: agentName } : c
            ),
            status: "saved",
          }));
        } catch (err) {
          console.error("Assign complaint failed:", err);
          set({ status: "error" });
        }
      },

      refresh: async () => {
        set({ status: "saving" });
        try {
          // const res = await fetch("/api/complaints");
          // const data = await res.json();
          // set({ complaints: data, status: "saved" });

          await new Promise((resolve) => setTimeout(resolve, 400));
          set({ status: "saved" });
        } catch (err) {
          console.error("Refresh failed:", err);
          set({ status: "error" });
        }
      },
    }),
    {
      name: "fixitnow_sla_complaints",
      partialize: (state) => ({ complaints: state.complaints }),
    }
  )
);