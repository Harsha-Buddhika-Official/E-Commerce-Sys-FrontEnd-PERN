import API from "../../../../../api/client";
import { handleApiError } from "../../../../../utils/apiError";
import {extractArrayPayload,extractObjectPayload,} from "../../../../../utils/payloadExtractors.js";

// GET ALL OFFERS
export const getAllOffers = async () => {
  try {
    const response = await API.get("/offers/user");
    return extractArrayPayload(response.data);
  } catch (error) {
    throw handleApiError(error, "Failed to fetch offers");
  }
};

// GET ALL OFFERS
export const getOffers = async (status) => {
  try {
    const response = await API.get("/offers", {
      params: status ? { status } : {}
    });
    return extractArrayPayload(response.data);
  } catch (error) {
    throw handleApiError(error, "Failed to fetch offers");
  }
};

// // GET ACTIVE OFFERS
// export const getActiveOffers = async () => {
//   try {
//     const response = await API.get("/offers/active");
//     return extractArrayPayload(response.data);
//   } catch (error) {
//     throw handleApiError(error, "Failed to fetch active offers");
//   }
// };

// // GET UPCOMING OFFERS
// export const getUpcomingOffers = async () => {
//   try {
//     const response = await API.get("/offers/upcoming");
//     return extractArrayPayload(response.data);
//   } catch (error) {
//     throw handleApiError(error, "Failed to fetch upcoming offers");
//   }
// };

// GET OFFER BY ID
export const getOfferById = async (id) => {
  try {
    const response = await API.get(`/offers/user/${id}`);
    return extractObjectPayload(response.data);
  } catch (error) {
    throw handleApiError(error, "Failed to fetch offer details");
  }
};

// GET OFFER PRODUCTS
export const getOfferProducts = async (offerId) => {
  try {
    const response = await API.get(`/offers/user/${offerId}/products`);
    return extractArrayPayload(response.data);
  } catch (error) {
    throw handleApiError(error, "Failed to fetch offer products");
  }
};