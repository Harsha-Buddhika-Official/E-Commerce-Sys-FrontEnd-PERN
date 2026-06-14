export const handleHookError = (error, fallbackMessage = "Something went wrong.") => {
  const hookError = new Error(error?.message || fallbackMessage);
  hookError.name = "HookError";
  hookError.status = error?.status ?? null;
  hookError.code = error?.code ?? null;
  hookError.body = error?.body ?? null;
  hookError.cause = error;
  return hookError;
};