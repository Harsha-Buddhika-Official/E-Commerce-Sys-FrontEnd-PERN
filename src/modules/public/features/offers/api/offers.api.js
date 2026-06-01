import API from "../../../../../api/client";

export const getAllOffers = () =>
  API.get("/offers/user");

export const getActiveOffers = () =>
  API.get("/offers/active");

export const getUpcomingOffers = () =>
  API.get("/offers/upcoming");

export const getOfferById = (id) =>
  API.get(`/offers/user/${id}`);

export const getOfferProducts = (offerId) =>
  API.get(`/offers/user/${offerId}/products`);
