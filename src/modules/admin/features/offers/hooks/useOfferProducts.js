import { useState } from "react";
import { attachProductService, detachProductService } from "../service/offers.service.js";

/**
 * Hook to manage offer products (attach/detach)
 * Returns: { attaching, detaching, error, attachProduct, detachProduct }
 */
export const useOfferProducts = () => {
  const [attaching, setAttaching] = useState(false);
  const [detaching, setDetaching] = useState(false);
  const [error, setError] = useState(null);

  const attachProduct = async (offerId, productId) => {
    if (!offerId) {
      const err = new Error("Offer ID is required");
      setError(err);
      throw err;
    }
    if (!productId) {
      const err = new Error("Product ID is required");
      setError(err);
      throw err;
    }

    setAttaching(true);
    setError(null);
    try {
      const res = await attachProductService(offerId, productId);
      setAttaching(false);
      return res;
    } catch (err) {
      setError(err);
      setAttaching(false);
      throw err;
    }
  };

  const detachProduct = async (offerId, productId) => {
    if (!offerId) {
      const err = new Error("Offer ID is required");
      setError(err);
      throw err;
    }
    if (!productId) {
      const err = new Error("Product ID is required");
      setError(err);
      throw err;
    }

    setDetaching(true);
    setError(null);
    try {
      const res = await detachProductService(offerId, productId);
      setDetaching(false);
      return res;
    } catch (err) {
      setError(err);
      setDetaching(false);
      throw err;
    }
  };

  return { attaching, detaching, error, attachProduct, detachProduct };
};
