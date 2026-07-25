import api from "../services/api";

export const getComplaints = async (filters = {}) => {
  const response = await api.get("/complaints", {
    params: filters,
  });

  return response.data;
};

/
export const createComplaint = async (data) => {
  const response = await api.post(
    "/complaints",
    data
  );

  return response.data;
};


export const assignComplaint = async (id, adminId) => {
  const response = await api.patch(
    `/complaints/${id}/assign`,
    {
      adminId: Number(adminId),
    }
  );

  return response.data;
};

export const resolveComplaint = async (id) => {
  const response = await api.patch(
    `/complaints/${id}/resolve`
  );

  return response.data;
};


export const deleteComplaint = async (id) => {
  const response = await api.delete(
    `/complaints/${id}`
  );

  return response.data;
};


export const updateComplaintStatus = async (id, status) => {
  if (status === "RESOLVED") {
    return await resolveComplaint(id);
  }

  return {
    id,
    status,
  };
};