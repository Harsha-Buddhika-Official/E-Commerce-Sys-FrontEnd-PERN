import API from "../../../../../api/client";

export const getStatusBarData = async () => API.get("orders/admin/statuses");
export const getLowAlertData = async () => API.get("orders/admin/low-stock-alert");