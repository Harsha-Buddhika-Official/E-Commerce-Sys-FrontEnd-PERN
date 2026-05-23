import { createBrand } from "../api/brand.api.js";

export const createBrandService = async (brandData) => {
    try {
        const res = await createBrand(brandData);
        return res;
    }catch (err) {
        console.error("Error creating brand:", err);
        throw err;
    }
}