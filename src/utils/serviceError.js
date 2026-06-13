export const handleServiceError = (
  error,
  fallbackMessage = "An unexpected service error occurred.",
  context = {}
) => {
  const response = error?.response;

  let message =
    response?.data?.message ||
    error?.message ||
    fallbackMessage;

  const validationErrors = response?.data?.error;

  if (Array.isArray(validationErrors)) {
    message = validationErrors
      .map((err) =>
        typeof err === "string"
          ? err
          : err?.message || "Unknown validation error"
      )
      .join(", ");
  } else if (typeof validationErrors === "string") {
    message = validationErrors;
  }

  const serviceError = new Error(message);

  serviceError.name = "ServiceError";
  serviceError.status = response?.status ?? error?.status ?? null;
  serviceError.body = response?.data ?? error?.body ?? null;
  serviceError.code = response?.data?.code ?? error?.code ?? null;
  serviceError.cause = error;

  serviceError.context = {
    service: context.service ?? null,
    operation: context.operation ?? null,
    details: context.details ?? null,
  };

  if (context.log !== false && import.meta.env.DEV) {
    console.error(`[${serviceError.context.service || "service"}] ${message}`, {
      status: serviceError.status,
      code: serviceError.code,
      operation: serviceError.context.operation,
      body: serviceError.body,
    });
  }

  return serviceError;
};