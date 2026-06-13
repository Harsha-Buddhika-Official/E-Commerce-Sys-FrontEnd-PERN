import API from "../../../../../api/client";

// to create a new admin in admin management page //successful
export const createAdmin = (payload) => {
    return API.post("/admin/register", payload).then((res) => res.data);
};

// to get all admins in admin management page //successful
export const getAllAdmins = () => {
    return API.get("/admin").then((res) => res.data);
};

// to update admin role in admin management page //successful
export const updateAdminRole = (adminId, newRole) => {
    return API.put(`/admin/updateRole/${adminId}`, { newRole }).then((res) => res.data);
};

// to update admin password in admin settings page //successful
export const updatePassword = (adminId, passwordData) => {
    return API.put(`/admin/settings/updatePassword/${adminId}`, { passwordData }).then((res) => res.data);
};

// to delete an admin by email in admin management page //successful
export const deleteAdminByEmail = (email) => {
    return API.delete("/admin/delete", { data: { email } }).then((res) => res.data);
};