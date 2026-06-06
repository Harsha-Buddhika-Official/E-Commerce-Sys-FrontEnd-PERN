export const handleServiceError = (
  error,
  fallbackMessage,
  context = {}
) => {
  const response = error?.response;

  let message =
    response?.data?.message ||
    error?.message ||
    fallbackMessage ||
    "An unexpected service error occurred.";

  // Handle validation errors array
  if (Array.isArray(response?.data?.error)) {
    message = response.data.error
      .map((err) => err.message)
      .join(", ");
  }
  // Handle string error
  else if (typeof response?.data?.error === "string") {
    message = response.data.error;
  }

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