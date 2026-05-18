import { searchProductsByName } from "../api/search.api";

const normalizeSearchItem = (item) => ({
  id: item.product_id ?? item.id,
  name: item.product_name ?? item.name ?? "",
  image: item.primary_image ?? item.image ?? "",
  category: item.category_name ?? item.category ?? "",
});

const extractList = (response) => {
  if (!response || typeof response !== "object") return [];

  if (response.success === false) {
    const message = response.message || "Search failed";
    throw new Error(message);
  }

  const payload = response.data ?? response;
  return Array.isArray(payload) ? payload : [];
};

/**
 * Fetch search results and normalize list items for UI.
 */
export const fetchSearchResults = async (query) => {
  const response = await searchProductsByName(query);
  const list = extractList(response?.data ?? response);
  return list.map(normalizeSearchItem).filter((item) => item.id && item.name);
};
