import api from "./api";

export const getAllExams = async () => {
  const response = await api.get("/exams");
  return response.data;
};

export const getMyExams = async () => {
  const response = await api.get("/exams/my-exams");
  return response.data;
};

export const getExamById = async (id) => {
  const response = await api.get(`/exams/${id}`);
  return response.data;
};

export const getExamByAccessCode = async (accessCode) => {
  const response = await api.get(`/exams/code/${accessCode}`);
  return response.data;
};

export const createExam = async (examData) => {
  const response = await api.post("/exams", examData);
  return response.data;
};

export const updateExam = async (id, examData) => {
  const response = await api.put(`/exams/${id}`, examData);
  return response.data;
};

export const deleteExam = async (id) => {
  const response = await api.delete(`/exams/${id}`);
  return response.data;
};