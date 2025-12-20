import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || `http://localhost:4000`,
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((request) => {
  return request;
});

axiosInstance.interceptors.response.use((response) => {
  return response;
});

export default axiosInstance;
