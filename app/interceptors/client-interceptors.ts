import axios from "axios";
import { refreshToken } from "~/apis/userAPI";
import qs from "qs";

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
      console.error(e)
    }
    originalRequest._retry = true;
    return axiosApiInstance(originalRequest);
  }
  return Promise.reject(error);
});

export function paramsSerializerComma(params: any) {
  return qs.stringify(params, { arrayFormat: 'comma' })
}