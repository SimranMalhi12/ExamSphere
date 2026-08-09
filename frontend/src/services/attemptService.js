import api from "./api";

export const startExamAttempt = async (attemptData) => {
  const response = await api.post("/attempts/start", attemptData);
  return response.data;
};

export const submitAnswer = async (answerData) => {
  const response = await api.post("/answers", answerData);
  return response.data;
};

export const submitExamAttempt = async (attemptId) => {
  const response = await api.post(`/attempts/submit/${attemptId}`);
  return response.data;
};

export const getMyAttempts = async () => {
  const response = await api.get("/attempts/my-attempts");
  return response.data;
};

export const getAdminExamAttempts = async () => {
  const response = await api.get("/attempts/admin/my-exam-attempts");
  return response.data;
};

export const getAttemptsByExam = async (examId) => {
  const response = await api.get(`/attempts/exam/${examId}`);
  return response.data;
};

export const getAttemptById = async (id) => {
  const response = await api.get(`/attempts/${id}`);
  return response.data;
};
