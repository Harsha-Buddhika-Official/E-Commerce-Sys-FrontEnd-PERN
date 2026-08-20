// src/features/comparison/api/comparison.api.js
import API from "../../../../../api/client";

export const startComparisonJob = async (productIds) => {
  return await API.post("/ai", { productIds });
};

export const getComparisonJobStatus = async (jobId) => {
  return await API.get(`/ai/${jobId}`);
};