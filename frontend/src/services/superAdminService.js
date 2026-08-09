import api from "./api";

export const getPlatformStats = async () => {
  const response = await api.get("/super-admin/stats");
  return response.data?.data;
};

export const getAllAdmins = async () => {
  const response = await api.get("/super-admin/admins");
  return response.data?.data || [];
};

export const createAdmin = async (adminData) => {
  const response = await api.post("/super-admin/admins", adminData);
  return response.data?.data;
};

export const updateAdmin = async (id, updateData) => {
  const response = await api.put(`/super-admin/admins/${id}`, updateData);
  return response.data?.data;
};

export const deleteAdmin = async (id) => {
  const response = await api.delete(`/super-admin/admins/${id}`);
  return response.data;
};

export const getAllStudents = async () => {
  const response = await api.get("/super-admin/students");
  return response.data?.data || [];
};

export const getAllAttempts = async () => {
  const response = await api.get("/super-admin/attempts");
  return response.data?.data || [];
};
