export const handleServiceError = (
  error,
  fallbackMessage = "An unexpected service error occurred.",
  context = {}
) => {
  const response = error?.response;
  const data = response?.data;

  // Backend validation errors (Joi)
  const validationErrors = Array.isArray(data?.errors) ? data.errors : [];

  // Determine the most useful error message
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

  // HTTP information
  serviceError.status = response?.status ?? error?.status ?? null;
  serviceError.code = data?.code ?? error?.code ?? null;

  // Preserve backend payload
  serviceError.body = data ?? error?.body ?? null;

  // Preserve validation errors for forms
  serviceError.errors = validationErrors;

  // Original axios error
  serviceError.cause = error;

  // Optional context
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
        operation: serviceError.context.operation,
        body: serviceError.body,
        validationErrors: serviceError.errors,
      }
    );
  }

  return serviceError;
};