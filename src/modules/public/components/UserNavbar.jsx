import { useState } from "react"
import { Link } from "react-router-dom"
import { Search as SearchIcon, ShoppingCart as ShoppingCartIcon, ExpandMore as ExpandMoreIcon, Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material"
import Ozone_Logo from "../../../assets/Ozone_Logo.png"
import SearchOverlay from "./SearchOverlay"
import ProductsOverlay from "./ProductsOverlay"

export default function UserNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProductsOverlayOpen, setIsProductsOverlayOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#0a0a0a] border-b border-zinc-800">
      <div className="max-w-[1920px] mx-auto h-20 px-4 md:px-8 lg:px-80 flex items-center justify-between">
        {/* Logo Space - Add your logo here */}
        <div className="flex-shrink-0">
          <Link to="/" className="block w-16 h-16 rounded-full flex items-center justify-center">
            <img src={Ozone_Logo} alt="Ozone Logo"  />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex items-center gap-8">
          {/* All Products Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProductsOverlayOpen(!isProductsOverlayOpen)}
              className="flex items-center gap-1 text-white text-base font-medium hover:text-zinc-300 transition-colors"
            >
              All Products
              <ExpandMoreIcon className={`w-4 h-4 transition-transform ${isProductsOverlayOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          <Link to="/services" className="text-white text-base font-medium hover:text-zinc-300 transition-colors">
            Services
          </Link>
          <Link to="/offers" className="text-white text-base font-medium hover:text-zinc-300 transition-colors">
            Offers and Deals
          </Link>
          <Link to="/about" className="text-white text-base font-medium hover:text-zinc-300 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-white text-base font-medium hover:text-zinc-300 transition-colors">
            Contact
          </Link>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="text-white hover:text-zinc-300 transition-colors" 
            aria-label="Search"
          >
            <SearchIcon className="w-5 h-5" />
          </button>
          <button className="text-white hover:text-zinc-300 transition-colors" aria-label="Cart">
            <ShoppingCartIcon className="w-5 h-5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden text-white hover:text-zinc-300 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="xl:hidden bg-[#0a0a0a] border-t border-zinc-800 px-4 py-4">
          <div className="flex flex-col gap-4">
            <div>
              <button
                onClick={() => setIsProductsOverlayOpen(!isProductsOverlayOpen)}
                className="flex items-center justify-between w-full text-white text-sm font-medium py-2"
              >
                All Products
                <ExpandMoreIcon className={`w-4 h-4 transition-transform ${isProductsOverlayOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            <Link to="/services" className="text-white text-sm font-medium py-2">
              Services
            </Link>
            <Link to="/offers" className="text-white text-sm font-medium py-2">
              Offers and Deals
            </Link>
            <Link to="/about" className="text-white text-sm font-medium py-2">
              About
            </Link>
            <Link to="/contact" className="text-white text-sm font-medium py-2">
              Contact
            </Link>
          </div>
        </div>
      )}
      </nav>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ProductsOverlay isOpen={isProductsOverlayOpen} onClose={() => setIsProductsOverlayOpen(false)} />
    </>
  )
}