import { useEffect } from "react";
import { useSubAdminStore } from "../store/useSubAdminStore";

export const useSubAdmin = () => {
  const {
    subAdmins,
    loading,
    status,
    fetchSubAdmins,
    createSubAdmin,
    updateSubAdmin,
    deleteSubAdmin,
    getStats,
  } = useSubAdminStore();

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  return {
    subAdmins,
    loading,
    status,

    fetchSubAdmins,
    createSubAdmin,
    updateSubAdmin,
    deleteSubAdmin,

    stats: getStats(),
  };
};