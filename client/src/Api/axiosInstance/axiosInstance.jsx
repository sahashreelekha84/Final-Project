import axios from "axios";
import { baseurl } from "../api";

const axiosInstance = axios.create({
  baseURL: baseurl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    console.log(token);
    
    if (token) {
      config.headers["x-access-token"] = token; // or use Authorization: `Bearer ${token}`
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
