// Mock Data - API calls temporarily disabled
import { getProductsByCategory } from './productMockData';

/**
 * Fetch products by category from mock data
 * @param {string} category - Product category name (e.g., "Processors", "Motherboard", "Memory")
 * @returns {Promise<Array>} Array of products in the specified category
 */
export const fetchProductsByCategory = async (category = "Processors") => {
  try {
    // Return mock data (commented out API call)
    // const response = await fetch(`${BACKEND_URL}/products/category/${encodeURIComponent(category)}`);
    
    const products = getProductsByCategory(category);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return products || [];
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
};
