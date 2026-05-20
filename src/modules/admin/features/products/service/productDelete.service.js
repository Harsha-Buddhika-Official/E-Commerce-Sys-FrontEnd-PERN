import { deleteProduct } from "../api/product.api";
import { handleApiError } from "../../../../../utils/apiError";

export const deleteProductService = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }
    try {
    const res = await deleteProduct(productId);
    return res; // Assuming the API returns a success message or status
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to delete product"
    );
  }
};