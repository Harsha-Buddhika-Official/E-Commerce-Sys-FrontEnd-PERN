import { deleteBrand } from "../api/brand.api";
import { handleApiError } from "../../../../../utils/apiError";

export const deleteBrandService = async (brandId) => {
    try {
        const result = await deleteBrand(brandId);
        return result;
    } catch(error) {
        throw handleApiError(error, "Failed to delete brand");
    }
};