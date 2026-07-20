import api from "./api";
export const getConfig = async (companyId) => {
  return await api.get(`/config/${companyId}`);
};

export const createConfig = async (companyId, payload) => {
  return await api.post(`/config`, {
    companyId,
    ...payload,
  });
};

export const updateConfig = async (companyId, payload) => {
  return await api.put(
    `/config/${companyId}`,
    payload
  );
};