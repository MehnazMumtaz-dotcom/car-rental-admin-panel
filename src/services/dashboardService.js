import axios from "axios";

const API_URL = "http://localhost:3000/dashboard";


export const getDashboardStats = async () => {
  const res = await axios.get(`${API_URL}/stats`);
  return res.data;
};


export const getBookingTrend = async (type = "week") => {
  const res = await axios.get(
    `${API_URL}/booking-trend?type=${type}`
  );

  return res.data;
};


export const getRevenueTrend = async (type = "week") => {
  const res = await axios.get(
    `${API_URL}/revenue-trend?type=${type}`
  );

  return res.data;
};


export const getComplaintSummary = async () => {
  const res = await axios.get(
    `${API_URL}/complaint-summary`
  );

  return res.data;
};


export const getRecentComplaints = async () => {
  const res = await axios.get(
    `${API_URL}/recent-complaints`
  );

  return res.data;
};


export const getSlaAlerts = async () => {
  const res = await axios.get(
    `${API_URL}/sla-alerts`
  );

  return res.data;
};