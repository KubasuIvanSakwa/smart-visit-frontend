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

// Response Interceptor: Handle 401, 404, and other errors with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - Token refresh
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

    // Handle network errors with retry logic
    if (!error.response && !originalRequest._retryNetwork) {
      originalRequest._retryNetwork = true;
      const retryCount = originalRequest._retryCount || 0;

      if (retryCount < 3) { // Max 3 retries
        const delay = Math.pow(2, retryCount) * 2000; // Exponential backoff: 2s, 4s, 8s
        console.log(`Network error, retrying in ${delay}ms... (attempt ${retryCount + 1})`);

        await new Promise(resolve => setTimeout(resolve, delay));
        originalRequest._retryCount = retryCount + 1;
        return api(originalRequest);
      }
    }

    // Handle 500+ server errors with retry
    if (error.response?.status >= 500 && !originalRequest._retryServer) {
      originalRequest._retryServer = true;
      const retryCount = originalRequest._retryCount || 0;

      if (retryCount < 2) { // Max 2 retries for server errors
        const delay = Math.pow(2, retryCount) * 3000; // Exponential backoff: 3s, 6s
        console.log(`Server error (${error.response.status}), retrying in ${delay}ms... (attempt ${retryCount + 1})`);

        await new Promise(resolve => setTimeout(resolve, delay));
        originalRequest._retryCount = retryCount + 1;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;