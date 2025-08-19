import api from "./axios";

export const login = async (username, password) => {
  try {
    const response = await api.post("/api/auth/login/", { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/api/auth/register/", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = async (refreshToken) => {
  try {
    await api.post("/api/auth/logout/", { refresh: refreshToken });
  } catch (error) {
    throw error.response?.data || error.message;
  }
};