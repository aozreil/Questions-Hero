import axios from "axios";
import { refreshToken } from "~/apis/userAPI";

export const axiosApiInstance = axios.create();

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const originalRequest = error.config;
  if (error.response.status === 401 && !originalRequest._retry && error.response.data.error === 'EXPIRED') {
    try {
      await refreshToken();
    } catch (e) {
      console.log(e)
    }
    originalRequest._retry = true;
    return axiosApiInstance(originalRequest);
  }
  return Promise.reject(error);
});