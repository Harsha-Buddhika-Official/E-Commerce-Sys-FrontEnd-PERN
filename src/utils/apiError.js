export const handleApiError = (
  error,
  fallbackMessage = "An unexpected API error occurred."
) => {
  const apiError = new Error(
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  );

  apiError.name = "ApiError";
  apiError.status = error?.response?.status ?? null;
  apiError.body = error?.response?.data ?? null;
  apiError.code = error?.code ?? null;
  apiError.cause = error;

  return apiError;
};