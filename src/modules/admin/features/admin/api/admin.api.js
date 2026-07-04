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
    console.log("Updating password for adminId:", adminId, "with data:", passwordData);
    const res = await API.put(`/admin/settings/updatePassword/${adminId}`, { passwordData });
    return res.data;
};

// to delete an admin by ID (admin management page) 
export const deleteAdminById = async (id) => {
    const res = await API.delete(`/admin/delete/${id}`);
    return res.data;
};