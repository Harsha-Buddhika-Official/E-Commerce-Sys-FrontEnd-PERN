import { useNavigate } from "react-router-dom";
import { Close as CloseIcon } from "@mui/icons-material";
import { useCategories } from "../../features/categories/hooks/useCategories";
import CategoryTile from "../Product/CategoryTile";

export default function CategoriesOverlay({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { products, accessories, loading, error } = useCategories();

  if (!isOpen) return null;

  const handleSelectCategory = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    onClose();
  };

  if (loading)
    return (
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
      />
    );

  if (error)
    return (
      <div
        className="fixed inset-0 z-40 flex items-center justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
      >
        <div className="bg-white p-6 rounded-lg">
          <p className="text-red-600">Error loading categories: {error}</p>
        </div>
      </div>
    );

  return (
    <>
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Dark Overlay */}
      <div
        style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
        className="fixed inset-0 z-40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Products & Accessories Container */}
      <div className="fixed top-24 left-0 right-0 z-50 flex justify-center max-h-[calc(100vh-96px)] overflow-y-auto hide-scrollbar px-3 sm:px-4">
        <div className="relative w-full max-w-7xl px-2 sm:px-4 py-6 sm:py-8">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-0 sm:right-0 text-white hover:text-zinc-300 transition-colors"
            aria-label="Close products"
          >
            <CloseIcon className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>

          {/* Products Section */}
          <div className="mb-10 sm:mb-12">
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
              Products
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6">
              {products.map((product) => (
                <CategoryTile
                  key={product.id}
                  name={product.name}
                  image={product.img_url}
                  onSelect={() => handleSelectCategory(product.name)}
                />
              ))}
            </div>
          </div>

          {/* Accessories Section */}
          <div>
            <h2 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
              Accessories
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6">
              {accessories.map((accessory) => (
                <CategoryTile
                  key={accessory.id}
                  name={accessory.name}
                  image={accessory.img_url}
                  onSelect={() => handleSelectCategory(accessory.name)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
