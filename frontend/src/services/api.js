import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Participant API
export const registerParticipant = async (data) => {
  const response = await api.post('/api/participants', data);
  return response.data;
};

// Quiz API
export const getQuestions = async () => {
  const response = await api.get('/api/quiz/questions');
  return response.data;
};

export const submitQuiz = async (data) => {
  const response = await api.post('/api/quiz/submit', data);
  return response.data;
};

// Admin API
export const getParticipantsWithScores = async () => {
  const response = await api.get('/api/admin/participants/scores');
  return response.data;
};

export const uploadQuestions = async (data) => {
  const response = await api.post('/api/admin/questions/upload', data);
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await api.get('/api/admin/leaderboard');
  return response.data;
};

export default api;
