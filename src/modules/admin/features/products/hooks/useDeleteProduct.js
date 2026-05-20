import { useState } from "react";
import { deleteProductService } from "../service/productDelete.service";

/**
 * Hook to perform product deletion.
 * Returns: { deleting, error, deleteProduct }
 */
export const useDeleteProduct = () => {
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState(null);

	const deleteProduct = async (productId) => {
		if (!productId) {
			const err = new Error("Product ID is required");
			setError(err);
			throw err;
		}

		setDeleting(true);
		setError(null);
		try {
			const res = await deleteProductService(productId);
			setDeleting(false);
			return res;
		} catch (err) {
			setError(err);
			setDeleting(false);
			throw err;
		}
	};

	return { deleting, error, deleteProduct };
};

