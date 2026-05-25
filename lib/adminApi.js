import axios from 'axios';

const adminApi = axios.create({
  baseURL: '/api/admin', // 🔥 Base prefix locked to /api/admin
  withCredentials: true,
});

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip token refresh loops if these endpoints return a 401
    const isAuthEndpoint = 
      originalRequest.url === '/login' || 
      originalRequest.url === '/verify';

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        // Hits your refresh endpoint if a general dashboard request fails
        await axios.post('/api/admin/refresh', {}, { withCredentials: true });
        return adminApi(originalRequest);
      } catch (err) {
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;