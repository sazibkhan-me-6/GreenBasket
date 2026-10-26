# GreenBasket — Complete React E-commerce Storefront

A modern, responsive fresh-produce and organic grocery storefront built with React and Vite, organized cleanly into feature folders.

## Folder Structure
- `01-Frontend/` — React UI, layouts, styles, and main application entry (`main.jsx`, `styles.css`)
- `02-Products/` — Product catalog data, categories, and inventory (`products.js`)
- `03-Cart-Checkout/` — Cart drawer component with item management and promo codes (`CartDrawer.jsx`)
- `04-Authentication/` — User login, registration, and role switching modal (`AuthModal.jsx`)
- `05-Admin-Panel/` — Store management dashboard for catalog items and orders (`AdminModal.jsx`)
- `06-Database-API/` — Reactive database and API layer with browser persistence (`api.js`)
- `07-Payment/` — Checkout modal with shipping details, payment options, and receipt (`CheckoutModal.jsx`)
- `08-Images/` — Asset photography guide
- `09-Deployment/` — Deployment instructions for GitHub and Vercel
- `10-Documentation/` — Feature documentation

## Key Features
- **Responsive Storefront**: DM Sans & Manrope typography with nature-inspired palette.
- **Search & Category Filters**: Real-time search across products and fast category switching.
- **Cart & Promo Codes**: Quantity controls, delivery threshold calculation, and promo code support (try `GREEN20` for 20% off).
- **Checkout & Multi-Payment**: Complete shipping details and payment selection (Cash on Delivery, Card, Mobile Banking).
- **Admin Dashboard**: View total revenue, orders, active customers, add new products, and delete products in real time.
- **User Authentication**: Sign in as Customer or Admin with quick one-click demo logins.
- **Persistence**: All changes to products, cart, favorites, and orders automatically persist via `localStorage`.

## Run Locally
Requirements: Node.js 18 or newer.

1. Open this folder in your terminal / VS Code.
2. Install dependencies:
   ```bash
   npm install
   ```
   *(On Windows PowerShell, use `npm.cmd install` if script execution is restricted)*
3. Start development server:
   ```bash
   npm run dev
   # or
   npm.cmd run dev
   ```
4. Open the localhost URL printed by Vite, typically `http://localhost:5173`.

## Build
```bash
npm run build
# or
npm.cmd run build
```
Creates the optimized production bundle in `dist/`.
