import API from "../../../../../api/client";

export const getBestSellers = () => {
    return API.get("/products/best-selling");
};

export const getLatestProducts = () => {
    return API.get("/products/latest");
}