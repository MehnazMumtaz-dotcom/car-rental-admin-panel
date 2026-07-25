import api from "./api";
export const getReportStats = async () => {
  const response = await api.get("/reports/stats");

  return response.data;
};

export const getBookingTrend = async (type) => {
  const response = await api.get(
    `/reports/booking-trend?type=${type}`
  );

  return response.data;
};


export const getRevenueByVehicle = async (type) => {
  const response = await api.get(
    `/reports/revenue-by-vehicle?type=${type}`
  );

  return response.data;
};

export const getComplaintSummary = async () => {
  const response = await api.get(
    "/reports/complaint-summary"
  );

  return response.data;
};