import { useState, useCallback } from "react";
import { deleteProductService } from "../service/products.service.js";

export const useDeleteProduct = () => {
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState(null);

	const deleteProduct = useCallback(async (productId) => {
		if (!productId) {
			const message = "Product ID is required";
			setError(message);
			throw new Error(message);
		}

		setDeleting(true);
		setError(null);

		try {
			return await deleteProductService(productId);
		} catch (err) {
			const message =
				err?.response?.data?.message ||
				err?.message ||
				"Failed to delete product";

			setError(message);
			throw err;
		} finally {
			setDeleting(false);
		}
	}, []);

	return {deleting,error,deleteProduct,};
};