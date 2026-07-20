import { create } from "zustand";

export const useCustomerStore = create((set, get) => ({


  customers: [],
  selectedCustomer: null,
  isDrawerOpen: false,
  loading: false,

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

  setCustomers: (data) => set({ customers: data }),

  setLoading: (val) => set({ loading: val }),

  addCustomer: (customer) =>
    set((state) => ({
      customers: [customer, ...state.customers],
    })),

  updateCustomer: (updatedCustomer) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === updatedCustomer.id ? updatedCustomer : c
      ),
      selectedCustomer:
        state.selectedCustomer?.id === updatedCustomer.id
          ? updatedCustomer
          : state.selectedCustomer,
    })),

  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
      selectedCustomer:
        state.selectedCustomer?.id === id ? null : state.selectedCustomer,
    })),

  getCustomerById: (id) => {
    return get().customers.find((c) => c.id === id);
  },

}));