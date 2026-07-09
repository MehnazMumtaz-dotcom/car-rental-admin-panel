import { create } from "zustand";
import { persist } from "zustand/middleware";

export const defaultCityConfig = () => ({
  active: true,
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
});

const defaultConfigs = {
  Lahore: defaultCityConfig(),
  Multan: defaultCityConfig(),
  Karachi: defaultCityConfig(),
  Islamabad: { ...defaultCityConfig(), active: false },
};

export const useConfigStore = create(
  persist(
    (set, get) => ({
      configs: defaultConfigs,
      status: "saved",
      lastSaved: null,

      getConfigForCity: (city) => {
        return get().configs[city] || defaultCityConfig();
      },

      updateConfig: async (city, section, data) => {
        if (!city) return;
        set({ status: "saving" });

        const cityConfig = get().configs[city] || defaultCityConfig();
        const updatedCityConfig = { ...cityConfig, [section]: data };
        const updatedConfigs = { ...get().configs, [city]: updatedCityConfig };
        set({ configs: updatedConfigs });

        try {
          // const res = await fetch(`/api/config/${city}`, {
          //   method: "PUT",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify(updatedCityConfig),
          // });
          // if (!res.ok) throw new Error("Save failed");

          await new Promise((resolve) => setTimeout(resolve, 350));

          set({ status: "saved", lastSaved: new Date() });
        } catch (err) {
          console.error("Config save failed:", err);
          set({ status: "error" });
        }
      },

      toggleCityActive: async (city, active) => {
        if (!city) return;
        set({ status: "saving" });

        const cityConfig = get().configs[city] || defaultCityConfig();
        const updatedConfigs = {
          ...get().configs,
          [city]: { ...cityConfig, active },
        };
        set({ configs: updatedConfigs });

        try {
          // const res = await fetch(`/api/config/${city}/status`, {
          //   method: "PUT",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify({ active }),
          // });
          // if (!res.ok) throw new Error("Save failed");

          await new Promise((resolve) => setTimeout(resolve, 350));

          set({ status: "saved", lastSaved: new Date() });
        } catch (err) {
          console.error("City status save failed:", err);
          set({ status: "error" });
        }
      },
    }),
    {
      name: "fixitnow_config",
      partialize: (state) => ({ configs: state.configs }),
    }
  )
);