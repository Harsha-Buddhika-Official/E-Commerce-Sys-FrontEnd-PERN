export default function CategoryTile({ name, color, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg transition-colors group cursor-pointer"
    >
      <div className={`w-full aspect-square max-w-37.5 bg-linear-to-br ${color} rounded-lg flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform shadow-lg shadow-black/20`}>
        <span className="text-white text-xs sm:text-sm font-bold text-center px-2 leading-tight">{name}</span>
      </div>
      <span className="text-white text-sm sm:text-base font-medium text-center leading-tight">{name}</span>
    </button>
  )
}
