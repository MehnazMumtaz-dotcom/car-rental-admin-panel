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

  // ======================
  // AUTO FETCH ON MOUNT
  // ======================
  useEffect(() => {
    fetchSubAdmins();
  }, []);

  return {
    // data
    subAdmins,

    // states
    loading,
    status,

    // actions
    fetchSubAdmins,
    createSubAdmin,
    updateSubAdmin,
    deleteSubAdmin,

    // computed
    stats: getStats(),
  };
};