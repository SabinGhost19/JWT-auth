import axios from 'axios';
import { getAccesToken, refreshAccessToken } from './authUtils';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    // Extrage tokenul de acces din localStorage
    const token = getAccesToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adaugă tokenul în header-ul Authorization
    } else {
      console.warn('No access token found in localStorage'); // Log pentru debugging
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
