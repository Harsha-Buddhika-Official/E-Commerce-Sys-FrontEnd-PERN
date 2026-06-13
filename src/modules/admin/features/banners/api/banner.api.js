import API from "../../../../../api/client";

// Get all banners
export const getAllBannersApi = async () =>{
  const res = await API.get("/banners/admin");
  return res.data;
}

// Get banner by id
export const getBannerByIdApi = async (id) =>{
  // console.log("Fetching banner with ID:", id);
  const res = await API.get(`/banners/${id}`);
  return res.data;
} 

// Create banner
export const createBannerApi = async (formData) => {
  const res = await API.post("/banners/admin", formData, {
    headers: {"Content-Type": "multipart/form-data",},
    timeout: 100000,
  });
  return res.data;
}

// Delete banner
export const deleteBannerApi = async (id) =>{
  const res = await API.delete(`/banners/admin/${id}`);
  return res.data;
}