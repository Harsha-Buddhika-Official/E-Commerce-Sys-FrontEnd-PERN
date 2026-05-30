import API from "../../../../../api/client";

export const getStatusBarDataApi = async () => { 
    const res = await API.get("orders/admin/statuses");
    return res.data;
}

export const getLowAlertDataApi = async () => { 
    const res = await API.get("orders/admin/low-stock-alert");
    return res.data;
}