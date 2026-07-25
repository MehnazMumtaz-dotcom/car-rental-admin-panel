import { create } from "zustand";

import {
  getReportStats,
  getBookingTrend,
  getRevenueByVehicle,
  getComplaintSummary,
} from "../services/reportService";


export const useReportStore = create((set) => ({
  
  stats: null,
  bookingTrend: [],
  revenueByVehicle: [],
  complaintSummary: [],

  loading: false,
  error: null,


fetchReports: async () => {
  try {

    set({
      loading: true,
      error: null,
    });


    const [
      stats,
      bookingTrend,
      revenueByVehicle,
      complaintSummary,
    ] = await Promise.all([

      getReportStats(),

      getBookingTrend("monthly"),

      getRevenueByVehicle(),

      getComplaintSummary(),

    ]);


    set({

      stats,

      bookingTrend,

      revenueByVehicle,

      complaintSummary,

      loading: false,

    });


  } catch (error) {

    console.log("Reports Error:", error);


    set({

      loading: false,

      error: error.message,

    });

  }
},
fetchRevenueByVehicle: async (type) => {

  try {

    const revenueByVehicle = await getRevenueByVehicle(type);

    set({
      revenueByVehicle,
    });


  } catch (error) {

    console.log("Revenue Vehicle Error:", error);

    set({
      error: error.message,
    });

  }

},

fetchBookingTrend: async (type) => {

  try {

    const bookingTrend = await getBookingTrend(type);

    set({
      bookingTrend,
    });


  } catch (error) {

    console.log("Booking Trend Error:", error);

    set({
      error: error.message,
    });

  }

},
  clearReports: () => {

    set({

      stats: null,

      bookingTrend: [],

      revenueByVehicle: [],

      complaintSummary: [],

      error: null,

    });

  },


}));