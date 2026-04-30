import { Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material"

export default function SearchOverlay({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <>
      {/* Dark Overlay */}
      <div
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Bar Container */}
      <div className="fixed top-[95px] left-0 right-0 z-50 flex justify-center">
        <div style={{ width: '910px' }} className="relative">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search for Products"
            className="w-full h-14 px-5 pr-12 rounded-lg bg-white text-black text-base focus:outline-none focus:ring-2 focus:ring-blue-500 border-2"
            style={{ borderColor: '#fe1801' }}
            autoFocus
          />

          {/* Search Icon Inside Input */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            aria-label="Search"
          >
            <SearchIcon className="w-5 h-5" />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -right-12 top-1/2 -translate-y-1/2 text-white hover:text-zinc-300 transition-colors hidden md:block"
            aria-label="Close search"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  )
}
