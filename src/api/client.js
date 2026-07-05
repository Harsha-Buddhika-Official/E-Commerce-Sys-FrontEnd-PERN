import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
    withCredentials: true,
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
        const isLoginRequest = error?.config?.url?.includes("/admin/login");

        if (error.response?.status === 401 && !isLoginRequest) {

            localStorage.removeItem("admin_token");
            localStorage.removeItem("user");
            window.location.href = "/admin";
        }

        return Promise.reject(error);
    }
);

export default API;