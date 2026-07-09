import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultCustomers = [
  {
    id: "C001",
    name: "Ali Khan",
    phone: "03001234567",
    email: "ali@email.com",
    city: "Lahore",
    bookings: 5,
    spent: 25000,
    status: "active",
    joined: "2024-01-10",
    lastActivity: "2024-06-28",
  },
  {
    id: "C002",
    name: "Sara Ahmed",
    phone: "03111234567",
    email: "sara@email.com",
    city: "Lahore",
    bookings: 2,
    spent: 12000,
    status: "suspended",
    joined: "2024-02-15",
    lastActivity: "2024-05-12",
  },
  {
    id: "C003",
    name: "Usman Tariq",
    phone: "03211234567",
    email: "usman@email.com",
    city: "Multan",
    bookings: 8,
    spent: 45000,
    status: "active",
    joined: "2024-03-01",
    lastActivity: "2024-06-20",
  },
  {
    id: "C004",
    name: "Ayesha Malik",
    phone: "03021234567",
    email: "ayesha@email.com",
    city: "Multan",
    bookings: 1,
    spent: 5000,
    status: "flagged",
    joined: "2024-03-10",
    lastActivity: "2024-06-10",
  },
  {
    id: "C005",
    name: "Hassan Raza",
    phone: "03331234567",
    email: "hassan@email.com",
    city: "Lahore",
    bookings: 3,
    spent: 15000,
    status: "active",
    joined: "2024-04-05",
    lastActivity: "2024-06-25",
  },
  {
    id: "C006",
    name: "Fatima Noor",
    phone: "03451234567",
    email: "fatima@email.com",
    city: "Multan",
    bookings: 6,
    spent: 32000,
    status: "suspended",
    joined: "2024-05-01",
    lastActivity: "2024-06-29",
  },
  {
    id: "C007",
    name: "Bilal Sheikh",
    phone: "03011234567",
    email: "bilal@email.com",
    city: "Karachi",
    bookings: 4,
    spent: 21000,
    status: "active",
    joined: "2024-02-20",
    lastActivity: "2024-06-27",
  },
  {
    id: "C008",
    name: "Mehak Fatima",
    phone: "03221234567",
    email: "mehak@email.com",
    city: "Karachi",
    bookings: 2,
    spent: 9000,
    status: "flagged",
    joined: "2024-04-15",
    lastActivity: "2024-06-18",
  },
  {
    id: "C009",
    name: "Tariq Jameel",
    phone: "03331234567",
    email: "tariq@email.com",
    city: "Islamabad",
    bookings: 7,
    spent: 38000,
    status: "active",
    joined: "2024-01-25",
    lastActivity: "2024-06-30",
  },
  {
    id: "C010",
    name: "Nadia Yousaf",
    phone: "03441234567",
    email: "nadia@email.com",
    city: "Islamabad",
    bookings: 1,
    spent: 4000,
    status: "suspended",
    joined: "2024-05-20",
    lastActivity: "2024-06-15",
  },
];

export const useCustomerStore = create(
  persist(
    (set, get) => ({
      customers: defaultCustomers,
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

      openCustomer: (c) => set({ selectedCustomer: c, isDrawerOpen: true }),
      closeCustomer: () => set({ selectedCustomer: null, isDrawerOpen: false }),

      getCustomersByCity: (city) => {
        if (!city) return get().customers;
        return get().customers.filter((c) => c.city === city);
      },

      addCustomer: (customer) => {
        const newCustomer = {
          id: `C${String(get().customers.length + 1).padStart(3, "0")}`,
          bookings: 0,
          spent: 0,
          status: "active",
          joined: new Date().toISOString().split("T")[0],
          lastActivity: new Date().toISOString().split("T")[0],
          ...customer,
        };
        set((state) => ({ customers: [...state.customers, newCustomer] }));
      },

      updateCustomerStatus: (id, status) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, status } : c
          ),
          selectedCustomer:
            state.selectedCustomer?.id === id
              ? { ...state.selectedCustomer, status }
              : state.selectedCustomer,
        }));
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
          selectedCustomer:
            state.selectedCustomer?.id === id ? null : state.selectedCustomer,
        }));
      },
    }),
    {
      name: "fixitnow_customers",
      partialize: (state) => ({ customers: state.customers }),
    }
  )
);