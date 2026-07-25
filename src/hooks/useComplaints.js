import { useEffect } from "react";
import { useSLAStore } from "../store/SLAStore";


export const useComplaints = () => {

  const {
    complaints,
    loading,
    error,
    fetchComplaints,
    assignComplaint,
    resolveComplaint,
    getComplaintsByCity,
    refresh,
  } = useSLAStore();

  useEffect(() => {

    fetchComplaints();

  }, [fetchComplaints]);


  return {

    complaints,

    loading,

    error,

    fetchComplaints,

    assignComplaint,

    resolveComplaint,

    getComplaintsByCity,

    refresh,

  };

};