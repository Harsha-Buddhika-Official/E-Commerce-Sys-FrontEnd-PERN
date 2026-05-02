import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ProductBadge from './ProductBadge';

const ProductImage = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="max-w-[90%] max-h-[90%] object-contain transition-transform duration-300 hover:scale-105"
  />
);

const StockBadge = ({ inStock }) => (
  <div className="absolute bottom-2.25 right-2.5 flex items-center gap-1.25 bg-white border border-[#CCCCCC] rounded-[10px] px-3 py-0.5 h-5">
    <span className={`w-1.75 h-1.75 rounded-full flex-none ${inStock ? 'bg-[#008000]' : 'bg-red-500'}`} />
    <span
      className={`text-[11px] font-semibold leading-4 flex-none ${inStock ? 'text-[#008000]' : 'text-red-500'}`}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {inStock ? 'In Stock' : 'Out of Stock'}
    </span>
  </div>
);

const ProductSpecs = ({ specs }) => (
  <div className="text-[11px] font-semibold leading-4 text-[#252525]" style={{ fontFamily: 'Inter, sans-serif' }}>
    {specs.slice(0, 5).map((spec, i, arr) => (
      <span key={i}>{spec}{i < arr.length - 1 && <br />}</span>
    ))}
  </div>
);

const ProductCard = ({
  image,
  title,
  specs,
  price,
  inStock = true,
  badge = null,
  category = null,
  onAddToCart,
}) => (
  <div
    className="relative bg-white border border-[#E6E6E6] rounded-[10px] overflow-hidden flex flex-col w-full"
    style={{ boxSizing: 'border-box', minHeight: '380px' }}
  >
    {badge && <ProductBadge label={badge} />}

    {/* Square image area via padding-top trick */}
    <div className="relative w-full" style={{ paddingTop: '85%' }}>
      <div className="absolute inset-3 border border-[#CCCCCC] rounded-[10px] flex items-center justify-center overflow-hidden">
        <ProductImage src={image} alt={title} />
        <StockBadge inStock={inStock} />
      </div>
    </div>

    {/* Content */}
    <div className="flex flex-col flex-1 px-4 pb-4 pt-2 gap-1">
      <h3
        className="font-bold text-[13px] leading-[1.3] uppercase text-[#252525] line-clamp-2"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {title}
      </h3>

      <div className="flex-1">
        <ProductSpecs specs={specs} />
      </div>

      <div className="flex flex-row items-center justify-between mt-2">
        <span className="font-medium text-[13px] leading-4 text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
          {price}
        </span>
        <div className="flex flex-row items-center gap-2">
          {category && (
            <div
              className="flex items-center justify-center px-3 py-1 rounded-full"
              style={{ border: '0.5px solid #252525', height: '22px' }}
            >
              <span className="font-normal text-[11px] text-[#252525] whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                {category.split(' ')[0]}
              </span>
            </div>
          )}
          <button
            onClick={onAddToCart}
            className="p-0 bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity flex items-center justify-center"
          >
            <ShoppingCartOutlinedIcon style={{ width: '22px', height: '22px', color: '#252525' }} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ProductCard;