import { fetchProductsLimitedData } from "../api/product.api";

// Normalize API product shape into the dropdown-friendly shape
const normalizeProductData = (products = []) => {
  return products.map((product) => ({
    product_id: product.product_id,
    name: product.name,
    category_name: product.category_name || product.category || "Product",
    selling_price: product.discounted_price ?? product.price ?? 0,
    is_active: product.is_active,
  }));
};

export const getProductsLimitedData = async () => {
  try {
    const response = await fetchProductsLimitedData();
    return normalizeProductData(response);
  } catch (err) {
    throw new Error("Failed to fetch limited product data: " + (err?.message || String(err)));
  }
};