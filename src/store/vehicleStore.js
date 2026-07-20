import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";

export const useVehicleStore = create(
  persist(
    (set) => ({
      vehicles: [],
      fetchVehicles: async () => {
        try {
          const res = await api.get("/vehicles");

          set({
            vehicles: res.data,
          });

          return res.data;

        } catch (error) {
          console.error(
            "Fetch vehicles error:",
            error.response?.data || error.message
          );

          throw error;
        }
      },

      addVehicle: async (vehicle) => {
        try {
          const res = await api.post(
            "/vehicles",
            vehicle
          );

          set((state) => ({
            vehicles: [
              ...state.vehicles,
              res.data,
            ],
          }));

          return res.data;

        } catch (error) {
          console.error(
            "Create vehicle error:",
            error.response?.data || error.message
          );

          throw error;
        }
      },

      updateVehicle: async (id, vehicle) => {
        try {
          const res = await api.patch(
            `/vehicles/${id}`,
            vehicle
          );

          set((state) => ({
            vehicles: state.vehicles.map((v) =>
              v.id === id
                ? res.data
                : v
            ),
          }));

          return res.data;

        } catch (error) {
          console.error(
            "Update vehicle error:",
            error.response?.data || error.message
          );

          throw error;
        }
      },

      deleteVehicle: async (id) => {
        try {
          await api.delete(
            `/vehicles/${id}`
          );

          set((state) => ({
            vehicles:
              state.vehicles.filter(
                (v) => v.id !== id
              ),
          }));

        } catch (error) {
          console.error(
            "Delete vehicle error:",
            error.response?.data || error.message
          );

          throw error;
        }
      },


    }),

    {
      name: "fixitnow_vehicles",
    }
  )
);