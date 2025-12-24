import axios from "axios";
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // withCredentials: true,
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
