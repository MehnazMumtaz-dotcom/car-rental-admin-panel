import { create } from "zustand";

import {
  getReportStats,
  getBookingTrend,
  getRevenueByCity,
  getComplaintSummary,
} from "../services/reportService";


export const useReportStore = create((set) => ({
  
  stats: null,
  bookingTrend: [],
  revenueByCity: [],
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
      revenueByCity,
      complaintSummary,
    ] = await Promise.all([

      getReportStats(),

      getBookingTrend("monthly"),

      getRevenueByCity(),

      getComplaintSummary(),

    ]);


    set({

      stats,

      bookingTrend,

      revenueByCity,

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
fetchRevenueByCity: async (type) => {

  try {

    const revenueByCity = await getRevenueByCity(type);

    set({
      revenueByCity,
    });


  } catch (error) {

    console.log("Revenue City Error:", error);

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

      revenueByCity: [],

      complaintSummary: [],

      error: null,

    });

  },


}));