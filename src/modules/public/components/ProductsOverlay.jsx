import { useNavigate } from "react-router-dom"
import { Close as CloseIcon } from "@mui/icons-material"
import { products, accessories } from "../services/categoriesService"

export default function ProductsOverlay({ isOpen, onClose }) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleSelectCategory = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`)
    onClose()
  }

  return (
    <>
      {/* Dark Overlay */}
      <div
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Products & Accessories Container */}
      <div className="fixed top-[95px] left-0 right-0 z-50 flex justify-center max-h-[calc(100vh-95px)] overflow-y-auto">
        <div style={{ width: '910px' }} className="w-full px-4 py-8">
          {/* Products Section */}
          <div className="mb-12">
            <h2 className="text-white text-2xl font-bold mb-6 text-center">Products</h2>
            <div className="grid grid-cols-5 gap-6">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelectCategory(product.name)}
                  className="flex flex-col items-center gap-3 p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors group cursor-pointer"
                >
                  <div className={`w-[150px] h-[150px] bg-gradient-to-br ${product.color} rounded-lg flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform`}>
                    <span className="text-white text-sm font-bold text-center px-2">{product.name}</span>
                  </div>
                  <span className="text-white text-base font-medium text-center">{product.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accessories Section */}
          <div>
            <h2 className="text-white text-2xl font-bold mb-6 text-center">Accessories</h2>
            <div className="grid grid-cols-5 gap-6">
              {accessories.map((accessory) => (
                <button
                  key={accessory.id}
                  onClick={() => handleSelectCategory(accessory.name)}
                  className="flex flex-col items-center gap-3 p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors group cursor-pointer"
                >
                  <div className={`w-[150px] h-[150px] bg-gradient-to-br ${accessory.color} rounded-lg flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform`}>
                    <span className="text-white text-sm font-bold text-center px-2">{accessory.name}</span>
                  </div>
                  <span className="text-white text-base font-medium text-center">{accessory.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="fixed top-[95px] right-6 z-50 text-white hover:text-zinc-300 transition-colors"
            aria-label="Close products"
          >
            <CloseIcon className="w-8 h-8" />
          </button>
        </div>
      </div>
    </>
  )
}
