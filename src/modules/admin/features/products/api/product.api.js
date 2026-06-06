import API from "../../../../../api/client";
import { handleApiError } from "../../../../../utils/apiError";


export const fetchAllProductsLimited = async () => {
  try {
    const res = await API.get("/products/admin/limited-details");
    return res.data; // Already unwrapped by client interceptor
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to fetch products"
    );
  }
};

export const fetchProductDetail = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  try {
    const res = await API.get(`/products/admin/products/${productId}`);
    return res.data;
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to fetch product details"
    );
  }
};

export const deleteProduct = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }
  try {
    const res = await API.delete(`/products/admin/delete/${productId}`, {timeout: 30000});
    return res.data;
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to delete product"
    );
  }
};

export const fetchProductsLimitedData = async () => {
  try {
    const res = await API.get("/products/admin/simple-details", {timeout: 30000});
    return res.data?.data ?? [];
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to fetch limited product data"
    );
  }
};

export const createProduct = async (payload) => {
  if (!payload) {
    throw new Error("Product payload is required");
  }
  // console.log("Creating product with payload:", payload);
  try {
    const res = await API.post("/products/admin/without-attributes", payload, {timeout: 30000});
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to create product");
  }
};

export const updateProductFull = async (productId, payload) => {
  // console.log("Updating product with ID:", productId);
  // console.log("Payload:", payload);
  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Product payload is required");
  }
  try {
    const res = await API.put(`/products/admin/products/${productId}/full-update`, payload, { timeout: 30000 });
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to update product");
  }
};

export const fetchProductAttributesByCategory = async (categoryId) => {
  if (categoryId === null || typeof categoryId === "undefined" || categoryId === "") {
    throw new Error("Category ID is required");
  }

  try {
    try {
      const res = await API.get(`/attributes/admin/grouped/${categoryId}`);
      return res.data;
    } catch {
      const res = await API.get(`/products/attributes/by-category/${categoryId}`);
      return res.data;
    }
  } catch (error) {
    throw handleApiError(error, "Failed to fetch product attributes");
  }
};

export const addProductAttribute = async (productId, payload) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (!payload) {
    throw new Error("Attribute payload is required");
  }

  try {
    const res = await API.post(`/attributes/admin/products/${productId}/attributes`, payload, { timeout: 30000 });
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to save product attribute");
  }
};
