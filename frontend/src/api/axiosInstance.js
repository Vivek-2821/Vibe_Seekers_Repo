import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vibe_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('vibe_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/api/auth/refresh-token`, { refreshToken });
          const newAccessToken = res.data.data.accessToken;
          const newRefreshToken = res.data.data.refreshToken;

          localStorage.setItem('vibe_access_token', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('vibe_refresh_token', newRefreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshErr) {
          // Token refresh failed -> Log out user
          localStorage.removeItem('vibe_access_token');
          localStorage.removeItem('vibe_refresh_token');
          localStorage.removeItem('vibe_user');
          if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
export { API_BASE_URL };
