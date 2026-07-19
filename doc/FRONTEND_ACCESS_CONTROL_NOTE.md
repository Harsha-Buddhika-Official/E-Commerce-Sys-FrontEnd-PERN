# Frontend Access Control Note

This frontend is a consumer of the API, so it is not the place where broken access control is enforced or fixed. Even if the UI never rendered the orders page, the backend endpoint could still be called directly with curl or Postman if server-side authorization is missing.

Start with the backend curl test first. That tells you whether the issue is a real access-control problem or just a frontend wiring check.

## What Is Worth Confirming On The Frontend

### 1. `src/api/client.js`
Confirm the shared Axios instance attaches `Authorization: Bearer <token>` on every request by reading `localStorage.admin_token`.

If the token is not being attached consistently, the admin UI may look protected in the browser while the backend is still receiving unauthenticated requests. That is a frontend bug, but it is separate from broken access control.

### 2. `src/App/routers/AdminRoutes.jsx`
Confirm the Orders route is wrapped by `ProtectedRoute.jsx`.

That guard only blocks browser navigation to the page when there is no token. It does not protect the API endpoint itself, so it is not a fix for backend authorization.

## Recommended Verification Order

1. Test the endpoint directly with curl or Postman.
2. Confirm `src/api/client.js` adds the bearer token header.
3. Confirm `ProtectedRoute.jsx` wraps the Orders page route in `AdminRoutes.jsx`.

## Bottom Line

A perfectly locked-down frontend does not protect an unprotected backend route. If the backend allows anonymous access, the real fix belongs server-side, not in the page component, hook, or route wrapper.