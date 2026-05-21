import API from "../../../../../api/client";
import { handleApiError } from "../../../../../utils/apiError";

export const getAdminLogin = (credentials) => {
    try{
        return API.post("/admin/login", credentials);
    }catch(error){
        throw handleApiError(error, "Failed to login");
    }
}