import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.PORT}`, 
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
        
        await axios.post(`http://localhost:5000/api${refreshPath}`, {}, { withCredentials: true });
        
        return api(originalRequest);
      } catch (err) {
        window.location.href = window.location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;