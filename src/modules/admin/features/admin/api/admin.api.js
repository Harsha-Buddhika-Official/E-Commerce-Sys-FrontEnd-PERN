import API from "../../../../../api/client";
import { handleApiError } from "../../../../../utils/apiError";

export const createAdmin = async (payload) => {
    try {
        const res = await API.post("/admin/register", payload);
        return res.data;
    } catch (error) {
        throw handleApiError(error, "Failed to create admin");
    }
};

export const getAllAdmins = async () => {
    try {
        const res = await API.get("/admin");
        return res.data;
    } catch (error) {
        throw handleApiError(error, "Failed to fetch admins");
    }
};

export const updateAdminRole = async (adminId, newRole) => {
    try {
        const res = await API.put("/admin/updateRole", { adminId, newRole });
        return res.data;
    } catch (error) {
        throw handleApiError(error, "Failed to update admin role");
    }
};

export const updatePassword = async (adminId, passwordData) => {
    try{
        const res = await API.put(`/admin/settings/updatePassword/${adminId}`, {
            oldPassword: passwordData.oldPassword || passwordData.currentPassword,
            newPassword: passwordData.newPassword,
            confirmPassword: passwordData.confirmPassword
        });
        return res.data;
    } catch (error) {
        throw handleApiError(error, "Failed to update password");
    }
};

export const deleteAdminByEmail = async (email) => {
    try {
        const res = await API.delete("/admin/delete", { data: { email } });
        return res.data;
    } catch (error) {
        throw handleApiError(error, "Failed to delete admin");
    }
};