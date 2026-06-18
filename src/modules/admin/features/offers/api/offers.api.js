import API from "../../../../../api/client";

// for create offer in offer create overlay //successfully
export const createOffer = async (payload) => {
    const res = await API.post("/offers/admin/", payload, {
      timeout: 30000
    });
    return res.data;
};

// for attach product to offer in offer create page //successfully
export const attachProductToOffer = async (offerId, productId) => {
    const res = await API.post(`/offers/admin/products/${offerId}`, { product_id: productId });
    return res.data;
};

//for get all offers in offer page //successfully
export const fetchAllOffers = async () => {
    const res = await API.get("/offers/admin");
    return res.data;
};

// get one single offer full details for offer details page
export const fetchOfferById = async (offerId) => {
    const res = await API.get(`/offers/admin/${offerId}`);
    return res.data;
};

// for update offer in offer page //successfully
export const updateOffer = async (offerId, payload) => {
    const res = await API.put(`/offers/admin/${offerId}`, payload, { 
        timeout: 30000 
    });
    return res.data;
};

// for toggle offer active in offer page //successfully
export const setOfferActivation = async (offerId, isActive) => {
    const payload = { is_active: isActive };
    const res = await API.put(`/offers/admin/${offerId}/toggle`, payload);
    return res.data;
};

// for delete offer in offer page //successfully
export const deleteOffer = async (offerId) => {
    const res = await API.delete(`/offers/admin/${offerId}`);
    return res.data;
};
