import axios from 'axios';

const userApi = axios.create({
  baseURL: '/api', 
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
        // If refresh fails, kick them out to the user login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default userApi;