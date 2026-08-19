// src/features/comparison/service/comparison.service.js
import { compareProducts as compareProductsRequest } from "../api/comparison.api.js";

const STORAGE_KEY = "compare_list";
const MAX_COMPARE_ITEMS = 4;

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

export const runComparison = async (productIds) => {
  const response = await compareProductsRequest(productIds);
  return unwrapResponse(response);
};