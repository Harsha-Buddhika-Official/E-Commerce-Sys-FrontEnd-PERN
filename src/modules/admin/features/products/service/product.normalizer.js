export const normalizeProduct = (product) => ({
  id: Number(product.product_id),
  name: product.product_name || "",
  brand: product.brand_name || "",
  category: product.category_name || "",
  stockCount: Number(product.stock_quantity) || 0,
  stockStatus: product.stock_status || "IN_STOCK",
  basePrice: Number(product.base_price) || 0,
  sellingPrice: Number(product.selling_price) || 0,
  discountedPrice: Number(product.discounted_price) || 0,
  image: product.primary_image || "",
});

export const normalizeAttributes = (attributes = []) =>
  attributes.map((attribute, index) => ({
    ...attribute,
    _key: attribute.product_attribute_id ?? attribute.attribute_id ?? index,
    value: attribute.value ?? attribute.attribute_value ?? "",
  }));

export const normalizeImages = (images = []) =>
  images
    .map((image, index) => ({
      ...image,
      _key: image.image_id ?? index,
      alt_text: image.alt_text ?? "",
      sort_order: Number(image.sort_order ?? index),
    }))
    .sort((left, right) => Number(left.sort_order ?? 0) - Number(right.sort_order ?? 0));

export const normalizeProductForForm = (source = {}) => ({
  product_id: source.product_id ?? source.id ?? null,
  name: source.name ?? "",
  description: source.description ?? "",
  brand_id: source.brand_id ?? "",
  brand_name: source.brand_name ?? source.brand ?? "",
  category_id: source.category_id ?? "",
  category_name: source.category_name ?? source.category ?? "",
  base_price: source.base_price ?? source.basePrice ?? "",
  selling_price: source.selling_price ?? source.sellingPrice ?? "",
  discounted_price: source.discounted_price ?? source.discountedPrice ?? "",
  stock_quantity: source.stock_quantity ?? source.stockCount ?? 0,
  warranty_months: source.warranty_months ?? 12,
  attributes: normalizeAttributes(source.attributes),
  images: normalizeImages(source.images),
});