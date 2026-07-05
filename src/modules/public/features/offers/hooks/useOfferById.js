import { useEffect, useState, useCallback } from "react";
import { fetchOfferByIdService } from "../service/offers.service.js";

const normalizeOffer = (raw) => {
  if (!raw) return null;

  const product = raw.products?.[0]?.product || null;

  return {
    ...raw,

    // FIX: normalize product images
    products: raw.products?.map((p) => ({
      ...p,
      product: {
        ...p.product,
        images: p.product?.image
          ? [p.product.image] // backend gives single image object → convert to array
          : [],
      },
    })),

    // FIX: ensure attributes always safe
    productAttributes:
      product?.attributes?.map((a) => ({
        attribute_name: a.attribute_name || a.name,
        value: a.value,
      })) || [],
  };
};

export const useOfferById = (id) => {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchOfferByIdService(id);

      setOffer(normalizeOffer(data));
    } catch (err) {
      setError(err.message || "Failed to load offer");
      setOffer(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) load();
  }, [id, load]);

  return { offer, loading, error, refresh: load };
};