import {
  fetchAllProductsLimited,
  fetchProductsLimitedData,
  fetchProductDetail,
  updateProductFull as apiUpdateProductFull,
  deleteProduct,
  createProduct as apiCreateProduct,
  fetchProductAttributesByCategory as apiFetchAttributesByCategory,
  addProductAttribute as apiAddProductAttribute,
} from "../api/product.api.js";
import { handleServiceError } from "../../../../../utils/serviceError.js";

const normalizeProduct = (product) => ({
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

// Helpers used by admin pages for form population
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

export const getAllProductsLimited = async () => {
  try {
    const response = await fetchAllProductsLimited();

    // Validate response structure
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response structure from API");
    }

    // Extract data array (handle different response shapes)
    let products = [];
    if (Array.isArray(response)) {
      products = response;
    } else if (response.data && Array.isArray(response.data)) {
      products = response.data;
    } else {
      throw new Error("No products data found in response");
    }

    // Normalize each product
    return products
      .filter((p) => p && typeof p === "object")
      .map(normalizeProduct)
      .sort((a, b) => b.id - a.id); // Descending order by ID
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch products", {
      service: "products",
      operation: "getAllProductsLimited",
    });
  }
};

export const getProductsLimitedData = async () => {
  try {
    const response = await fetchProductsLimitedData();
    const products = Array.isArray(response) ? response : response?.data ?? [];
    return products.map((product) => ({
      product_id: product.product_id,
      name: product.name,
      category_name: product.category_name || product.category || "Product",
      selling_price: product.discounted_price ?? product.price ?? 0,
      is_active: product.is_active,
    }));
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch limited product data", {
      service: "products",
      operation: "getProductsLimitedData",
    });
  }
};

export const getProductDetail = async (productId) => {
  try {
    const response = await fetchProductDetail(productId);
    if (!response || typeof response !== "object") {
      throw new Error("Invalid product detail response");
    }

    if (response.success !== true) {
      throw new Error(response.message || "Failed to fetch product details");
    }

    const product = response.data;
    if (!product || typeof product !== "object") {
      throw new Error("Invalid product detail response");
    }

    return product;
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch product details", {
      service: "products",
      operation: "getProductDetail",
    });
  }
};

export const updateProductFull = async (productId, payload, images = []) => {
  if (!productId) throw new Error("productId is required");

  try {
    // If there are uploaded File objects, send multipart/form-data
    const localFiles = Array.isArray(images) ? images.filter((img) => img._file) : [];

    if (localFiles.length > 0) {
      if (localFiles.length > 3) throw new Error("You can upload up to 3 images only.");

      const fd = new FormData();

      // Append scalar fields
      Object.entries(payload || {}).forEach(([key, value]) => {
        if (typeof value === "undefined" || value === null) return;
        if (typeof value === "object") fd.append(key, JSON.stringify(value));
        else fd.append(key, String(value));
      });

      // Attributes should be sent as JSON string if present
      if (payload?.attributes) fd.set("attributes", JSON.stringify(payload.attributes));

      // Append files and build metadata
      const imagesMeta = [];
      images.forEach((img) => {
        if (img._file) {
          fd.append("images", img._file, img._file.name);
          imagesMeta.push({
            fileName: img._file.name,
            alt_text: img.alt_text || "",
            sort_order: Number(img.sort_order ?? 0),
            is_primary: Boolean(img.is_primary),
          });
        }
      });

      if (imagesMeta.length) fd.set("images_meta", JSON.stringify(imagesMeta));

      // Call API with FormData
      const response = await apiUpdateProductFull(productId, fd);
      if (!response || typeof response !== "object") throw new Error("Invalid update product response");
      if (response.success !== true) throw new Error(response.message || "Failed to update product");
      return response.data;
    }

    // No file uploads: include images metadata if provided as objects
    if (Array.isArray(images) && images.length) {
      payload = {
        ...payload,
        images: images.map((image) => ({
          image_url: image.image_url,
          is_primary: Boolean(image.is_primary),
          alt_text: image.alt_text || "",
          sort_order: Number(image.sort_order ?? 0),
        })),
      };
    }

    const response = await apiUpdateProductFull(productId, payload);
    if (!response || typeof response !== "object") throw new Error("Invalid update product response");
    if (response.success !== true) throw new Error(response.message || "Failed to update product");
    return response.data;
  } catch (error) {
    throw handleServiceError(error, "Failed to update product", {
      service: "products",
      operation: "updateProductFull",
    });
  }
};

export const deleteProductService = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }
  try {
    const res = await deleteProduct(productId);
    return res;
  } catch (error) {
    throw handleServiceError(error, "Failed to delete product", {
      service: "products",
      operation: "deleteProductService",
    });
  }
};

export const createProduct = async (payload) => {
  try {
    return await apiCreateProduct(payload);
  } catch (error) {
    throw handleServiceError(error, "Failed to create product", {
      service: "products",
      operation: "createProduct",
    });
  }
};

export const fetchAttributesByCategory = async (categoryId) => {
  try {
    return await apiFetchAttributesByCategory(categoryId);
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch attributes for category", {
      service: "products",
      operation: "fetchAttributesByCategory",
    });
  }
};

export const addAttributeToProduct = async (productId, payload) => {
  try {
    return await apiAddProductAttribute(productId, payload);
  } catch (error) {
    throw handleServiceError(error, "Failed to add attribute to product", {
      service: "products",
      operation: "addAttributeToProduct",
    });
  }
};
