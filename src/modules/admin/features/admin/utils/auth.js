export const getCurrentAdminId = () => {
  try {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      return null;
    }

    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));

    return payload?.adminId ?? null;
  } catch {
    return null;
  }
};