import { useState } from "react";
import { createBrandService } from "../services/brand.service.js";

export const useCreateBrand = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [createdBrand, setCreatedBrand] = useState(null);
    const createBrand = async (brandData) => {
        try {
            setLoading(true);
            setError(null);
            const brand = await createBrandService(brandData);
            setCreatedBrand(brand);
            return brand;
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Failed to create brand"
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {createBrand,createdBrand,loading,error};
};