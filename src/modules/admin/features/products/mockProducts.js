/**
 * mockProducts
 * Replace this with your actual API call / Redux selector.
 * Shape must match the fields consumed by ProductCard.
 */
export const mockProducts = Array.from({ length: 10 }, (_, i) => ({
  id: `prod-${i + 1}`,
  name: "MSI CYBORG 15 A13VF",
  brand: "MSI",
  category: "LAPTOP",
  stockCount: 10,
  basePrice: 199000,
  sellingPrice: 199000,
  discountPrice: 199000,
  image: "https://storage.googleapis.com/a1aa/image/msi-cyborg-laptop.png", // replace with real URL
}));
