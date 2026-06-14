import API from "../../../../../api/client.js";

// create a new brand for create product form and brands page
export const createBrand = async (brandData) => {
    const res = await API.post("/brands/admin", brandData, {
      timeout: 30000,
    });
    return res.data;
};

// get all brands for listing in brands page
export const getBrands = async () => {
    const res = await API.get("/brands/admin");
    return res.data;
};

//get brand name and id for create product form dropdown
export const getBrandNames = async () => {
    const res = await API.get("/brands/admin/names");
    return res.data;
};

// delete a brand by id for brand details page
export const deleteBrand = async (brandId) => {
    const res = await API.delete(`/brands/admin/${brandId}`, {
      timeout: 30000,
    });
    return res.data;

}
