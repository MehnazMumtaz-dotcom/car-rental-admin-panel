import { create } from "zustand";
import { persist } from "zustand/middleware";

export const CATEGORIES = [
  "Billing",
  "Vehicle Issue",
  "Driver Behavior",
  "Booking Error",
  "Other",
];

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
  // 🟢 ON TRACK
  {
    id: "CMP-2025-00128",
    customer: "Ali Raza",
    category: "Billing",
    priority: "standard",
    city: "Lahore",
    deadline: now + 12 * DAY,
    assignedTo: "Sarah Ahmed",
    resolved: false,
  },

  // 🟠 AT RISK
  {
    id: "CMP-2025-00127",
    customer: "Sara Khan",
    category: "Vehicle Issue",
    priority: "urgent",
    city: "Lahore",
    deadline: now + 1 * DAY,
    assignedTo: "M. Kashif",
    resolved: false,
  },

  // 🔴 BREACHED
  {
    id: "CMP-2025-00126",
    customer: "Usman Malik",
    category: "Driver Behavior",
    priority: "standard",
    city: "Multan",
    deadline: now - 2 * HOUR,
    assignedTo: "Fatima Ali",
    resolved: false,
  },

  {
    id: "CMP-2025-00125",
    customer: "Hina Batool",
    category: "Booking Error",
    priority: "urgent",
    city: "Multan",
    deadline: now + 30 * 60 * 1000,
    assignedTo: null,
    resolved: false,
  },

  {
    id: "CMP-2025-00124",
    customer: "Ahmed Nadeem",
    category: "Billing",
    priority: "standard",
    city: "Lahore",
    deadline: now + 10 * DAY,
    assignedTo: "Junaid Tariq",
    resolved: false,
  },

  {
    id: "CMP-2025-00123",
    customer: "Bilal Sheikh",
    category: "Other",
    priority: "urgent",
    city: "Multan",
    deadline: now - 3 * HOUR,
    assignedTo: null,
    resolved: false,
  },

  {
    id: "CMP-2025-00122",
    customer: "Ayesha Noor",
    category: "Vehicle Issue",
    priority: "standard",
    city: "Lahore",
    deadline: now + 5 * DAY,
    assignedTo: "Sarah Ahmed",
    resolved: false,
  },

  {
    id: "CMP-2025-00121",
    customer: "Kashif Iqbal",
    category: "Billing",
    priority: "urgent",
    city: "Multan",
    deadline: now + 2 * DAY,
    assignedTo: "Fatima Ali",
    resolved: false,
  },

  {
    id: "CMP-2025-00120",
    customer: "Mehak Fatima",
    category: "Booking Error",
    priority: "standard",
    city: "Lahore",
    deadline: now + 8 * DAY,
    assignedTo: null,
    resolved: false,
  },

  {
    id: "CMP-2025-00119",
    customer: "Tariq Jameel",
    category: "Driver Behavior",
    priority: "urgent",
    city: "Multan",
    deadline: now + 4 * HOUR,
    assignedTo: "M. Kashif",
    resolved: false,
  },

  // KARACHI DATA
  {
    id: "CMP-2025-00118",
    customer: "Bilal Sheikh",
    category: "Billing",
    priority: "standard",
    city: "Karachi",
    deadline: now + 6 * DAY,
    assignedTo: "Sarah Ahmed",
    resolved: false,
  },
  {
    id: "CMP-2025-00117",
    customer: "Mehak Fatima",
    category: "Vehicle Issue",
    priority: "urgent",
    city: "Karachi",
    deadline: now + 1 * DAY,
    assignedTo: null,
    resolved: false,
  },
  {
    id: "CMP-2025-00114",
    customer: "Hassan Raza",
    category: "Driver Behavior",
    priority: "urgent",
    city: "Karachi",
    deadline: now - 1 * HOUR,
    assignedTo: "Ali Raza",
    resolved: false,
  },
  {
    id: "CMP-2025-00113",
    customer: "Zainab Ali",
    category: "Billing",
    priority: "standard",
    city: "Karachi",
    deadline: now + 9 * DAY,
    assignedTo: null,
    resolved: false,
  },

  // ISLAMABAD
  {
    id: "CMP-2025-00116",
    customer: "Nadia Yousaf",
    category: "Other",
    priority: "standard",
    city: "Islamabad",
    deadline: now + 11 * DAY,
    assignedTo: "Junaid Tariq",
    resolved: false,
  },
  {
    id: "CMP-2025-00115",
    customer: "Ayesha Noor",
    category: "Booking Error",
    priority: "urgent",
    city: "Islamabad",
    deadline: now + 10 * 60 * 1000,
    assignedTo: null,
    resolved: false,
  },
];

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

      getComplaintsByCity: (city) => {
        if (!city) return get().complaints;
        return get().complaints.filter((c) => c.city === city);
      },

      resolveComplaint: async (id) => {
        set({ status: "saving" });
        try {
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