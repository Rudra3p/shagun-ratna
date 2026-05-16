import axios from 'axios';

const adminApi = axios.create({
  baseURL: '/api', 
  withCredentials: true, // Sends your admin cookies automatically
});

// Admin-Specific Auto-Refresh Interceptor
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Explicitly hit the admin refresh endpoint
        await axios.post('/api/admin/refresh', {}, { withCredentials: true });
        
        // Retry the original request with the fresh cookie
        return adminApi(originalRequest);
      } catch (err) {
        // If refresh fails, kick them out directly to admin login
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;