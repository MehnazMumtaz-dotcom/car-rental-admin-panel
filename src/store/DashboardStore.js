import { create } from "zustand";

import {
  getDashboardStats,
  getBookingTrend,
  getRevenueTrend,
  getComplaintSummary,
  getRecentComplaints,
  getSlaAlerts
} from "../services/dashboardService";


export const useDashboardStore = create((set)=>({

  stats:{},
  bookingTrend:[],
  revenueTrend:[],
  complaintSummary:[],
  recentComplaints:[],
  slaAlerts:[],

  loading:false,


  fetchDashboard: async()=>{

    try{

      set({loading:true});


      const [
        stats,
        bookingTrend,
        revenueTrend,
        complaintSummary,
        recentComplaints,
        slaAlerts

      ] = await Promise.all([

        getDashboardStats(),

        getBookingTrend(),

        getRevenueTrend(),

        getComplaintSummary(),

        getRecentComplaints(),

        getSlaAlerts()

      ]);


      set({

        stats,

        bookingTrend,

        revenueTrend,

        complaintSummary,

        recentComplaints,

        slaAlerts,

        loading:false

      });


    }
    catch(error){

      console.log(
        "Dashboard Error:",
        error
      );

      set({
        loading:false
      });

    }

  }


}));