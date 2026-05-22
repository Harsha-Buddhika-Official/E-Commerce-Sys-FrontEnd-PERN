import { getBrands } from "../api/brand.api.js";

export const fetchBrands = async () => {
    try {
        const brands = await getBrands();
        return brands;
    } catch (err) {
        console.error("Error fetching brands:", err);
        throw err;
    }
};