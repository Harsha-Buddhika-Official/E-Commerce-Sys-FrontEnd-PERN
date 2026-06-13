import { useState } from "react";
import { deleteBanner } from "../services/banner.service.js";

export const useDeleteBanner = () => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const removeBanner = async (bannerId) => {
    if (!bannerId) {
      const err = new Error("Banner ID is required");
      setError(err.message);
      throw err;
    }

    try {
      setDeleting(true);
      setError(null);

      return await deleteBanner(bannerId);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  return {deleteBanner: removeBanner, deleting, error,};
};