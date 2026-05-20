import API from "../../../../../api/client";

export const getAllOffers = () =>
  API.get("/offers");

export const getActiveOffers = () =>
  API.get("/offers/active");

export const getOfferById = (id) =>
  API.get(`/offers/${id}`);

export const getOfferProducts = (offerId) =>
  API.get(`/offers/${offerId}/products`);
