export default function CategoryTile({ name, image, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg transition-colors group cursor-pointer"
    >
      <div className="w-full aspect-square max-w-37.5 rounded-lg flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform shadow-lg shadow-black/20">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-white text-sm sm:text-base font-medium text-center leading-tight">{name}</span>
    </button>
  )
}
