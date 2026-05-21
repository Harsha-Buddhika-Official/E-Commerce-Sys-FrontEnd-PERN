import API from "../../../../../api/client";

export const searchProductsByName = (name) => {
  const encoded = encodeURIComponent(name ?? "");
  return API.get(`/products/search/${encoded}`);
};
