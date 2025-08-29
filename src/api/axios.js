import axios from 'axios';

const api = axios.create({
//   baseURL: 'http://127.0.0.1:8000  ', // No trailing slash
  baseURL: 'http://127.0.0.1:8000/', // No trailing slash
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
            'http://127.0.0.1:8000/api/token/refresh/',
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