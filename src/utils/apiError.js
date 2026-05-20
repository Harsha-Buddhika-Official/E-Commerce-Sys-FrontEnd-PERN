export const handleApiError = (error, fallbackMessage) => {
  const normalizedError = new Error(
    error.response?.data?.message || fallbackMessage
  );

  normalizedError.status = error.response?.status;
  normalizedError.body = error.response?.data;
  normalizedError.original = error;

  return normalizedError;
};