import API from "../../../../../api/client.js";

export const getCategories = async () => {
    const response = await API.get("/categories");
    return response.data;
};

export const getCategoryNames = async () => {
    const response = await API.get("/categories/names");
    return response.data;
};

export const createCategory = async (formData) => {
    const response = await API.post("/categories", formData,{
      headers: {"Content-Type": "multipart/form-data",},
      timeout: 100000,
    });
    return response.data;
};

export const deleteCategory = async (categoryId) => {
    const response = await API.delete(`/categories/${categoryId}`);
    return response.data;
};