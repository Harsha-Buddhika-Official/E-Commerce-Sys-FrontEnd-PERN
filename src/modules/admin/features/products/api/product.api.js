import API from "../../../../../api/client";

// ==================== READ ====================

export const fetchAllProductsLimited = async () => {
  const res = await API.get("/products/admin/limited-details");
  return res.data;
};

export const fetchProductsLimitedData = async () => {
  const res = await API.get("/products/admin/simple-details", { timeout: 30000 });
  return res.data;
};

export const fetchProductDetail = async (productId) => {
  const res = await API.get(`/products/admin/products/${productId}`);
  return res.data;
};

// ==================== CREATE ====================

export const createProduct = async (payload) => {
  const res = await API.post(
    "/products/admin/without-attributes",
    payload,
    { timeout: 30000 }
  );
  return res.data;
};

// ==================== UPDATE ====================

export const updateProductDetails = async (productId, payload) => {
  const res = await API.put(
    `/products/admin/products/${productId}/full-update`,
    payload,
    { timeout: 30000 }
  );
  return res.data;
};

// ==================== DELETE ====================

export const deleteProduct = async (productId) => {
  const res = await API.delete(
    `/products/admin/delete/${productId}`,
    { timeout: 30000 }
  );
  return res.data;
};

// ==================== ATTRIBUTES ====================

export const fetchProductAttributesByCategory = async (categoryId) => {
  const res = await API.get(`/attributes/admin/grouped/${categoryId}`);
  return res.data;
};

export const addProductAttribute = async (productId, payload) => {
  const res = await API.post(
    `/attributes/admin/products/${productId}/attributes`,
    payload,
    { timeout: 30000 }
  );
  return res.data;
};

// ==================== IMAGES ====================

export const addProductImages = async (productId, files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file, file.name);
  });

  const res = await API.post(
    `/products/admin/products/${productId}/images`,
    formData,
    { timeout: 30000 }
  );

  return res.data;
};

export const removeProductImage = async (productId, imageId) => {
  const res = await API.delete(
    `/products/admin/products/${productId}/images/${imageId}`
  );
  return res.data;
};

export const reorderProductImages = async (productId, primaryImageId, order) => {
  const res = await API.patch(
    `/products/admin/products/${productId}/images/reorder`,
    { primary_image_id: primaryImageId, order }
  );
  return res.data;
};