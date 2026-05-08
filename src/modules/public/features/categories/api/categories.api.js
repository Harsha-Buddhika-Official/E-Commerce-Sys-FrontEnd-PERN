import API from "../../../../../api/client";

export const getProductCategories = () => {
    return API.get("/categories/products")
}

export const getAccessoryCategories = () => {
    return API.get("/categories/accessories")
}