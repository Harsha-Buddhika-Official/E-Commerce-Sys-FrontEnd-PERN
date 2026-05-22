import { createBrandService } from "../services/createBrand.service.js";
import { useState } from "react";

export const useCreateBrand = () => {
    const [createdBrand, setCreatedBrand] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createBrand = async (brandData) => {
        setLoading(true);
        setError(null);

        try {
            const newBrand = await createBrandService(brandData);
            setCreatedBrand(newBrand);
            return newBrand;
        } catch (err) {
            setError(err?.message || "Failed to create brand.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createdBrand, loading, error, createBrand };
};