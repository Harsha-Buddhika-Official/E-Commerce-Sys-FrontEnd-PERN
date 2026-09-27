# E-Commerce System — Frontend

[![React](https://img.shields.io/badge/React-19.2.5-61DAFB?logo=react&logoColor=black)](#)
[![Vite](https://img.shields.io/badge/Vite-8.0.10-646CFF?logo=vite&logoColor=white)](#)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-4.2.4-06B6D4?logo=tailwindcss&logoColor=white)](#)
[![License](https://img.shields.io/badge/license-unspecified-lightgrey)](#license)

A production-oriented React frontend for a full-stack e-commerce platform, providing two distinct experiences behind a single codebase:

- **Public Storefront** — product discovery, cart, checkout, order tracking, offers, and an AI-assisted shopping experience.
- **Admin Dashboard** — catalog, order, promotion, and administrator management for authorized staff.

The application communicates with a REST API through a centralized Axios client and follows a **feature/domain-oriented architecture**, keeping each business capability self-contained and independently maintainable.

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Public Store](#public-store)
6. [Admin Panel](#admin-panel)
7. [Cross-Cutting Concerns](#cross-cutting-concerns)
8. [Getting Started](#getting-started)
9. [Scripts & Tooling](#scripts--tooling)
10. [Deployment](#deployment)
11. [Security Model](#security-model)
12. [Backend Dependency](#backend-dependency)
13. [Additional Documentation](#additional-documentation)
14. [Contributing](#contributing)
15. [Deployment Checklist](#deployment-checklist)
16. [Project Scope & Status](#project-scope--status)
17. [License](#license)

---

## Overview

This repository contains the **frontend application** of the E-Commerce System. It owns the user interface, client-side routing, API communication, authentication state, role-based navigation, product discovery, cart interactions, checkout flows, order tracking, and admin workflows.

### Application Domains

| Area | Responsibility |
|---|---|
| Public Store | Customer-facing shopping experience |
| Product Catalog | Browse, search, filter, compare, and inspect products |
| Cart & Checkout | Manage cart state and create orders |
| Offers | Browse active/upcoming promotions and offer details |
| Order Tracking | Track existing orders and upload payment receipts |
| AI Features | Product comparison and conversational assistant |
| Admin Dashboard | Operational overview for store management |
| Admin Product Management | Create, update, delete, and organize products |
| Admin Orders | View orders, statuses, details, and receipts |
| Admin Catalog Management | Categories, brands, attributes, banners |
| Admin Promotions | Create, edit, delete, activate/deactivate offers |
| Admin Management | Manage administrator accounts and roles |

---

## Technology Stack

| Category | Technologies |
|---|---|
| **Core** | React 19.2.5 · React DOM 19.2.5 · Vite 8.0.10 · React Router DOM 7.14.2 |
| **UI & Styling** | Tailwind CSS 4.2.4 · Material UI 9.0.0 · MUI Icons · Emotion |
| **API & Auth** | Axios 1.16.0 · JWT · jwt-decode 4.0.0 · browser `localStorage` (admin JWT) |
| **Tooling & Delivery** | ESLint 10.2.1 · Vite React Plugin · Docker · Nginx (production serving) · Vercel (SPA rewrites) |

---

## Architecture

The application uses a **feature/domain-oriented architecture** rather than a single global folder for components, API calls, and business logic. This keeps each domain (products, cart, orders, etc.) cohesive and independently testable.

```text
                         ┌─────────────────────┐
                         │      React App       │
                         │      App.jsx          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      App Router       │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                                ▼
          ┌──────────────────┐             ┌──────────────────┐
          │   Public Store    │             │   Admin Panel     │
          └────────┬─────────┘             └────────┬─────────┘
                   │                                │
                   ▼                                ▼
          ┌──────────────────┐             ┌──────────────────┐
          │ Feature Modules   │             │ Feature Modules   │
          │ products          │             │ auth              │
          │ categories        │             │ products          │
          │ cart              │             │ orders            │
          │ orders            │             │ offers            │
          │ offers            │             │ categories        │
          │ search            │             │ brands            │
          │ comparison        │             │ attributes        │
          │ chat              │             │ banners           │
          └────────┬─────────┘             │ admin             │
                   │                       └────────┬─────────┘
                   └──────────────┬────────────────┘
                                  ▼
                         ┌─────────────────────┐
                         │  Shared Axios API     │
                         │   src/api/client.js   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     REST Backend       │
                         └─────────────────────┘
```

### Request Flow

Every feature follows a consistent, predictable data flow — from UI down to the network layer:

```text
Page / Component → Custom Hook → Service Layer → API Module → Shared Axios Client → REST Backend
```

**Example:**

```text
ProductsPage → useProducts() → products.service.js → products.api.js → api/client.js → GET /products
```

### Standard Feature Layout

Most domain features follow this internal structure, which separates network access, business transformation, and state management:

```text
feature/
├── api/
│   └── *.api.js         # Raw HTTP calls via the shared Axios client
├── hooks/
│   └── use*.js           # React state + async orchestration
└── services/
    └── *.service.js       # Data transformation / business-facing logic
```

**Example — `products` feature:**

```text
src/modules/public/features/products/
├── api/
│   └── products.api.js
├── hooks/
│   ├── useHomepage.js
│   ├── useProductDetail.js
│   ├── useProductFilter.js
│   └── useProducts.js
└── services/
    ├── homePage.service.js
    └── products.service.js
```

This separation prevents API requests, data transformation, state management, and UI rendering from becoming tightly coupled.

---

## Project Structure

```text
E-Commerce-Sys-FrontEnd-PERN-main/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   │
│   ├── api/
│   │   └── client.js                  # Centralized Axios instance
│   │
│   ├── App/
│   │   ├── components/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RoleProtectedRoute.jsx
│   │   ├── hooks/
│   │   │   └── useRole.js
│   │   └── routers/
│   │       ├── AppRouter.jsx
│   │       ├── PublicRoutes.jsx
│   │       └── AdminRoutes.jsx
│   │
│   ├── assets/
│   │   ├── Ozone_Logo.png
│   │   └── video/
│   │       └── cyborg.mp4
│   │
│   ├── modules/
│   │   ├── public/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   ├── pages/
│   │   │   └── sections/
│   │   └── admin/
│   │       ├── components/
│   │       ├── features/
│   │       ├── overlay/
│   │       ├── pages/
│   │       └── utils/
│   │
│   ├── styles/
│   │   └── fonts.js
│   │
│   └── utils/
│       ├── cache.js
│       ├── memoryCache.js
│       ├── dateFormatters.js
│       ├── validators.js
│       ├── normalizers.js
│       ├── payloadExtractors.js
│       ├── normalizeApiError.js
│       ├── serviceError.js
│       └── ...
│
├── doc/
│   ├── API_INTEGRATION_GUIDE.md
│   ├── BACKEND_CONNECTION_SETUP.md
│   ├── FRONTEND_ACCESS_CONTROL_NOTE.md
│   ├── FULL_DOCUMENTATION.md
│   ├── QUICK_REFERENCE.md
│   ├── REFACTORING_SUMMARY.md
│   └── TOKEN_VERIFICATION_GUIDE.md
│
├── Dockerfile
├── nginx.conf
├── vercel.json
├── vite.config.js
├── eslint.config.js
├── index.html
├── package.json
└── package-lock.json
```

---

## Public Store

**Location:** `src/modules/public/`

### Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/products` | Product listing |
| `/product/:id` | Product details |
| `/cart` | Shopping cart |
| `/services` | Services information |
| `/offers` | Offers listing |
| `/offers/:id` | Offer details |
| `/about` | About |
| `/contact` | Contact |
| `/checkout-direct` | Direct checkout |
| `/checkout-cart` | Cart checkout |
| `/track-order` | Order tracking |
| `/compare` | Product comparison |
| `/chat` | AI/chat interface |

### Product Catalog

**Location:** `src/modules/public/features/products/`

Capabilities: listing, details, category browsing, best-selling and latest products, filtering (with per-category filter options), search, images/specifications, stock information, badges, and comparison.

```http
GET  /products
GET  /products/category/:categoryId
GET  /products/best-selling
GET  /products/latest
GET  /products/filter/options/:categoryId
POST /products/filter/:categoryId
GET  /products/:productId
```

### Search

**Location:** `src/modules/public/features/search/`

```http
GET /products/search/:query
```

Exposed through the navigation/search UI.

### Categories

**Location:** `src/modules/public/features/categories/`

Supports separate product and accessory category data.

```http
GET /categories/products
GET /categories/accessories
```

### Shopping Cart

**Location:** `src/modules/public/features/cart/`

Capabilities: load cart, add products, increase/decrease/update quantity, remove items, clear cart, totals, item counts, update notifications.

```http
GET    /cart
POST   /cart
PATCH  /cart/:itemId
DELETE /cart/:itemId
DELETE /cart
```

Cart state is managed through the `useCart` hook and its service layer.

### Checkout & Orders

**Location:** `src/modules/public/features/orders/`

Capabilities: direct checkout, cart checkout, order creation, order tracking, receipt upload, order success flow.

```http
POST /orders/create
POST /orders/tracking
POST /orders/upload-receipt/:orderId
```

> Order creation and receipt upload use longer request timeouts, since these operations may involve larger payloads or payment-related processing.

### Offers & Promotions

**Location:** `src/modules/public/features/offers/`

```http
GET /offers/user
GET /offers
GET /offers/active
GET /offers/upcoming
GET /offers/user/:offerId
GET /offers/user/:offerId/products
```

Provides offer listing, details, associated products, and active/upcoming segmentation.

### Product Comparison (AI-Assisted)

**Location:** `src/modules/public/features/comparison/`

Job-based comparison workflow — a comparison job is started with product IDs, then polled for status/result.

```http
POST /ai
GET  /ai/:jobId
```

Available at `/compare`.

### AI Chat Assistant

**Location:** `src/modules/public/features/chat/`

Sends conversation history, the current message, and optional comparison context.

```http
POST /chat/message
```

Available at `/chat`.

### Banners

**Location:** `src/modules/public/features/banners/`

```http
GET /banners/public/images
GET /banners/public/video
```

Powers the public UI's image and video banner sections.

---

## Admin Panel

**Location:** `src/modules/admin/` · **Base URL:** `/admin`

The admin area is isolated from the public store and guarded by protected routes.

### Routes

| Route | Purpose | Access |
|---|---|---|
| `/admin` | Admin login | Public |
| `/admin/dashboard` | Dashboard | Authenticated admins |
| `/admin/orders` | Order management | Authenticated admins |
| `/admin/orders/:id` | Order details | Authenticated admins |
| `/admin/orders/:id/receipt` | Order receipt | Authenticated admins |
| `/admin/products` | Product management | Authenticated admins |
| `/admin/products/:id` | Product information | Authenticated admins |
| `/admin/products/add` | Add product | Admin / Super Admin |
| `/admin/products/add/attributes` | Product attributes | Admin / Super Admin |
| `/admin/products/:id/edit` | Edit product | Admin / Super Admin |
| `/admin/brands` | Brand management | Admin / Super Admin |
| `/admin/attributes` | Attribute management | Admin / Super Admin |
| `/admin/categories` | Category management | Admin / Super Admin |
| `/admin/promotions` | Promotion management | Authenticated admins |
| `/admin/promotions/:id` | Promotion details | Authenticated admins |
| `/admin/banners` | Banner management | Authenticated admins |
| `/admin/banners/view/:id` | Banner details | Authenticated admins |
| `/admin/admin` | Administrator management | Super Admin |
| `/admin/admin/create` | Create administrator | Super Admin |
| `/admin/settings` | Settings | Authenticated admins |

### Authentication

JWT-based flow. Token stored at `localStorage.admin_token`.

**Service:** `src/modules/admin/features/auth/service/auth.service.js`

Provides: login, token storage, authentication checks, logout, expiration checking. JWT decoding uses `jwt-decode`. The frontend checks token expiration before treating an admin as authenticated.

**Logout flow:**

```text
Remove admin token → Remove stored user data → Redirect to /admin
```

### Role-Based Access Control

Roles: `admin`, `super_admin` — read from the JWT payload.

**Enforcement layer:** `ProtectedRoute`, `RoleRoute`, `useRole`

```text
Authenticated admin
  ├── Dashboard
  ├── Orders
  ├── Products
  ├── Promotions
  ├── Banners
  └── Settings
       │
       ▼
  Admin / Super Admin
  ├── Create/Edit Products
  ├── Brands
  ├── Categories
  └── Attributes
       │
       ▼
  Super Admin
  └── Administrator Management
```

> **Important:** Frontend route protection is a UI/navigation control only. Authorization must be independently enforced by the backend API.

### Dashboard

**Location:** `src/modules/admin/features/dashboard/`, `src/modules/admin/components/Dashboard/`

Surfaces order status, statistics, recent orders, and low-stock alerts.

```http
GET /orders/admin/statuses
GET /orders/admin/low-stock-alert
GET /orders/admin/recent-orders
GET /orders/admin/order-status-count
```

### Product Management

**Location:** `src/modules/admin/features/products/`

Capabilities: listing, details (full/limited/simple), creation, updates, deletion, attributes, image upload/removal/reordering.

```http
GET    /products/admin/limited-details
GET    /products/admin/simple-details
GET    /products/admin/without-attributes
GET    /products/admin/products/:productId
PUT    /products/admin/products/:productId/full-update
DELETE /products/admin/delete/:productId

GET    /attributes/admin/grouped/:categoryId
GET    /attributes/admin/products/:productId/attributes

POST   /products/admin/products/:productId/images
DELETE /products/admin/products/:productId/images/:imageId
PUT    /products/admin/products/:productId/images/reorder
```

### Categories

**Location:** `src/modules/admin/features/categories/`

```http
GET    /categories/admin
GET    /categories/admin/names
POST   /categories
DELETE /categories/:categoryId
```

### Brands

**Location:** `src/modules/admin/features/brands/`

Capabilities: list, create, delete, retrieve names for selection.

```http
GET    /brands/admin
GET    /brands/admin/names
POST   /brands/admin
DELETE /brands/admin/:brandId
```

### Attributes

**Location:** `src/modules/admin/features/attributes/`

Capabilities: attribute create/delete, attribute value create/delete, catalog retrieval.

```http
GET    /attributes/admin
POST   /attributes/admin
DELETE /attributes/admin/:attributeId

POST   /attributes/admin/:attributeId/value
DELETE /attributes/admin/:attributeId/value/:attributeValueId
```

### Banners

**Location:** `src/modules/admin/features/banners/`

Capabilities: listing, creation, deletion, details.

### Promotions

**Location:** `src/modules/admin/features/offers/`

Capabilities: listing, details, create/update/delete, associated products, activate/deactivate.

```http
GET    /offers/admin/
GET    /offers/admin/products/:offerId
POST   /offers/admin
GET    /offers/admin/:offerId
PUT    /offers/admin/:offerId
DELETE /offers/admin/:offerId
PATCH  /offers/admin/:offerId/toggle
```

### Administrator Management (Super Admin)

**Location:** `src/modules/admin/features/admin/`

Capabilities: create, list, update roles, update passwords, delete.

```http
POST   /admin/register
GET    /admin
PATCH  /admin/updateRole/:adminId
PATCH  /admin/settings/updatePassword/:adminId
DELETE /admin/delete/:id
```

---

## Cross-Cutting Concerns

### Centralized API Client

**Location:** `src/api/client.js`

Provides: configurable base URL, request timeout, credentials support, automatic bearer-token injection, and global `401 Unauthorized` handling.

```http
Authorization: Bearer <token>
```

On an expired/invalid session, the client redirects back to `/admin`.

### Error Handling

| Utility | Responsibility |
|---|---|
| `src/utils/normalizeApiError.js` | Normalizes API error shapes |
| `src/utils/serviceError.js` | Service-layer error typing |
| `src/utils/handleHookError.js` | Hook-level error handling |

**Authenticated admin `401` flow:**

```text
401 → Remove admin token → Remove stored user data → Redirect to /admin
```

### Caching

| Layer | Location | Provides | Lifetime |
|---|---|---|---|
| Local storage cache | `src/utils/cache.js` | `getCache`, `setCache`, `clearCache` | Persistent, with timestamp-based expiry |
| Memory cache | `src/utils/memoryCache.js` | `getMemoryCache`, `setMemoryCache`, `clearMemoryCache` | Current session/runtime only |

---

## Getting Started

### Prerequisites

- Node.js 22+ (also used by the production Docker build)
- npm
- Git
- A running, compatible backend API

```bash
node --version
npm --version
```

### Installation

```bash
git clone <repository-url>
cd E-Commerce-Sys-FrontEnd-PERN-main
npm install
```

### Environment Configuration

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:4000/api
```

Production:

```env
VITE_API_URL=https://your-api-domain.com/api
```

> **Note:** The current codebase reads `VITE_API_URL` in `src/api/client.js`. Some legacy docs under `doc/` reference `VITE_API_BASE_URL` — that variable name is stale and should not be used unless the client code is updated to match. Never commit secrets or private environment files to Git.

### Run the Dev Server

```bash
npm run dev
```

Runs at `http://localhost:5173` by default.

---

## Scripts & Tooling

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create the production build (output: `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

A change should pass both `npm run lint` and `npm run build` before being merged.

---

## Deployment

### Docker

Multi-stage build: Node.js builds the app, Nginx serves the static output.

```text
Node.js build stage → npm install → copy source → npm run build → Nginx runtime → serve /dist
```

```bash
docker build -t e-commerce-frontend .
docker run -p 8080:80 e-commerce-frontend
```

Then open `http://localhost:8080`. The production image is based on `nginx:alpine`.

**SPA routing (`nginx.conf`):**

```nginx
try_files $uri $uri/ /index.html;
```

Required so client-side routes (e.g. `/products`, `/product/123`, `/admin/dashboard`, `/track-order`) resolve correctly on direct navigation/refresh.

### Vercel

`vercel.json` includes an SPA rewrite:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Set the `VITE_API_URL` environment variable in the Vercel project to point at the deployed backend.

---

## Security Model

The frontend implements client-side protections:

- Admin authentication state
- JWT expiration checking
- Bearer token injection
- Protected admin routes
- Role-aware navigation
- Environment-based API configuration
- Automatic logout on unauthorized responses

**These are UX/navigation controls, not a security boundary.** The backend must independently verify JWT validity, user identity, role, resource ownership, and permission for administrative operations — a client can bypass all UI restrictions by calling the API directly.

---

## Backend Dependency

This frontend is a pure API consumer and requires a compatible backend exposing resources for:

```text
Authentication · Products · Categories · Brands · Attributes
Cart · Orders · Offers · Banners · Admin management
AI comparison · AI chat
```

Database persistence and server-side business rules live entirely in the backend — this repository does not contain a data layer.

---

## Additional Documentation

Extended docs live under `doc/`:

| File | Purpose |
|---|---|
| `API_INTEGRATION_GUIDE.md` | API integration notes and endpoint expectations |
| `BACKEND_CONNECTION_SETUP.md` | Backend connection/setup information |
| `FRONTEND_ACCESS_CONTROL_NOTE.md` | Frontend vs. backend authorization considerations |
| `FULL_DOCUMENTATION.md` | Extended architecture/documentation notes |
| `QUICK_REFERENCE.md` | Service/API quick reference |
| `REFACTORING_SUMMARY.md` | Refactoring notes |
| `TOKEN_VERIFICATION_GUIDE.md` | Authentication/token verification information |

> Some legacy docs predate the current implementation. When documentation conflicts with source code, **the code is the source of truth**.

---

## Contributing

When adding a new feature:

1. Create a domain-specific feature directory.
2. Keep API requests in the feature's `api/` layer.
3. Put transformation/business logic in `services/`.
4. Use custom hooks for React state and async behavior.
5. Keep reusable UI components separate from page components.
6. Reuse the shared Axios client — don't spin up unrelated instances.
7. Add loading and error states to all async UI.
8. Keep auth/authorization logic centralized.
9. Run the linter before committing.
10. Verify the production build before opening a PR.

---

## Deployment Checklist

- [ ] Backend API is running and reachable
- [ ] `VITE_API_URL` points to the correct backend
- [ ] Production backend allows the frontend origin via CORS
- [ ] HTTPS enabled for production API traffic
- [ ] Admin authentication tested
- [ ] Role-based admin navigation tested
- [ ] Product browsing, search, and filtering verified
- [ ] Cart operations verified
- [ ] Checkout / order creation verified
- [ ] Order tracking and receipt upload verified
- [ ] Offers and product comparison verified
- [ ] AI chat verified
- [ ] Admin product, order, category, brand, attribute, banner, and promotion management verified
- [ ] SPA routes resolve correctly after refresh
- [ ] `npm run lint` passes
- [ ] `npm run build` passes

---

## Project Scope & Status

This repository represents a substantial application, not a minimal starter — with domain-based feature modules, separate public/admin surfaces, centralized API communication, JWT-based admin auth, role-aware routing, dedicated service/API layers, and Docker/Nginx/Vercel deployment configuration.

<details>
<summary><strong>Full feature inventory</strong></summary>

**Public:** Home · Products · Product details · Categories · Search · Filtering · Cart · Checkout · Orders · Order tracking · Receipt upload · Offers · Banners · Product comparison · AI chat · About · Contact · Services

**Administration:** Admin authentication · Dashboard · Orders · Order details · Order receipts · Products · Product creation/editing · Product images · Product attributes · Categories · Brands · Attributes · Banners · Promotions/offers · Administrator accounts · Role management · Settings

</details>

---

## License

No explicit open-source license is currently declared. If this project is intended for public distribution, add a `LICENSE` file and update this section accordingly.

---

**Note:** This document reflects the repository's current source structure and implementation. For backend API contracts, refer to `doc/` and the corresponding backend repository.