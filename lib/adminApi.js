import axios from 'axios';

const adminApi = axios.create({
  baseURL: '/api/admin', 
  withCredentials: true,
});

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Prevent loop: Don't intercept if we are on the login page
    if (window.location.pathname.includes('/admin/login')) {
      return Promise.reject(error);
    }

    // 2. Refresh logic: Use adminApi instance so baseURL is applied correctly
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Use adminApi to correctly hit /api/admin/refresh
        await adminApi.post('/refresh', {}, { withCredentials: true });
        return adminApi(originalRequest);
      } catch (err) {
        window.location.href = '/admin/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;