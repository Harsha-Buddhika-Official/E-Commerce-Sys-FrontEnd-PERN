import API from "../../../../../api/client";

export const getAdminLogin = (credentials) => 
    API.post("/admin/login", credentials)