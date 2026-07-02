import { create } from "zustand";

export const useCustomerStore = create((set) => ({
  customers: [
    {
      id: "C001",
      name: "Ali Khan",
      phone: "03001234567",
      email: "ali@gmail.com",
      status: "Active",
      type: "App User",
      city: "Lahore",
      totalBookings: 5,
      totalSpent: 45000,
      joined: "2024-01-10",
      lastActivity: "2024-02-01",
    },
  ],

  selectedCustomer: null,
  isDrawerOpen: false,

  filters: {
    search: "",
    status: "",
    city: "",
    type: "",
  },

  setFilters: (f) =>
    set((state) => ({
      filters: { ...state.filters, ...f },
    })),

  openCustomer: (c) =>
    set({ selectedCustomer: c, isDrawerOpen: true }),

  closeCustomer: () =>
    set({ selectedCustomer: null, isDrawerOpen: false }),
}));