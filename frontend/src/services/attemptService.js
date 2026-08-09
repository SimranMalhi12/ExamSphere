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
