export const handleServiceError = (error, fallbackMessage, context = {}) => {
  const response = error?.response;
  const message =
    response?.data?.message ||
    response?.data?.error ||
    error?.message ||
    fallbackMessage ||
    "An unexpected service error occurred.";

  const serviceError = new Error(message);
  serviceError.name = "ServiceError";
  serviceError.status = response?.status ?? error?.status ?? null;
  serviceError.body = response?.data ?? error?.body ?? null;
  serviceError.code = response?.data?.code ?? error?.code ?? null;
  serviceError.cause = error;
  serviceError.context = {
    service: context.service || null,
    operation: context.operation || null,
    details: context.details || null,
  };

  if (context.log !== false) {
    const scope = context.service || context.operation || "service";
    console.error(`[${scope}] ${message}`, {
      status: serviceError.status,
      code: serviceError.code,
      body: serviceError.body,
    });
  }

  return serviceError;
};