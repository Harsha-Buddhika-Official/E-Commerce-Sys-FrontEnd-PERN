import API from "../../../../../api/client";

export const compareProducts = async (productIds) => {
  return await API.post("/ai", { productIds }, { timeout: 30000 });
};