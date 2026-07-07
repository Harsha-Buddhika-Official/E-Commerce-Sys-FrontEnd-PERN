import API from "../../../../../api/client";

export const loginAdmin = async (credentials) => {
    const { data } = await API.post("/admin/login", credentials);
    console.log("Login response data:", data);
    return data;
}