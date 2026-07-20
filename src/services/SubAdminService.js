import api from "./api";

const SubAdminService = {
  
  getAll: async () => {
    const res = await api.get("/admin");

    console.log("API RESPONSE:", res);

    let data = res?.data?.data || res?.data || [];

    if (!Array.isArray(data)) data = [];

  
    const filtered = data.filter((user) => {
      const role = user.role?.toLowerCase();

      return (
        role === "subadmin" ||
        role === "sub_admin" ||
        role === "sub-admin"
      );
    });

    console.log("FILTERED SUBADMINS:", filtered);

    return filtered;
  },

create: async (data) => {
  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
     companyId: parseInt(data.companyId, 10),
    role: "SUB_ADMIN",
  };

  console.log("FINAL PAYLOAD:", payload); 

  const res = await api.post("/admin", payload);

  return res?.data?.data || res?.data;
},
update: async (id, data) => {

  const payload = {
    name: data.name,
    email: data.email,
    status: data.status?.toUpperCase(),

    permissions: data.permissions || [],
  };


  console.log("UPDATE ID:", id);
  console.log("UPDATE PAYLOAD:", payload);


  const res = await api.patch(
    `/admin/${id}`,
    payload
  );


  return res?.data?.data || res?.data;
},

  remove: async (id) => {
    const res = await api.delete(`/admin/${id}`);
    return res?.data;
  },
  getAuditLogs: async () => {
    const res = await api.get("/audit-log");

    return res?.data?.data || res?.data || [];
  },
};

export default SubAdminService;