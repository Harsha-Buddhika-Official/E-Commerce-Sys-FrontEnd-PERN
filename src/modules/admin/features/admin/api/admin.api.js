import API from "../../../../../api/client";

// Create a new admin (Admin Management page)
export const createAdmin = async (payload) => {
    const res = await API.post("/admin/register", payload);
    return res.data;
};

// to get all admins (admin management page) 
export const getAllAdmins = async () => {
    const res = await API.get("/admin");
    return res.data;
};

// to update admin role (admin management page) 
export const updateAdminRole = async (adminId, newRole) => {
    const res = await API.put(`/admin/updateRole/${adminId}`, { newRole });
    return res.data;
};

// to update admin password (settings page) 
export const updatePassword = async (adminId, passwordData) => {
    const res = await API.put(`/admin/settings/updatePassword/${adminId}`, { passwordData });
    return res.data;
};

// to delete an admin by email (admin management page) 
export const deleteAdminByEmail = async (email) => {
    const res = await API.delete("/admin/delete", { data: { email } });
    return res.data;
};