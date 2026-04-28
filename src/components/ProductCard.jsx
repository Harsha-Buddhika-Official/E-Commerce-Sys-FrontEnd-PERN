import { IconButton, Chip } from '@mui/material';
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
    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white rounded-xl px-3 py-1 shadow-sm">
      <span
        className={`w-2 h-2 rounded-full ${
          inStock ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span
        className={`text-xs font-medium ${
          inStock ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {inStock ? 'In Stock' : 'Out of Stock'}
      </span>
    </div>
  );
};

// Sub-component: Product Specs
const ProductSpecs = ({ specs }) => {
  return (
    <div className="mb-1">
      {specs.map((spec, index) => (
        <p key={index} className="text-xs text-gray-500 leading-relaxed">
          {spec}
        </p>
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
    <div className="w-[280px] h-[428px] bg-white rounded-2xl shadow-md overflow-hidden flex flex-col relative">
      {/* Badge */}
      {badge && <ProductBadge label={badge} />}

      {/* Image Container */}
      <div className="relative mx-4 mt-4 h-[200px] bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
        <ProductImage src={image} alt={title} />
        <StockBadge inStock={inStock} />
      </div>

      {/* Content */}
      <div className="px-4 pt-3 pb-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-bold text-base text-gray-900 mb-2 leading-tight">
          {title}
        </h3>

        {/* Specs */}
        <ProductSpecs specs={specs} />

        {/* Price and Actions */}
        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="font-bold text-base text-gray-900">{price}</span>

          <div className="flex items-center gap-2">
            {category && (
              <Chip
                label={category}
                size="small"
                variant="outlined"
                className="!rounded-2xl !border-gray-300 !text-gray-500 !text-xs !h-7"
              />
            )}
            <IconButton
              onClick={onAddToCart}
              className="!text-gray-500 hover:!text-gray-900 hover:!bg-gray-100"
              size="small"
            >
              <ShoppingCartOutlinedIcon className="!text-[22px]" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
