import axios from 'axios';

const adminApi = axios.create({
  baseURL: '/api', 
  withCredentials: true, // Sends your admin session cookies automatically
});

// Admin-Specific Auto-Refresh Interceptor
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Identify if the error occurred on an authentication endpoint
    // We must ignore /auth/login and /auth/verify-otp so bad credentials don't trigger refresh loops
    const isAuthEndpoint = 
      originalRequest.url.includes('/auth/login') || 
      originalRequest.url.includes('/auth/verify-otp') ||
      originalRequest.url.includes('/admin/verify'); // Backwards compatibility match

    // 2. If unauthorized and we haven't retried this specific request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If it's a primary auth failure, do NOT try to refresh tokens, just reject it to the UI form
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      
      try {
        // Explicitly hit the admin refresh endpoint to get a new access token cookie
        await axios.post('/api/admin/refresh', {}, { withCredentials: true });
        
        // Retry the original request with the fresh cookies
        return adminApi(originalRequest);
      } catch (err) {
        // 🛠️ FIX: Only trigger a hard redirect if the user isn't already on the login screens
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
        
        return Promise.reject(error);
      }
    }
    
    // Pass along any other errors (like 429 Too Many Requests, 423 Locked, 500, etc.)
    return Promise.reject(error);
  }
);

export default adminApi;