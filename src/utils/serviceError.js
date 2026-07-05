export const handleServiceError = (
  error,
  fallbackMessage = "An unexpected service error occurred.",
  context = {}
) => {
  const response = error?.response;
  const data = response?.data;

  const validationErrors = Array.isArray(data?.errors) ? data.errors : [];

  let message = fallbackMessage;

  if (validationErrors.length > 0) {
    message = validationErrors
      .map((err) =>
        typeof err === "string"
          ? err
          : err?.message || "Unknown validation error"
      )
      .join(", ");
  } else if (typeof data?.message === "string" && data.message.trim()) {
    message = data.message;
  } else if (error?.message) {
    message = error.message;
  }

  const serviceError = new Error(message);
  serviceError.name = "ServiceError";

  serviceError.status = response?.status ?? null;

  serviceError.code = data?.code ?? null;

  serviceError.networkCode = error?.code ?? null;

  serviceError.body = data ?? null;
  serviceError.errors = validationErrors;
  serviceError.cause = error;

  serviceError.context = {
    service: context.service ?? null,
    operation: context.operation ?? null,
    details: context.details ?? null,
  };

  if (context.log !== false && import.meta.env.DEV) {
    console.error(
      `[${serviceError.context.service || "service"}] ${message}`,
      {
        status: serviceError.status,
        code: serviceError.code,
        networkCode: serviceError.networkCode,
        operation: serviceError.context.operation,
        body: serviceError.body,
        validationErrors: serviceError.errors,
      }
    );
  }

  return serviceError;
};