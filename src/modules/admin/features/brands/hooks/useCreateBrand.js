import { useCallback, useState } from "react";
import { createBrandService } from "../services/brand.service.js";
import { handleHookError } from "../../../../../utils/handleHookError.js";

export const useCreateBrand = () => {
    const [createdBrand, setCreatedBrand] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createBrand = useCallback(async (brandData) => {
        setLoading(true);
        setError(null);

        try {
            const brand = await createBrandService(brandData);
            setCreatedBrand(brand);
            return brand;
        } catch (err) {
            const hookError = handleHookError(err, "Failed to create brand");
            setError(hookError);
            throw hookError;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setCreatedBrand(null);
        setError(null);
    }, []);

    return {
        createBrand,
        createdBrand,
        loading,
        error,
        reset,
    };
};