import axios from "axios";

const API = axios.create({
    // baseURL: "/api",
    // baseURL: "http://localhost:4000/api",
    baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {

            // Clear auth data on 401
            localStorage.removeItem("admin_token");
            localStorage.removeItem("user");

            // redirect login
            window.location.href = "/admin";
        }
        return Promise.reject(error);
    }
);

export default API;