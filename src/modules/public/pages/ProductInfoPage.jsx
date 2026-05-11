import { useMemo, useState, useEffect } from "react";
import {
  ShoppingCart,
  Share,
  LocalShipping,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { useProductDetail } from "../features/products/hooks/useProductDetail";
import { formatAttributeName } from "../../../utils/formatAttributeName";

const FALLBACK_IMAGE = "https://placehold.co/480x380/efefef/333333?text=No+Image";

const formatCurrency = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "Rs. 0.00";
  return `Rs. ${numeric.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function ProductInfoPage() {
  const { product, loading, error } = useProductDetail();
  const [activeImg, setActiveImg] = useState(0);
  const [wished, setWished] = useState(false);
  const [shareTooltip, setShareTooltip] = useState("Share");

  const productImages = useMemo(() => {
    if (!product?.images?.length) return [FALLBACK_IMAGE];
    return [...product.images]
      .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
      .map((img) => img.image_url || FALLBACK_IMAGE);
  }, [product]);

  const specs = useMemo(() => {
    if (!product?.attributes?.length) return [];
    return product.attributes.map((attr) => ({
      label: formatAttributeName(attr.attribute_name),
      value: attr.value,
    }));
  }, [product]);

  const currentPrice = Number(product?.discounted_price ?? 0);
  const originalPrice = Number(product?.selling_price ?? 0);
  const hasDiscount = originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const tags = [product?.category_name, product?.brand_name, formatAttributeName(product?.product_tag)]
    .filter(Boolean);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setActiveImg(0);
  }, [product?.product_id]);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product?.slug || product?.product_id || ""}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl);
      setShareTooltip("Copied!");
      setTimeout(() => setShareTooltip("Share"), 2000);
    }
  };

  const prevImg = () => setActiveImg((p) => (p === 0 ? productImages.length - 1 : p - 1));
  const nextImg = () => setActiveImg((p) => (p === productImages.length - 1 ? 0 : p + 1));

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center p-4 bg-zinc-100">
        <p className="text-sm text-zinc-600">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen grid place-items-center p-4 bg-zinc-100">
        <p className="text-sm text-red-700">
          {error || "Product not found."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-zinc-100 py-6 px-4 md:px-8"
      style={{ fontFamily: "'Sora', 'Segoe UI', sans-serif" }}
    >
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] md:flex">
        <div className="relative flex w-full flex-col items-center justify-center gap-4 border-zinc-200 bg-zinc-50 p-6 md:w-1/2 md:border-r">
          <div className="relative w-full max-w-[350px]">
            <img
              src={productImages[activeImg]}
              alt={product?.name || "Product"}
              className="block w-full rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300"
            />
            <button
              type="button"
              aria-label="Previous image"
              onClick={prevImg}
              className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-1.5 shadow hover:bg-white"
            >
              <ChevronLeft className="text-zinc-700" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={nextImg}
              className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-1.5 shadow hover:bg-white"
            >
              <ChevronRight className="text-zinc-700" />
            </button>
          </div>

          <div className="flex gap-2">
            {productImages.map((img, i) => (
              <img
                key={`${img}-${i}`}
                src={img}
                alt={`thumb-${i + 1}`}
                onClick={() => setActiveImg(i)}
                className={`h-14 w-14 cursor-pointer rounded object-cover transition-all duration-200 ${
                  activeImg === i ? "border-2 border-zinc-800 opacity-100" : "border-2 border-zinc-300 opacity-60 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-800 px-2.5 py-1 text-[10px] font-semibold text-white"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="m-0 text-[1.3rem] font-bold leading-tight text-zinc-800 md:text-[1.6rem]">
            {product?.name}
          </h1>

          <div className="flex flex-wrap items-center gap-1 text-xs text-zinc-600">
            <span>Brand: {product?.brand_name || "N/A"}</span>
            <span>•</span>
            <span>Category: {product?.category_name || "N/A"}</span>
            <span>•</span>
            <span className={product?.stock_quantity > 0 ? "text-green-700" : "text-red-700"}>
              {product?.stock_quantity > 0 ? `In stock (${product.stock_quantity})` : "Out of stock"}
            </span>
          </div>

          {product?.description && (
            <p className="text-[13px] leading-7 text-zinc-600">{product.description}</p>
          )}

          <div className="h-px w-full bg-zinc-200" />

          <div className="flex flex-wrap items-center gap-3">
            {hasDiscount && (
              <span className="text-sm text-zinc-400 line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
            <span className="text-2xl font-bold text-zinc-800">{formatCurrency(currentPrice)}</span>
            {hasDiscount && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                -{discountPercent}%
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                window.location.href = "/checkout";
              }}
              className="flex min-w-[150px] flex-1 items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              <ShoppingCart fontSize="small" />
              BUY NOW
            </button>

            <button
              type="button"
              title={wished ? "Added to cart!" : "Add to cart"}
              onClick={() => setWished((prev) => !prev)}
              className={`rounded-md border-2 p-2 transition-colors ${
                wished
                  ? "border-red-600 text-red-600"
                  : "border-zinc-300 text-zinc-500 hover:border-red-600 hover:text-red-600"
              }`}
            >
              <ShoppingCart />
            </button>

            <div className="relative">
              <button
                type="button"
                title={shareTooltip}
                onClick={handleShare}
                className="rounded-md border-2 border-zinc-300 p-2 text-zinc-500 transition-colors hover:border-zinc-800 hover:text-zinc-800"
              >
                <Share />
              </button>
              {shareTooltip === "Copied!" && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-[10px] text-white">
                  Copied!
                </span>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3">
            <LocalShipping className="text-green-500" />
            <p className="text-xs font-medium text-green-700">
              Free delivery island-wide · Warranty {product?.warranty_months || 0} months
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-[1200px] overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <div className="bg-zinc-800 px-6 py-3">
          <h2 className="m-0 text-base font-bold uppercase tracking-wide text-white">Specifications</h2>
          <p className="mt-1 text-xs text-zinc-400">{product?.name} Features</p>
        </div>

        <div className="grid grid-cols-1 p-3 sm:grid-cols-2 md:p-4">
          {specs.map((spec, i) => (
            <div
              key={`${spec.label}-${i}`}
              className={`flex items-start gap-3 border-b border-zinc-200 px-2 py-3 transition-colors hover:bg-zinc-100 ${
                i % 2 === 0 ? "bg-zinc-50" : "bg-white"
              }`}
            >
              <span className="min-w-[150px] text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                {spec.label}
              </span>
              <span className="text-[13px] font-medium text-zinc-800">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
