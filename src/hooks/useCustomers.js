import { useCustomerStore } from "../store/CustomerStore";
import { useAuthStore } from "../store/authStore";
import {
  getCustomers,
  createCustomer,
  updateCustomerPut,
  updateCustomerPatch,
  deleteCustomer,
} from "../services/customerService";

function getAuthContext() {
  const { token, user } = useAuthStore.getState();
  const companyId = user?.companyId || user?.company_id;

  if (!token || !companyId) {
    throw new Error("Auth not ready — token ya companyId missing hai");
  }

  return { token, companyId };
}

export const useFetchCustomers = () => {
  const setCustomers = useCustomerStore((s) => s.setCustomers);
  const setLoading = useCustomerStore((s) => s.setLoading);
  const setError = useCustomerStore((s) => s.setError);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { token, companyId } = getAuthContext();
      const data = await getCustomers(companyId, token);

      setCustomers(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Fetch customers failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { fetchCustomers };
};

export const useCreateCustomer = () => {
  const addCustomer = useCustomerStore((s) => s.addCustomer);
  const setLoading = useCustomerStore((s) => s.setLoading);
  const setError = useCustomerStore((s) => s.setError);

  const create = async (customerData) => {
    try {
      setLoading(true);
      setError(null);

      const { token } = getAuthContext();
      const newCustomer = await createCustomer(customerData, token);

      addCustomer(newCustomer);
      return newCustomer;
    } catch (err) {
      console.error("Create customer failed:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create };
};

export const useUpdateCustomerPatch = () => {
  const updateCustomer = useCustomerStore((s) => s.updateCustomer);
  const setLoading = useCustomerStore((s) => s.setLoading);
  const setError = useCustomerStore((s) => s.setError);

  const update = async (id, data) => {
    try {
      setLoading(true);
      setError(null);

      const { token, companyId } = getAuthContext();
      const updated = await updateCustomerPatch(companyId, id, data, token);

      updateCustomer(updated);
      return updated;
    } catch (err) {
      console.error("Patch customer failed:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update };
};

export const useUpdateCustomerPut = () => {
  const updateCustomer = useCustomerStore((s) => s.updateCustomer);
  const setLoading = useCustomerStore((s) => s.setLoading);
  const setError = useCustomerStore((s) => s.setError);

  const update = async (id, data) => {
    try {
      setLoading(true);
      setError(null);

      const { token, companyId } = getAuthContext();
      const updated = await updateCustomerPut(companyId, id, data, token);

      updateCustomer(updated);
      return updated;
    } catch (err) {
      console.error("Put customer failed:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update };
};

export const useDeleteCustomer = () => {
  const deleteCustomerFromStore = useCustomerStore((s) => s.deleteCustomer);
  const setLoading = useCustomerStore((s) => s.setLoading);
  const setError = useCustomerStore((s) => s.setError);

  const remove = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const { token, companyId } = getAuthContext();
      await deleteCustomer(companyId, id, token);

      deleteCustomerFromStore(id);
    } catch (err) {
      console.error("Delete customer failed:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { remove };
};