import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ProductBadge from './ProductBadge';

// Sub-component: Product Image
const ProductImage = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      className="max-w-[90%] max-h-[90%] object-contain transition-transform duration-300 hover:scale-105"
    />
  );
};

// Sub-component: Stock Badge
const StockBadge = ({ inStock }) => {
  return (
    <div 
      className="absolute bottom-[9px] right-[10px] flex items-center gap-[5px] bg-white border border-[#CCCCCC] rounded-[10px] px-[12px] py-[2px]"
      style={{ height: '20px' }}
    >
      <span
        className={`w-[7px] h-[7px] rounded-full flex-none ${
          inStock ? 'bg-[#008000]' : 'bg-red-500'
        }`}
      />
      <span
        className={`text-[11px] font-semibold leading-4 flex-none ${
          inStock ? 'text-[#008000]' : 'text-red-500'
        }`}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {inStock ? 'In Stock' : 'Out of Stock'}
      </span>
    </div>
  );
};

// Sub-component: Product Specs
const ProductSpecs = ({ specs }) => {
  return (
    <div 
      className="text-[11px] font-semibold leading-4 text-[#252525]"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {specs.map((spec, index) => (
        <span key={index}>
          {spec}
          {index < specs.length - 1 && <br />}
        </span>
      ))}
    </div>
  );
};

// Main Component: Product Card
const ProductCard = ({
  image,
  title,
  specs,
  price,
  inStock = true,
  badge = null,
  category = null,
  onAddToCart,
}) => {
  return (
    <div 
      className="relative bg-white border border-[#E6E6E6] rounded-[10px] overflow-visible"
      style={{ width: '280px', height: '428px', boxSizing: 'border-box' }}
    >
      {/* Badge */}
      {badge && <ProductBadge label={badge} />}

      {/* Image Container */}
      <div 
        className="absolute left-5 top-5 border border-[#CCCCCC] rounded-[10px] flex items-center justify-center overflow-hidden"
        style={{ width: '241px', height: '241px' }}
      >
        <ProductImage src={image} alt={title} />
        <StockBadge inStock={inStock} />
      </div>

      {/* Title */}
      <h3 
        className="absolute left-5 top-[276px] font-bold text-[14px] leading-4 uppercase text-[#252525]"
        style={{ width: '240px', fontFamily: 'Inter, sans-serif' }}
      >
        {title}
      </h3>

      {/* Specs */}
      <div 
        className="absolute left-5 top-[302px]"
        style={{ width: '240px' }}
      >
        <ProductSpecs specs={specs} />
      </div>

      {/* Price and Actions */}
      <div 
        className="absolute left-5 right-5 top-[392px] flex flex-row items-center justify-between"
        style={{ height: '20px' }}
      >
        {/* Price */}
        <span 
          className="font-medium text-[13px] leading-4 text-black"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {price}
        </span>

        {/* Category Tag and Cart Icon Container */}
        <div className="flex flex-row items-center gap-3">
          {/* Category Tag */}
          {category && (
            <div 
              className="flex flex-row justify-center items-center px-4 py-1 rounded-full"
              style={{ 
                border: '0.5px solid #252525',
                height: '22px', 
                boxSizing: 'border-box' 
              }}
            >
              <span 
                className="font-normal text-[11px] text-[#252525]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {category}
              </span>
            </div>
          )}

          {/* Cart Icon */}
          <button
            onClick={onAddToCart}
            className="p-0 bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity flex items-center justify-center"
          >
            <ShoppingCartOutlinedIcon 
              style={{ width: '22px', height: '22px', color: '#252525' }} 
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
