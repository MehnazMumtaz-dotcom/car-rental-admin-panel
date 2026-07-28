import api from "./api";

export const getDashboardStats = async () => {
  const res = await api.get(`/dashboard/stats`);
  return res.data;
};


export const getBookingTrend = async (type = "week") => {
  const res = await api.get(
    `/dashboard/booking-trend?type=${type}`
  );

  return res.data;
};


export const getRevenueTrend = async (type = "week") => {
  const res = await api.get(
    `/dashboard/revenue-trend?type=${type}`
  );

  return res.data;
};


export const getComplaintSummary = async () => {
  const res = await api.get(
    `/dashboard/complaint-summary`
  );

  return res.data;
};


export const getRecentComplaints = async () => {
  const res = await api.get(
    `/dashboard/recent-complaints`
  );

  return res.data;
};


export const getSlaAlerts = async () => {
  const res = await api.get(
    `/dashboard/sla-alerts`
  );

  return res.data;
};