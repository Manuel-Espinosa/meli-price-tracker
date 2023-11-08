import axios from 'axios';
import tokenManager from '../config/tokenManager.js';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await tokenManager.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = await tokenManager.refreshAccessToken();
      originalRequest.headers['Authorization'] = `Bearer ${token}`;
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
