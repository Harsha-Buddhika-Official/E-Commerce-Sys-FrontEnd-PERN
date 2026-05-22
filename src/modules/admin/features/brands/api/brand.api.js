import API from "../../../../../api/client.js";
import { handleApiError } from "../../../../../utils/apiError.js";

export const getBrands = async () => {
  try {
    const res = await API.get("/brands");
    return res.data;
  } catch (err) {
    handleApiError(err);
    throw err;
  }
};

export const createBrand = async (brandData) => {
  try{
    const res = await API.post("/brands", brandData);
    return res.data;
  }catch(err){
    handleApiError(err);
    throw err;
  }
};