// Mock Data - API calls temporarily disabled
import { getProductsBySection } from './productMockData';

/**
 * Fetch products by section from mock data
 * @param {string} section - Section type: "best-sellers" or "latest"
 * @returns {Promise<Array>} Array of products
 */
export const fetchProductsBySection = async (section = "best-sellers") => {
  try {
    // Return mock data (commented out API call)
    // const response = await fetch(`${BACKEND_URL}/products?section=${section}`);
    
    const products = getProductsBySection(section);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return products || [];
  } catch (error) {
    console.error(`Error fetching ${section} products:`, error);
    return [];
  }
};
