import axios from 'axios';

const api = axios.create({
//   baseURL: 'https://smart-visit-backend.onrender.com', // No trailing slash
  baseURL: 'https://smart-visit-backend.onrender.com/', // No trailing slash
});

// Request Interceptor: Inject Bearer token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 and auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            'https://smart-visit-backend.onrender.com/api/token/refresh/',
            { refresh: refreshToken }
          );

          const newAccess = response.data.access;
          localStorage.setItem('access_token', newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest); // Retry with new token
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }

      // If refresh fails, force logout
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;