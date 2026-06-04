import API from "../../../../../api/client";
import { handleApiError } from "../../../../../utils/apiError";

export const loginAdmin = async (credentials) => {
    try {
        const { data } = await API.post("/admin/login", credentials);
        return data;
    } catch (error) {
        throw handleApiError(error, "Failed to login");
    }
}