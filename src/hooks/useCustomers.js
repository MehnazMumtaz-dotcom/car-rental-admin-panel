import { useCustomerStore } from "../store/CustomerStore";
import {
  getCustomers,
  createCustomer,
  updateCustomerPut,
  updateCustomerPatch,
  deleteCustomer,
} from "../services/customerService";

// 🔥 GET
export const useFetchCustomers = () => {
  const setCustomers = useCustomerStore((s) => s.setCustomers);

  const fetchCustomers = async (companyId) => {
    try {
      const data = await getCustomers(companyId);
      setCustomers(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return { fetchCustomers };
};

// 🔥 CREATE
export const useCreateCustomer = () => {
  const addCustomer = useCustomerStore((s) => s.addCustomer);

  const create = async (data) => {
    try {
      const newCustomer = await createCustomer(data);
      addCustomer(newCustomer);
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  return { create };
};

// 🔥 PUT (FULL UPDATE)
export const useUpdateCustomerPut = () => {
  const updateCustomer = useCustomerStore((s) => s.updateCustomer);

  const update = async (companyId, id, data) => {
    try {
      const updated = await updateCustomerPut(companyId, id, data);
      updateCustomer(updated);
    } catch (err) {
      console.error("PUT error:", err);
    }
  };

  return { update };
};

// 🔥 PATCH (GENERIC UPDATE 🔥)
export const useUpdateCustomerPatch = () => {
  const updateCustomer = useCustomerStore((s) => s.updateCustomer);

  const update = async (companyId, id, data) => {
    try {
      const updated = await updateCustomerPatch(companyId, id, data);
      updateCustomer(updated);
    } catch (err) {
      console.error("PATCH error:", err);
    }
  };

  return { update };
};

// 🔥 DELETE
export const useDeleteCustomer = () => {
  const deleteCustomerFromStore = useCustomerStore((s) => s.deleteCustomer);

  const remove = async (companyId, id) => {
    try {
      await deleteCustomer(companyId, id);
      deleteCustomerFromStore(companyId, id);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return { remove };
};