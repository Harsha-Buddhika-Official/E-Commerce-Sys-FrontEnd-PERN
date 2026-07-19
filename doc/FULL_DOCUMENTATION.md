# Full Frontend Documentation

_Scanned from the current codebase on 2026-07-05._

## 1. Overview

This repository is the frontend for an e-commerce system built with React and Vite. It contains two major user experiences:

- A customer-facing public store for browsing products, categories, offers, cart, checkout, and order tracking.
- An admin panel for managing products, orders, brands, categories, attributes, banners, offers, admins, and settings.

The frontend follows a modular feature-based structure. UI components, hooks, services, API calls, and normalizers are grouped by domain instead of by generic layers only. That keeps the public and admin areas isolated while still sharing common utilities.

## 2. Technology Stack

### Core runtime

- React 19.2.5
- React Router DOM 7.14.2
- Vite 8.0.10

### UI and styling

- Tailwind CSS 4.2.4
- Material UI 9.0.0
- Emotion 11.x

### Networking and auth helpers

- Axios 1.16.0
- jwt-decode 4.0.0
- dotenv 17.4.2

### Tooling

- ESLint 10.2.1
- @vitejs/plugin-react

## 3. Entry Points

### Main boot flow

- [src/main.jsx](src/main.jsx) mounts the app with `BrowserRouter`.
- [src/App.jsx](src/App.jsx) renders the router and the cart success toast.
- The app also enables a development-only error filter for browser extension messaging noise.

### Router composition

- [src/App/routers/AppRouter.jsx](src/App/routers/AppRouter.jsx) splits the app into public and admin route trees.
- [src/App/routers/PublicRoutes.jsx](src/App/routers/PublicRoutes.jsx) renders the public shell with navbar and footer.
- [src/App/routers/AdminRoutes.jsx](src/App/routers/AdminRoutes.jsx) renders the protected admin area.

## 4. Environment Configuration

The Axios client reads the backend base URL from `VITE_API_URL`.

Current code reference:

- [src/api/client.js](src/api/client.js)

Current `.env` usage in the workspace:

- `VITE_API_URL=https://e-commerce-sys-backend-pern-production.up.railway.app/api`
- `VITE_API_URL=http://localhost:4000/api` is present as a commented local fallback

Important note:

- The current frontend client uses `VITE_API_URL`.
- Some older docs in the repo mention `VITE_API_BASE_URL`, but that is not what the Axios client reads today.

## 5. Application Architecture

The application is organized around a feature-first module structure.

### Main structure

- `src/api/` contains shared HTTP client configuration.
- `src/App/` contains app-level routing and route guards.
- `src/modules/public/` contains the customer-facing storefront.
- `src/modules/admin/` contains the admin panel.
- `src/utils/` contains shared error helpers, normalizers, validators, and formatters.
- `src/styles/` contains shared typography constants.

### Common pattern used throughout the codebase

Most feature domains follow a service pipeline like this:

1. API layer for raw network requests.
2. Service layer for transformation and business rules.
3. Hook layer for state, loading, and error management.
4. UI layer for rendering pages and components.

This pattern is used heavily in both the public and admin areas.

## 6. Routing Map

### Public routes

Handled by [src/App/routers/PublicRoutes.jsx](src/App/routers/PublicRoutes.jsx).

- `/` -> Home
- `/products` -> Product listing
- `/product/:id` -> Product details
- `/cart` -> Cart page
- `/services` -> Services page
- `/offers` -> Offers listing
- `/offers/:id` -> Offer detail page
- `/about` -> About page
- `/contact` -> Contact page
- `/checkout-direct` -> Direct checkout
- `/checkout-cart` -> Cart checkout
- `/track-order` -> Order tracking

The public shell includes:

- [src/modules/public/components/Navigation/Navbar.jsx](src/modules/public/components/Navigation/Navbar.jsx)
- [src/modules/public/components/Layout/Footer.jsx](src/modules/public/components/Layout/Footer.jsx)

### Admin routes

Handled by [src/App/routers/AdminRoutes.jsx](src/App/routers/AdminRoutes.jsx).

- `/admin` -> Login
- `/admin/dashboard` -> Dashboard
- `/admin/orders` -> Orders list
- `/admin/orders/:id` -> Order detail
- `/admin/orders/:id/receipt` -> Order receipt
- `/admin/products` -> Products list
- `/admin/products/:id` -> Product detail
- `/admin/products/add` -> Create product base data
- `/admin/products/add/attributes` -> Add product attributes
- `/admin/products/:id/edit` -> Edit product
- `/admin/brands` -> Brand management
- `/admin/attributes` -> Attribute management
- `/admin/categories` -> Category management
- `/admin/admin` -> Admin management
- `/admin/admin/create` -> Admin creation
- `/admin/promotions` -> Promotions list
- `/admin/promotions/:id` -> Promotion detail
- `/admin/banners` -> Banner management
- `/admin/banners/view/:id` -> Banner detail
- `/admin/settings` -> Settings

### Route protection

- [src/App/components/ProtectedRoute.jsx](src/App/components/ProtectedRoute.jsx) blocks unauthenticated access and redirects to `/admin`.
- [src/App/components/RoleProtectedRoute.jsx](src/App/components/RoleProtectedRoute.jsx) exists as a reusable role guard.
- `AdminRoutes.jsx` currently uses an inline `RoleRoute` helper for role-restricted pages.

## 7. Authentication and Authorization

The admin authentication flow is token based.

### Auth storage

- The admin token is stored in localStorage under `admin_token`.
- The Axios client attaches that token as `Authorization: Bearer <token>`.
- On `401` responses, the client clears `admin_token` and `user`, then redirects to `/admin` unless the request was the login request.

### Auth helpers

- [src/modules/admin/features/auth/service/auth.service.js](src/modules/admin/features/auth/service/auth.service.js)
- [src/modules/admin/features/auth/hooks/useAuth.js](src/modules/admin/features/auth/hooks/useAuth.js)
- [src/modules/admin/features/auth/hooks/useAdminLogin.js](src/modules/admin/features/auth/hooks/useAdminLogin.js)
- [src/App/hooks/useRole.js](src/App/hooks/useRole.js)

### Auth behavior

- `loginAdminService()` saves the backend token and returns the admin payload.
- `isAuthenticated()` checks that a token exists and that it is not expired.
- `useAutoLogout()` schedules logout when the token expires.
- `useRole()` and `useAuth()` expose role helpers such as `isAdmin`, `isManager`, and `isSuperAdmin`.

### Role model used in the frontend

- `manager`
- `admin`
- `super_admin`

The admin router allows different pages based on those roles.

## 8. Public Module

Path: `src/modules/public/`

The public module covers the store experience visible to customers.

### Public pages

- [src/modules/public/pages/Home.jsx](src/modules/public/pages/Home.jsx)
- [src/modules/public/pages/ProductsPage.jsx](src/modules/public/pages/ProductsPage.jsx)
- [src/modules/public/pages/ProductInfoPage.jsx](src/modules/public/pages/ProductInfoPage.jsx)
- [src/modules/public/pages/CartPage.jsx](src/modules/public/pages/CartPage.jsx)
- [src/modules/public/pages/CartCheckoutPage.jsx](src/modules/public/pages/CartCheckoutPage.jsx)
- [src/modules/public/pages/DirectCheckout.jsx](src/modules/public/pages/DirectCheckout.jsx)
- [src/modules/public/pages/OffersPage.jsx](src/modules/public/pages/OffersPage.jsx)
- [src/modules/public/pages/OfferDetailPage.jsx](src/modules/public/pages/OfferDetailPage.jsx)
- [src/modules/public/pages/AboutPage.jsx](src/modules/public/pages/AboutPage.jsx)
- [src/modules/public/pages/ContactPage.jsx](src/modules/public/pages/ContactPage.jsx)
- [src/modules/public/pages/ServicesPage.jsx](src/modules/public/pages/ServicesPage.jsx)
- [src/modules/public/pages/TrackOrderPage.jsx](src/modules/public/pages/TrackOrderPage.jsx)

### Public component groups

- `Navigation/` - navbar, search overlay, category overlay
- `Layout/` - footer
- `Product/` - cards, grids, category tiles, badges
- `Cart/` - cart drawer and cart items
- `Filter/` - product filters
- `Offer/` - offer cards
- `Notifications/` - cart success toast
- `order/` - order success screen and related UI

### Public feature groups

- `banners/`
- `cart/`
- `categories/`
- `offers/`
- `orders/`
- `products/`
- `search/`

### Public experience notes

- The public area is styled with a strong visual identity using the shared Sora font and a dark/red accent palette.
- Product browsing supports filter-driven discovery and category overlays.
- Checkout flows are split into direct checkout and cart checkout.
- Order tracking is exposed as a dedicated public page.

## 9. Admin Module

Path: `src/modules/admin/`

The admin module is the operational control center for the store.

### Admin pages

- [src/modules/admin/pages/admin/AdminLoginPage.jsx](src/modules/admin/pages/admin/AdminLoginPage.jsx)
- [src/modules/admin/pages/admin/AdminDashboardPage.jsx](src/modules/admin/pages/admin/AdminDashboardPage.jsx)
- [src/modules/admin/pages/admin/AdminManagementPage.jsx](src/modules/admin/pages/admin/AdminManagementPage.jsx)
- [src/modules/admin/pages/admin/AdminCreatePage.jsx](src/modules/admin/pages/admin/AdminCreatePage.jsx)
- [src/modules/admin/pages/order/OrdersPage.jsx](src/modules/admin/pages/order/OrdersPage.jsx)
- [src/modules/admin/pages/order/OrderDetailPage.jsx](src/modules/admin/pages/order/OrderDetailPage.jsx)
- [src/modules/admin/pages/order/OrderReceiptPage.jsx](src/modules/admin/pages/order/OrderReceiptPage.jsx)
- [src/modules/admin/pages/product/ProductsPage.jsx](src/modules/admin/pages/product/ProductsPage.jsx)
- [src/modules/admin/pages/product/ProductInfoPage.jsx](src/modules/admin/pages/product/ProductInfoPage.jsx)
- [src/modules/admin/pages/product/AddProductBasicPage.jsx](src/modules/admin/pages/product/AddProductBasicPage.jsx)
- [src/modules/admin/pages/product/AddProductAttributes.jsx](src/modules/admin/pages/product/AddProductAttributes.jsx)
- [src/modules/admin/pages/product/EditProductPage.jsx](src/modules/admin/pages/product/EditProductPage.jsx)
- [src/modules/admin/pages/brand/BrandPage.jsx](src/modules/admin/pages/brand/BrandPage.jsx)
- [src/modules/admin/pages/attribute/AttributesPage.jsx](src/modules/admin/pages/attribute/AttributesPage.jsx)
- [src/modules/admin/pages/categories/CategoriesPage.jsx](src/modules/admin/pages/categories/CategoriesPage.jsx)
- [src/modules/admin/pages/banners/BannerListPage.jsx](src/modules/admin/pages/banners/BannerListPage.jsx)
- [src/modules/admin/pages/banners/ViewBannerPage.jsx](src/modules/admin/pages/banners/ViewBannerPage.jsx)
- [src/modules/admin/pages/promotion/PromotionsPage.jsx](src/modules/admin/pages/promotion/PromotionsPage.jsx)
- [src/modules/admin/pages/promotion/PromotionDetailPage.jsx](src/modules/admin/pages/promotion/PromotionDetailPage.jsx)
- [src/modules/admin/pages/settings/SettingsPage.jsx](src/modules/admin/pages/settings/SettingsPage.jsx)

### Admin component groups

- `components/` - navbar, sidebar, reusable cards, tables, modals, dashboard widgets
- `components/admin/` - admin grid, admin card, status row
- `components/Orders/` - order table and order stat card
- `components/product/` - product grid and product card
- `components/banners/` - banner card and delete modal
- `components/brand/` - brand card
- `components/attributes/` - attribute card, delete modal, category chip
- `components/Dashboard/` - low stock alert, recent orders, stat card
- `overlay/` - create/edit overlays for banners, brands, attributes, promotions, notifications, and timeout state

### Admin feature groups

- `auth/` - login, token handling, auth utilities
- `dashboard/` - dashboard metrics, stock data, stat helpers
- `orders/` - order status, recent orders, receipt handling, order details
- `products/` - product CRUD, image management, details, sorting, filtering
- `brands/` - brand CRUD and brand normalization
- `categories/` - category CRUD and grouped category handling
- `attributes/` - attribute and value management
- `banners/` - banner CRUD and banner detail views
- `offers/` - offer CRUD and offer normalization
- `admin/` - admin user management utilities and APIs
- `notifications/` - admin notification data

### Admin shell behavior

- [src/App/components/AdminLayout.jsx](src/App/components/AdminLayout.jsx) wraps the admin pages.
- It renders the admin navbar and sidebar.
- It loads notifications on mount.
- It computes the current page title from the URL.
- It keeps the admin content inside a constrained full-height layout.

## 10. Shared Utilities

Path: `src/utils/`

### Error helpers

- [src/utils/apiError.js](src/utils/apiError.js) exports `handleApiError`.
- [src/utils/serviceError.js](src/utils/serviceError.js) exports `handleServiceError`.
- [src/utils/handleHookError.js](src/utils/handleHookError.js) exports `handleHookError`.

Current usage pattern:

- Service layers generally use `handleServiceError`.
- Hook layers generally use `handleHookError`.
- `handleApiError` exists as a generic API error wrapper, but the current active feature code mainly uses the service and hook wrappers instead.

### Other shared helpers

- `dateFormatters.js`
- `formatAttributeName.js`
- `normalizers.js`
- `payloadExtractors.js`
- `validators.js`

### Typography constants

- [src/styles/fonts.js](src/styles/fonts.js) provides shared font constants.

## 11. Networking Layer

### Axios client

The shared HTTP client lives in [src/api/client.js](src/api/client.js).

Behavior:

- Uses `axios.create()`.
- Applies `baseURL` from `import.meta.env.VITE_API_URL`.
- Uses a 5 second timeout.
- Sends cookies with requests.
- Injects the admin token into `Authorization` when available.
- On unauthorized responses, clears auth state and redirects to `/admin`.

### Backend integration style

All network features are built around that client. Feature APIs call `API.get`, `API.post`, `API.put`, or `API.delete`, then service and hook layers normalize or transform the result.

## 12. Design System and UI Patterns

### Visual language

- Strong black, gray, and red palette.
- Sora is the primary brand font.
- Content uses compact, dense spacing in many places.
- Admin UI combines Tailwind styling, MUI icons, and custom layout components.

### Public UI patterns

- Hero sections with promotional visuals.
- Product cards and grids.
- Search and category overlays.
- Dedicated checkout screens.

### Admin UI patterns

- Sidebar plus top navbar shell.
- Card-based KPIs and dashboard widgets.
- Tables and management views for CRUD-heavy screens.
- Modal and overlay-based create/edit flows.

## 13. Data and Feature Flow

The frontend is designed around a predictable flow:

1. A page component mounts.
2. The page uses a custom hook for data loading or mutation.
3. The hook calls a service.
4. The service calls an API module.
5. The API module uses the shared Axios client.
6. Errors are normalized and passed back through the hook layer.
7. UI components render data, loading state, or error state.

This pattern appears across products, orders, banners, offers, categories, brands, and admin management.

## 14. Notable Conventions

- Feature folders are grouped by domain instead of by generic technical layer only.
- Most admin and public capabilities have their own `api`, `service`, `hooks`, and `components` subfolders.
- Route guards and auth helpers are centralized instead of duplicated in pages.
- Data normalization is used where backend payloads need cleanup before rendering.
- The codebase favors reusable overlay and modal components for create/edit interactions.

## 15. Project-Level Scripts

From [package.json](package.json):

- `npm run dev` -> start the Vite dev server
- `npm run build` -> create a production build
- `npm run preview` -> preview the built app
- `npm run lint` -> run ESLint

## 16. Current System Notes

- The public and admin areas are both active in the router.
- The admin area is fully protected by token-based auth and role-aware page gating.
- The frontend is production-oriented and not a toy scaffold; it already has substantial domain separation for products, orders, offers, categories, brands, banners, attributes, and auth.
- Some older repository docs still mention older config names or legacy paths, but the current code should be treated as the source of truth.

## 17. Suggested Next Documentation Additions

If you want to extend this document later, the next useful additions would be:

- A file-by-file API map for every feature module.
- A backend endpoint contract reference.
- A page-by-page UI walkthrough with screenshots.
- A deployment and environment hardening section.
