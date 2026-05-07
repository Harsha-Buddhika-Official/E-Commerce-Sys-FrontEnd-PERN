import API from "../../../../../api/client";

// /**
//  * Fetch product categories from backend
//  * @returns {Promise<Array>} Array of product categories
//  * @throws {Error} If the request fails
//  */
//
// export const fetchProductCategories = async () => {
//   try {
//     const response = await API.get("/categories/products");
//     return response.data.data || response.data || [];
//   } catch (error) { 
//     throw new Error(`Failed to fetch product categories: ${error.message}`, { cause: error });
//   }
// };

// /**
//  * Fetch accessory categories from backend
//  * @returns {Promise<Array>} Array of accessory categories
//  * @throws {Error} If the request fails
//  */
// export const fetchAccessoryCategories = async () => {
//   try {
//     const response = await API.get("/categories/accessories");
//     return response.data.data || response.data || [];
//   } catch (error) {
//     throw new Error(`Failed to fetch accessory categories: ${error.message}`, { cause: error });
//   }
// };

/**
 * Fetch both product and accessory categories in parallel
 * Optimized for performance using Promise.all
 * @returns {Promise<{products: Array, accessories: Array}>} Both category arrays
 * @throws {Error} If either request fails
 */
export const fetchAllCategories = async () => {
  try {
    const [productRes, accessoryRes] = await Promise.all([
      API.get("/categories/products"),
      API.get("/categories/accessories"),
    ]);

    return {
      products: productRes.data.data || productRes.data || [],
      accessories: accessoryRes.data.data || accessoryRes.data || [],
    };
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`, { cause: error });
  }
};
