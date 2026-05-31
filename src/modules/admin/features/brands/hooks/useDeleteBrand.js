import { deleteBrandService } from "../services/brand.service.js";
import { useState } from "react";

export const useDeleteBrand = () => {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteBrand = async (brandId) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const deleteBrand = await deleteBrandService(brandId);
            setSuccess(true);
            return deleteBrand;
        } catch (err) {
            const message = err.message || "Failed to delete Brand"
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    return { loading, error, success, deleteBrand };
}