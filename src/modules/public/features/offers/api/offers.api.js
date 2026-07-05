import API from "../../../../../api/client";

// Get all offers (user-facing catalog)
export const getAllOffers = async () => {
  const res = await API.get("/offers/user");
  return res.data;
};

// Get offers filtered by status (admin/general)
export const getOffers = async (status) => {
  const res = await API.get("/offers", {
    params: status ? { status } : {},
  });
  return res.data;
};

// Get active offers only
export const getActiveOffers = async () => {
  const res = await API.get("/offers/active");
  return res.data;
};

// Get upcoming offers only
export const getUpcomingOffers = async () => {
  const res = await API.get("/offers/upcoming");
  return res.data;
};

// Get a single offer by id (products embedded in response)
export const getOfferById = async (offerId) => {
  const res = await API.get(`/offers/user/${offerId}`);
  return res.data;
};

// Get products belonging to a specific offer
export const getOfferProducts = async (offerId) => {
  const res = await API.get(`/offers/user/${offerId}/products`);
  return res.data;
};