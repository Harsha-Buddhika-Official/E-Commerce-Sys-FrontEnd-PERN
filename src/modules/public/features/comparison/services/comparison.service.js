// src/features/comparison/services/comparison.service.js
import { startComparisonJob, getComparisonJobStatus } from "../api/comparison.api.js";

const STORAGE_KEY = "compare_list";
const MAX_COMPARE_ITEMS = 4;
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 30;

const readList = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeList = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("compare:updated"));
};

const unwrapResponse = (response) => {
  const payload = response?.data ?? response;
  if (payload?.success === false) {
    throw new Error(payload.message || "Comparison request failed");
  }
  return payload?.data ?? payload;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCompareList = () => readList();

export const addToCompareList = (productId) => {
  const list = readList();
  if (list.includes(productId)) return list;

  if (list.length >= MAX_COMPARE_ITEMS) {
    throw new Error(`You can compare up to ${MAX_COMPARE_ITEMS} products at a time.`);
  }

  const next = [...list, productId];
  writeList(next);
  return next;
};

export const removeFromCompareList = (productId) => {
  const next = readList().filter((id) => id !== productId);
  writeList(next);
  return next;
};

export const clearCompareList = () => {
  writeList([]);
};

export const runComparison = async (productIds, onProgress) => {
  const startResponse = await startComparisonJob(productIds);
  const { jobId } = unwrapResponse(startResponse);

  for (let attempt = 1; attempt <= MAX_POLL_ATTEMPTS; attempt++) {
    await sleep(POLL_INTERVAL_MS);

    const pollResponse = await getComparisonJobStatus(jobId);
    const data = unwrapResponse(pollResponse);

    if (data.status === "done") return data.result;
    if (data.status === "error") throw new Error(data.message || "Comparison failed");

    onProgress?.(attempt);
  }

  throw new Error("Comparison is taking longer than expected. Please try again.");
};