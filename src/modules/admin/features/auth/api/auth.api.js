import API from "../../../../../api/client";

export const loginAdmin = async (credentials) => {
    const { data } = await API.post("/admin/login", credentials);
    return data;
}