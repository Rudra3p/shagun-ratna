import axios from 'axios';
import { setAuthRedirect } from './authRedirect';

const userApi = axios.create({
  baseURL: '/api/user', 
  withCredentials: true, // Sends your user cookies automatically
});

// User-Specific Auto-Refresh Interceptor
userApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Explicitly hit the regular user refresh endpoint
        await axios.post('/api/user/refresh', {}, { withCredentials: true });
        
        // Retry the original request
        return userApi(originalRequest);
      } catch (err) {
        // 🛠️ FIX: Only redirect if we aren't already trying to log in
        if (!originalRequest.url.includes('/user/login') && !originalRequest.url.includes('/login')) {
          setAuthRedirect(window.location.pathname + window.location.search);
          window.location.href = '/auth';
        }
        
        // Always reject the error so your user login form's catch block can catch it
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default userApi;