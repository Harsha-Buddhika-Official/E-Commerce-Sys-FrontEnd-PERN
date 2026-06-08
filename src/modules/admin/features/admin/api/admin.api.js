import API from "../../../../../api/client";
import { handleApiError } from "../../../../../utils/apiError";

// to create a new admin in admin management page //successful
export const createAdmin = async (payload) => {
    try {
        const res = await API.post("/admin/register", payload);
        return res.data;
    } catch (error) {
        throw handleApiError(error, "Failed to create admin");
    }
};

// to get all admins in admin management page //successful
export const getAllAdmins = async () => {
    try {
        const res = await API.get("/admin");
        return res.data;
    } catch (error) {
        throw handleApiError(error, "Failed to fetch admins");
    }
};

// to update admin role in admin management page //successful
export const updateAdminRole = async (adminId, newRole) => {
    // console.log("API call to update admin role with data:", { adminId, newRole });
    try {
        const res = await API.put(`/admin/updateRole/${adminId}`, {newRole });
        return res.data;
    } catch (error) {
        throw handleApiError(error, "Failed to update admin role");
    }
};

// to update admin password in admin settings page //successful
export const updatePassword = async (adminId, passwordData) => {
    // console.log("API call to update password with data:", { adminId, passwordData });
    try{
        const res = await API.put(`/admin/settings/updatePassword/${adminId}`, {passwordData});
        return res.data;
    } catch (error) {
        throw handleApiError(error, "Failed to update password");
    }
};

// to delete an admin by email in admin management page //successful
export const deleteAdminByEmail = async (email) => {
    try {
        const res = await API.delete("/admin/delete", { data: { email } });
        return res.data;
    } catch (error) {
        throw handleApiError(error, "Failed to delete admin");
    }
};