import { create } from "zustand";
import { persist } from "zustand/middleware";

const defaultConfig = {
  commission: {
    enabled: true,
    type: "flat", 
    flatAmount: "100.00",
    percentage: "10",
    hybridFlat: "50.00",
    hybridPercentage: "5",
  },
  minBooking: {
    enabled: true,
    amount: "1000.00",
  },
  urgentSurcharge: {
    enabled: true,
    amount: "300.00",
  },
  cities: [
    { name: "Karachi", active: true },
    { name: "Lahore", active: true },
    { name: "Islamabad", active: false },
    { name: "Faisalabad", active: true },
  ],
};

export const useConfigStore = create(
  persist(
    (set, get) => ({
      config: defaultConfig,
      status: "saved",
      lastSaved: null,
      updateConfig: async (section, data) => {
        set({ status: "saving" });
        const updated = { ...get().config, [section]: data };
        set({ config: updated });

        try {
          // const res = await fetch("/api/config", {
          //   method: "PUT",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify(updated),
          // });
          // if (!res.ok) throw new Error("Save failed");

          await new Promise((resolve) => setTimeout(resolve, 350));

          set({ status: "saved", lastSaved: new Date() });
        } catch (err) {
          console.error("Config save failed:", err);
          set({ status: "error" });
        }
      },

      updateCity: async (index, patch) => {
        set({ status: "saving" });
        const cities = get().config.cities.map((c, i) =>
          i === index ? { ...c, ...patch } : c
        );
        const updated = { ...get().config, cities };
        set({ config: updated });

        try {
          // const res = await fetch("/api/config/cities", {
          //   method: "PUT",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify(cities),
          // });
          // if (!res.ok) throw new Error("Save failed");

          await new Promise((resolve) => setTimeout(resolve, 350));

          set({ status: "saved", lastSaved: new Date() });
        } catch (err) {
          console.error("City save failed:", err);
          set({ status: "error" });
        }
      },
    }),
    {
      name: "fixitnow_config", 
      partialize: (state) => ({ config: state.config }),
    }
  )
);