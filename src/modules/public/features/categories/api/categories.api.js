import API from "../../../../../api/client";

export const getProductCategories = () => 
    API.get("/categories/products")


export const getAccessoryCategories = () => 
    API.get("/categories/accessories")
