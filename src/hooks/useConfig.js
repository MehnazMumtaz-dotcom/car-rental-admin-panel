import { useEffect } from "react";
import { useConfigStore } from "../store/configStore";

export const useConfig = (companyId) => {
  const {
    config,
    loading,
    error,
    fetchConfig,
    addConfig,
    editConfig,
  } = useConfigStore();

  // 🔹 Auto fetch on mount
  useEffect(() => {
    if (companyId) {
      fetchConfig(companyId);
    }
  }, [companyId, fetchConfig]); // ✅ include dependency

  // 🔹 Save (Create or Update)
  const saveConfig = async (formData) => {
    try {
      if (config && config.id) {
        return await editConfig(config.id, formData);
      } else {
        return await addConfig({ ...formData, companyId });
      }
    } catch (err) {
      // 🔥 propagate backend error to UI
      throw err;
    }
  };

  return {
    config,
    loading,
    error,
    saveConfig,
    refetch: () => {
      if (companyId) {
        return fetchConfig(companyId);
      }
    },
  };
};