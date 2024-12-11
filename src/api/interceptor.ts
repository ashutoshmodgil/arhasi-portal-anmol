import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { API_DOMAIN } from '@/config';

// Create a custom axios instance
const axiosInstance = axios.create({
  baseURL: API_DOMAIN,
  headers: {
    // 'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type if payload is FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    } else {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.log(error.response.data);
    } else if (error.request) {
      console.log('No response received from server');
    } else {
      console.log('Something went wrong');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
