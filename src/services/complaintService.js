export const getComplaints = async () => {
  // future FastAPI call
  return [
    {
      id: "#C-1021",
      customer: "Ali Raza",
      category: "Vehicle Issue",
      status: "Open",
      date: "2026-05-20",
    },
  ];
};

export const updateComplaintStatus = async (id, status) => {
  return { success: true, id, status };
};