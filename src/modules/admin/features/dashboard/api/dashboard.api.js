import API from "../../../../../api/client.js";

export const getStatusBarDataApi = async () => {
  const response = await API.get("/orders/admin/statuses");
  return response.data;
};

export const getLowAlertDataApi = async () => {
  const response = await API.get("/orders/admin/low-stock-alert");
  return response.data;
};