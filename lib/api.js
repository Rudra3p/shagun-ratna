import axios from 'axios';

const api = axios.create({
  // Leave baseURL empty or set to a relative root if everything goes through /api
  baseURL: '/api', 
  withCredentials: true, // Sends your shagun_admin cookies automatically
});

// Auto-Refresh Interceptor (The silent protector)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const isAdmin = window.location.pathname.startsWith('/admin');
        const refreshPath = isAdmin ? '/admin/refresh' : '/user/refresh';
        
        // ✅ FIX: Use a relative path here too! 
        // The browser will auto-prepend localhost in dev and shagunratna.onrender.com in prod
        await axios.post(`/api${refreshPath}`, {}, { withCredentials: true });
        
        return api(originalRequest);
      } catch (err) {
        window.location.href = window.location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;