import {
  getAllBannersApi,
  getBannerByIdApi,
  createBannerApi,
  deleteBannerApi,
} from "../api/banner.api";

import { handleServiceError } from "../../../../../utils/serviceError.js";
import { extractArrayPayload, extractObjectPayload } from "../../../../../utils/payloadExtractors.js";

// Get All Banners
export const getAllBanners = async () => {
  try {
    const response = await getAllBannersApi();
    // console.log("Raw API Response for getAllBanners:", response); // Debug log
    return extractArrayPayload(response.data.data);
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch banners");
  }
};

// Get Banner By ID
export const getBannerById = async (id) => {
  try {
    const response = await getBannerByIdApi(id);
    // console.log("Raw API Response for getBannerById:", response); // Debug log
    return extractObjectPayload(response.data);
  } catch (error) {
    throw handleServiceError(error, "Failed to fetch banner");
  }
};

// Create Banner
export const createBanner = async (payload) => {
  const { title, image } = payload;
  try {
    const formData = new FormData();
    formData.append("title", title);

    if (image) {
      formData.append("media", image);
    }

    const response = await createBannerApi(formData);

    return extractObjectPayload(response.data);
  } catch (error) {
    throw handleServiceError(error, "Failed to create banner");
  }
};

// Delete Banner
export const deleteBanner = async (bannerId) => {
  try {
    const response = await deleteBannerApi(bannerId);
    return extractObjectPayload(response.data);
  } catch (error) {
    throw handleServiceError(error, "Failed to delete banner");
  }
};