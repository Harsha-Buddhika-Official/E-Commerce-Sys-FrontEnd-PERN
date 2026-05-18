import API from "../../../../../api/client";

/**
 * Search products by name via query param in the URL path.
 */
export const searchProductsByName = (name) => {
  const encoded = encodeURIComponent(name ?? "");
  return API.get(`/products/search/${encoded}`);
};
