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

    // If unauthorized and we haven't retried this request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Explicitly hit the admin refresh endpoint to get a new access token
        await axios.post('/api/admin/refresh', {}, { withCredentials: true });
        
        // Retry the original request with the fresh cookies
        return adminApi(originalRequest);
      } catch (err) {
        // 🛠️ FIX: Only trigger a hard redirect if the user isn't already trying to log in
        if (!originalRequest.url.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
        
        // Always reject the original error so your frontend login form catch block can read it
        return Promise.reject(error);
      }
    }
    
    // Pass along any other errors (like 404 Access Denied, 500, etc.)
    return Promise.reject(error);
  }
);

export default adminApi;