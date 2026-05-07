// Mock Data - API calls temporarily disabled
import { mockFilters, mockAllFilters } from './filterMockData';

/**
 * Fetch filters for a specific product category from mock data
 * @param {string} category - Category name (e.g., 'processors', 'monitors', 'laptops')
 * @returns {Promise<Object>} Filter data for the category
 */
export const fetchCategoryFilters = async (category) => {
  try {
    // Return mock data (commented out API call)
    // const response = await fetch(`${BACKEND_URL}/filters/${category}`);
    
    const categoryKey = category.toLowerCase();
    const filters = mockFilters[categoryKey] || { filters: [] };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return filters;
  } catch (error) {
    console.error(`Error fetching filters for ${category}:`, error);
    return { filters: [] };
  }
};

/**
 * Fetch all available filters from mock data
 * @returns {Promise<Object>} All filters organized by category
 */
export const fetchAllFilters = async () => {
  try {
    // Return mock data (commented out API call)
    // const response = await fetch(`${BACKEND_URL}/filters`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockAllFilters;
  } catch (error) {
    console.error("Error fetching all filters:", error);
    return {};
  }
};
