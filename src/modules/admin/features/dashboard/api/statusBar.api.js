import API from "../../../../../api/client";

export const getStatusBarData = async () => API.get("orders/admin/statuses");