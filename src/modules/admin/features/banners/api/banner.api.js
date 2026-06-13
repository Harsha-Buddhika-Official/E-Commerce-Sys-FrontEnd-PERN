import API from "../../../../../api/client";

// Get all banners
export const getAllBannersApi = async () =>{
  return API.get("/banners/admin").then((res) => res.data);
}

// Get banner by id
export const getBannerByIdApi = async (id) =>{
  // console.log("Fetching banner with ID:", id);
  return API.get(`/banners/${id}`).then((res) => res.data);
} 

// Create banner
export const createBannerApi = async (formData) => {
  return API.post("/banners/admin", formData, {
    headers: {"Content-Type": "multipart/form-data",},
    timeout: 100000,
  }).then((res) => res.data);
}

// Delete banner
export const deleteBannerApi = async (id) =>{
  return API.delete(`/banners/admin/${id}`).then((res) => res.data);
}