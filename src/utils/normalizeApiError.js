export const normalizeApiError = (error) => ({
  message: error?.response?.data?.message || error?.message || "Request failed",
  status:  error?.response?.status ?? null,
  code:    error?.code ?? null,
  body:    error?.response?.data ?? null,
});