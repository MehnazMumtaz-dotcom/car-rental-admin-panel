const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_API_URL;

const API = `${BASE_URL}/customers`;

function buildHeaders(token, includeJson = false) {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed (status ${res.status})`;

    try {
      const errorBody = await res.json();
      message = errorBody.message || message;
    } catch {
      // response body JSON nahi thi, default message hi use hoga
    }

    throw new Error(message);
  }

  return res.json();
}

export async function getCustomers(companyId, token) {
  const res = await fetch(`${API}/company/${companyId}`, {
    headers: buildHeaders(token),
  });

  return handleResponse(res);
}

export async function createCustomer(data, token) {
  const res = await fetch(API, {
    method: "POST",
    headers: buildHeaders(token, true),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function updateCustomerPatch(companyId, id, data, token) {
  const res = await fetch(`${API}/company/${companyId}/${id}`, {
    method: "PATCH",
    headers: buildHeaders(token, true),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function updateCustomerPut(companyId, id, data, token) {
  const res = await fetch(`${API}/company/${companyId}/${id}`, {
    method: "PUT",
    headers: buildHeaders(token, true),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function deleteCustomer(companyId, id, token) {
  const res = await fetch(`${API}/company/${companyId}/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

  return handleResponse(res);
}