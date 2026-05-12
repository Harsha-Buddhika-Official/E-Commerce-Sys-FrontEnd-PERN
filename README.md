# E-Commerce PERN Frontend

A modern, full-featured e-commerce frontend application built with the PERN stack (PostgreSQL, Express, React, Node.js). This project provides both a customer-facing public interface and a comprehensive admin panel for store management.

## 🎯 Project Overview

This is the frontend component of a complete e-commerce platform featuring:

- **Public Store Interface** - Customer-facing shopping experience with product browsing, filtering, and cart management
- **Admin Dashboard** - Complete store management system with orders, inventory, and analytics
- **Production-Ready Architecture** - Scalable component structure with service layer pattern
- **Modern Tech Stack** - React 19, Vite, Tailwind CSS, Material-UI

## 🚀 Tech Stack

### Core Framework
- **React** 19.2.5 - UI library with React DOM 19.2.5
- **React Router DOM** 7.14.2 - Routing and navigation
- **Vite** 8.0.10 - Build tool and dev server

### Styling & UI
- **Tailwind CSS** 4.2.4 - Utility-first CSS framework
- **Material-UI (MUI)** 9.0.0 - Component library with icons
- **Emotion** - CSS-in-JS solution for styled components

### HTTP & API
- **Axios** 1.16.0 - HTTP client for API requests

### Development Tools
- **ESLint** 10.2.1 - Code linting and quality
- **Vite React Plugin** - React Fast Refresh support

## 📁 Project Structure

```
e-commerce-frontend/
├── src/
│   ├── App.jsx                          # Main app component
│   ├── main.jsx                         # React DOM entry point
│   ├── App.css & index.css             # Global styles
│   ├── api/
│   │   └── client.js                   # Axios HTTP client configuration
│   ├── App/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx      # Route protection wrapper
│   │   └── routers/
│   │       ├── AppRouter.jsx           # Main router configuration
│   │       ├── AdminRoutes.jsx         # Admin panel routes
│   │       └── PublicRoutes.jsx        # Public store routes
│   ├── modules/
│   │   ├── admin/                      # Admin panel module
│   │   │   ├── components/             # Admin UI components
│   │   │   ├── pages/                  # Admin pages (Dashboard, Orders, etc.)
│   │   │   ├── features/               # Domain-specific logic (auth, orders, etc.)
│   │   │   └── README.md               # Admin module documentation
│   │   └── public/                     # Public store module
│   │       ├── components/             # Store UI components
│   │       ├── pages/                  # Store pages (Home, Products, etc.)
│   │       ├── features/               # Domain logic (products, categories, etc.)
│   │       └── sections/               # Reusable page sections
│   ├── assets/
│   │   └── video/                      # Video assets
│   └── utils/
│       └── formatAttributeName.js      # Utility functions
├── public/                             # Static assets
├── package.json                        # Project dependencies
├── vite.config.js                      # Vite configuration
├── eslint.config.js                    # ESLint configuration
├── index.html                          # HTML entry point
└── README.md                           # This file
```

## 📦 Main Modules

### Public Module (`src/modules/public/`)
Customer-facing e-commerce store with:

**Pages:**
- `Home.jsx` - Landing page with featured products and categories
- `ProductsPage.jsx` - Product listing with sidebar filters and grid layout
- `ProductInfoPage.jsx` - Detailed product view with images, specs, and pricing
- `AboutPage.jsx`, `ContactPage.jsx`, `ServicesPage.jsx`, `OffersPage.jsx` - Information pages

**Components:**
- **Navigation/** - Navbar, search overlay, category overlay
- **Product/** - ProductCard, ProductGrid, ProductBadge, CategoryTile
- **Cart/** - Shopping cart drawer with item management
- **Filter/** - Advanced product filtering
- **Offer/** - Deal cards with countdown timers
- **Layout/** - Footer and other layout elements

**Features** (Domain Logic):
- **products/** - Product listing and filtering
- **categories/** - Category management
- **Custom Hooks** - useProducts, useProductDetail, useProductFilter, useCategories, useHomepage

### Admin Module (`src/modules/admin/`)
Comprehensive store management dashboard with:

**Pages:**
- `Dashboard.jsx` - KPIs, sales charts, recent orders, low stock alerts
- `Orders.jsx` - Order management with status filtering
- `Products.jsx` - Product catalog with sorting and search
- `Customers.jsx` - Customer list management
- `Inventory.jsx` - Stock level management
- `Promotions.jsx` - Discount and promotion management
- `Reports.jsx` - Analytics and reporting
- `Settings.jsx` - System configuration

**Components:**
- **UI Kit** - Card, Badge, Button, StockBar, EmptyState
- **Charts** - Sales analytics, category breakdown
- **Tables** - Orders, products, customers with sorting/filtering
- **Layout** - Responsive sidebar, topbar navigation

**Features:**
- **auth/** - Admin authentication and login
- **orders/** - Order management
- **dashboard/** - Dashboard metrics and widgets

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+ and npm (or yarn)
- Backend API running (see Backend Connection Setup below)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce-sys-frontend-pern
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the project root with your backend API configuration:
   ```
   VITE_API_BASE_URL=<your-backend-api-url>
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📜 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🏗️ Architecture & Design Patterns

### Service Layer Pattern
All API calls are abstracted into service files within `features/*/api/`:
- **Service files** - Business logic for API interactions (e.g., `products.service.js`)
- **API files** - Raw API calls (e.g., `products.api.js`)
- **Custom Hooks** - React hooks that use services (e.g., `useProducts.js`)

This separation ensures:
- Easy testing and mocking
- Reusable API logic
- Clean component code

### Component Organization
```
Feature/
├── api/
│   ├── service.js          # Business logic
│   ├── api.js              # API calls
│   └── mockData.js         # Development data
├── hooks/
│   └── use*.js             # Custom React hooks
├── services/
│   └── *.service.js        # Service layer
└── components/
    └── *.jsx               # UI components
```

### Responsive Design
- **Mobile-First Approach** - Base styles for mobile, enhanced with Tailwind breakpoints
- **Breakpoints** - sm, md, lg, xl support
- **Flexible Layouts** - Sidebar collapses on mobile, overlays for navigation

## 🛣️ Routing Architecture

### Public Routes
- `/` - Home page
- `/products` - Products listing
- `/product/:id` - Product detail
- `/services`, `/offers`, `/about`, `/contact` - Information pages

### Admin Routes
- `/admin` - Admin login
- `/admin/dashboard` - Dashboard with KPIs
- `/admin/orders` - Order management
- `/admin/products` - Product management
- `/admin/customers` - Customer management
- `/admin/inventory` - Inventory management
- `/admin/promotions` - Promotion management
- `/admin/reports` - Analytics & reports
- `/admin/settings` - System settings

Routes are protected and authenticated via `ProtectedRoute` component.

## 🎨 Design System

### Color Palette
- **Primary** - Black (#111)
- **Accent** - Red (#dc2626) for highlights
- **Neutral** - Various shades of gray
- **Typography** - Sora font family (weights: 400-800)

### Typography
- **Display** - 42px bold for headings
- **Body** - 13-15px for normal text
- **Responsive** - Text sizes adjust for mobile/tablet/desktop

## 🔌 Backend API Integration

The frontend is designed to connect to a PERN backend with the following API structure:

### API Endpoints Used
```
GET  /api/products              - Fetch all products
GET  /api/products/:id          - Fetch product detail
GET  /api/categories            - Fetch product categories
GET  /api/categories/subcategories - Fetch subcategories
POST /api/orders                - Create new order
GET  /api/orders                - Fetch orders
GET  /api/admin/dashboard       - Dashboard metrics
POST /api/auth/login            - Admin authentication
```

All API calls are made through the service layer, making it easy to update endpoints as needed.

## 🔐 Security Notes

- Environment variables are never exposed in client-side code
- API endpoints are centralized and can be updated in one place
- Protected routes require authentication
- CORS configuration should be set up on the backend

## 📚 Key Features

### Public Store
✅ Product browsing with advanced filtering
✅ Product search functionality
✅ Shopping cart management
✅ Responsive design (mobile/tablet/desktop)
✅ Category navigation
✅ Product detail pages with specifications
✅ Offer/promotional displays

### Admin Panel
✅ Dashboard with KPIs and analytics
✅ Order management system
✅ Product catalog management
✅ Customer management
✅ Inventory tracking
✅ Promotion management
✅ Reporting and analytics
✅ Dark mode support
✅ Responsive admin interface

## 🚀 Development Workflow

1. **Feature Development**
   - Create feature in `features/<feature-name>/`
   - Create API service in `features/<feature-name>/api/`
   - Create custom hook in `features/<feature-name>/hooks/`
   - Create components and pages as needed

2. **Component Development**
   - Use Tailwind CSS for styling
   - Follow component naming conventions
   - Create reusable, composable components
   - Add PropTypes or TypeScript as needed

3. **API Integration**
   - Update service files with backend endpoints
   - Replace mock data with real API calls
   - Add error handling and loading states
   - Test with backend

4. **Code Quality**
   - Run `npm run lint` to check code
   - Follow ESLint rules
   - Keep components focused and single-responsibility

## 📝 Environment Configuration

The project uses Vite environment variables. Key variables:
- `VITE_API_BASE_URL` - Backend API base URL (required for production)

These should be configured in `.env` file (not tracked in version control for security).

## 🤝 Contributing

When contributing to this project:
1. Follow the established folder structure
2. Use the service layer pattern for API calls
3. Write reusable, composable components
4. Maintain responsive design principles
5. Keep code clean and well-documented
6. Run linter before committing

## 📖 Documentation Files

- `API_INTEGRATION_GUIDE.md` - Detailed guide for connecting to backend APIs
- `BACKEND_CONNECTION_SETUP.md` - Backend setup and configuration
- `QUICK_REFERENCE.md` - Quick reference for common tasks
- `REFACTORING_SUMMARY.md` - Recent refactoring changes and notes

## 🔄 Project Status

This project is actively developed with:
- ✅ Production-ready frontend architecture
- ✅ Service layer pattern for API abstraction
- ✅ Responsive design on all breakpoints
- ✅ Admin panel fully integrated
- ✅ ESLint configured for code quality
- 🔄 Backend API integration (in progress)

## 📞 Support & Resources

For more detailed information, refer to:
- React Documentation: https://react.dev
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- Vite: https://vitejs.dev
- Material-UI: https://mui.com
- Axios: https://axios-http.com

---

**Project**: E-Commerce PERN Stack Frontend  
**Framework**: React 19 + Vite  
**Version**: 0.0.0  
**License**: MIT
