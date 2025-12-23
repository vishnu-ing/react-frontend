import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});
axiosInstance.interceptors.request.use((request) => {
    
    const token = localStorage.getItem("token");
    if (token) {
        request.headers.Authorization = `Bearer ${token}`; //attach to all request
    }
    // console.log("Token: ", token)
    return request;
});
axiosInstance.interceptors.response.use((response) => {
  return response;
});
export default axiosInstance;