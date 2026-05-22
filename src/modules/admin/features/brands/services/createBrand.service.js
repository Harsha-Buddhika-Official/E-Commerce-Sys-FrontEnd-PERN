import { createBrand } from "../api/brand.api.js";

export const createBrandService = async (brandData) => {
    try {
        const newBrand = await createBrand(brandData);
        return newBrand;
    }catch (err) {
        console.error("Error creating brand:", err);
        throw err;
    }
}