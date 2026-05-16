import axios from 'axios';

const api = axios.create({
  baseURL: '/api', 
  withCredentials: true, 
});

// Auto-Refresh Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const isAdmin = window.location.pathname.startsWith('/admin');
        const refreshPath = isAdmin ? '/admin/refresh' : '/user/refresh';
        
        await axios.post(`/api${refreshPath}`, {}, { withCredentials: true });
        
        return api(originalRequest);
      } catch (err) {
        // ✅ FIX: Change the fallback from '/login' to '/admin/login'
        window.location.href = window.location.pathname.startsWith('/admin') ? '/admin/login' : '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;