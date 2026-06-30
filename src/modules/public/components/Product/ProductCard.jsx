import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ProductBadge from "./ProductBadge";
import { useState } from "react";

const ProductImage = ({ src, alt }) => {
  const [fit, setFit] = useState("contain");

  const handleImageLoad = (e) => {
    const img = e.target;
    const isLandscape = img.naturalWidth > img.naturalHeight;
    setFit(isLandscape ? "cover" : "contain");
  };

  return (
    <img
      src={src}
      alt={alt}
      onLoad={handleImageLoad}
      className="w-full h-full transition-transform duration-300 hover:scale-105"
      style={{ objectFit: fit }}
    />
  );
};

const StockBadge = ({ inStock }) => (
  <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2.5 flex items-center gap-1 bg-white border border-[#CCCCCC] rounded-[8px] sm:rounded-[10px] px-1.5 sm:px-3 py-0.5 h-4 sm:h-5">
    <span
      className={`w-1.5 h-1.5 rounded-full flex-none ${
        inStock ? "bg-[#008000]" : "bg-red-500"
      }`}
    />
    <span
      className={`text-[10px] sm:text-[13px] font-semibold leading-none flex-none ${
        inStock ? "text-[#008000]" : "text-red-500"
      }`}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {inStock ? "In Stock" : "Out of Stock"}
    </span>
  </div>
);

const ProductSpecs = ({ specs }) => (
  <div
    className="text-[11px] sm:text-[13px] font-medium leading-4 text-[#252525] space-y-0.5 sm:space-y-1"
    style={{ fontFamily: "Inter, sans-serif" }}
  >
    {/* Show fewer specs on mobile to keep cards compact */}
    {specs.slice(0, 3).map((spec, i) => (
      <div key={i} className="sm:hidden truncate">
        {spec}
      </div>
    ))}
    {specs.slice(0, 5).map((spec, i) => (
      <div key={i} className="hidden sm:block">
        {spec}
      </div>
    ))}
  </div>
);

const ProductCard = ({
  product,
  image,
  title,
  specs,
  price,
  inStock = true,
  badge = null,
  category = null,
  onAddToCart,
  onCardClick,
}) => (
  <div
    onClick={onCardClick}
    className="relative bg-white border border-[#E6E6E6] rounded-[10px] overflow-hidden flex flex-col w-full cursor-pointer hover:shadow-lg transition-shadow min-h-[320px] sm:min-h-[420px] md:min-h-[450px]"
    style={{ boxSizing: "border-box" }}
  >
    {badge && <ProductBadge label={badge} />}

    {/* Square image area via padding-top trick */}
    <div className="relative w-full" style={{ paddingTop: "85%" }}>
      <div className="absolute inset-1.5 sm:inset-3 border border-[#CCCCCC] rounded-[8px] sm:rounded-[10px] flex items-center justify-center overflow-hidden">
        <ProductImage src={image} alt={title} />
        <StockBadge inStock={inStock} />
      </div>
    </div>

    {/* Content */}
    <div className="flex flex-col flex-1 px-2.5 sm:px-4 pb-2.5 sm:pb-4 pt-1.5 sm:pt-2 gap-0.5 sm:gap-1">
      <h3
        className="font-bold text-[12px] sm:text-[15px] md:text-[16px] leading-[1.3] uppercase text-[#252525] line-clamp-2 pb-0.5"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {title}
      </h3>

      <div className="flex-1">
        <ProductSpecs specs={specs} />
      </div>

      <div className="flex flex-row items-center justify-between mt-1">
        <span
          className="font-semibold text-[12px] sm:text-[15px] md:text-[16px] leading-none text-black"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {price}
        </span>
        <div className="flex flex-row items-center gap-1 sm:gap-2">
          {/* Hide category pill on very small screens to avoid overflow */}
          {category && (
            <div
              className="hidden xs:flex items-center justify-center px-2 sm:px-3 py-1 rounded-full"
              style={{ border: "0.5px solid #252525", height: "20px" }}
            >
              <span
                className="font-normal text-[10px] sm:text-[13px] text-[#252525] whitespace-nowrap"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {category.split(" ")[0]}
              </span>
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product?.product_id ?? product?.id);
            }}
            className="p-1 sm:p-0 bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity flex items-center justify-center"
            style={{ minWidth: "28px", minHeight: "28px" }}
          >
            <ShoppingCartOutlinedIcon
              style={{
                width: "18px",
                height: "18px",
                color: "#252525",
              }}
              className="sm:!w-[22px] sm:!h-[22px]"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ProductCard;