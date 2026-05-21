import { getAllAdmins } from "../api/admin.api";
import { handleApiError } from "../../../../../utils/apiError";



export const fetchAllAdmins = async () => {
    try {
        const admins = await getAllAdmins();

        if (!admins || !Array.isArray(admins)) {
            throw new Error("Invalid response structure from API");
        }

        // Normalize backend admin shape to frontend-friendly fields
        const normalize = (a) => ({
            admin_id: typeof a.admin_id === "number" ? a.admin_id : Number(a.admin_id) || null,
            name: a.full_name || a.name || "",
            username: a.username || (a.email ? a.email.split("@")[0] : ""),
            email: a.email || "",
            role: a.role,
            is_active: Boolean(a.is_active),
            last_login: a.last_login || null,
            created_at: a.created_at || null,
            updated_at: a.updated_at || null,
        });

        return admins.map((it) => normalize(it));
    } catch (error) {
        throw handleApiError(error, "Failed to fetch admins");
    }
};