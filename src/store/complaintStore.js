import { create } from "zustand";

export const useComplaintStore = create((set) => ({
  complaints: [
    {
      complaintId: "C001",
      customer: "Ali Raza",
      category: "Vehicle Issue",
      assignedTo: "Sub-Admin",
      status: "Open",
      slaType: "Standard",
      slaDeadline: "2026-07-10T12:00:00",
    },
    {
      complaintId: "C002",
      customer: "Sara Khan",
      category: "Booking Error",
      assignedTo: "Admin",
      status: "In Progress",
      slaType: "Urgent",
      slaDeadline: "2026-07-05T10:00:00",
    },
    {
      complaintId: "C003",
      customer: "Usman Ali",
      category: "Billing",
      assignedTo: "Admin",
      status: "Open",
      slaType: "Standard",
      slaDeadline: "2026-07-12T09:00:00",
    },
    {
      complaintId: "C004",
      customer: "Ayesha Malik",
      category: "Driver Behavior",
      assignedTo: "Sub-Admin",
      status: "In Progress",
      slaType: "Urgent",
      slaDeadline: "2026-07-06T14:00:00",
    },
    {
      complaintId: "C005",
      customer: "Hassan Ahmed",
      category: "Booking Error",
      assignedTo: "Admin",
      status: "Open",
      slaType: "Standard",
      slaDeadline: "2026-07-15T18:00:00",
    },
    {
      complaintId: "C006",
      customer: "Fatima Noor",
      category: "Other",
      assignedTo: "Sub-Admin",
      status: "Escalated",
      slaType: "Urgent",
      slaDeadline: "2026-07-04T11:00:00",
    },
  ],

  selectedComplaint: null,
  loading: false,

  setComplaints: (data) => set({ complaints: data }),

  setSelectedComplaint: (complaint) =>
    set({ selectedComplaint: complaint }),

  closeDrawer: () =>
    set({ selectedComplaint: null }),

  setLoading: (value) => set({ loading: value }),
}));