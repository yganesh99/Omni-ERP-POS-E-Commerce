# Gap Analysis: Backend API vs Frontend UI

**Date:** 2026-03-05  
**Scope:** All backend route files vs all frontend pages/components

---

## Summary

The backend exposes **16 API route groups** with approximately **50+ individual endpoints**. The frontend currently has **25 pages** and a handful of reusable components. Only a small subset of the backend API is actively consumed by the frontend—primarily the **Suppliers**, **Products (partial)**, **POS**, **Registers**, and **Auth** modules. The remaining modules either use **hardcoded/mock data** or have **no corresponding UI at all**.

---

## Audit Results

### Backend Endpoints (Complete)

| #   | Route Group       | Base Path                | Endpoints                                                                                                                                                                                                                                           |
| --- | ----------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Auth              | `/api/auth`              | `POST /register`, `POST /login`, `POST /refresh`, `GET /me`, `GET /google`, `GET /google/callback`                                                                                                                                                  |
| 2   | Stores            | `/api/stores`            | `POST /`, `GET /`, `GET /:id`, `PUT /:id`, `PATCH /:id/toggle`                                                                                                                                                                                      |
| 3   | Users             | `/api/users`             | `POST /`, `GET /`, `GET /:id`, `PUT /:id`, `PATCH /:id/toggle`                                                                                                                                                                                      |
| 4   | Products          | `/api/products`          | `POST /`, `GET /`, `GET /:id`, `PUT /:id`, `POST /:id/image`, `PATCH /:id/toggle`                                                                                                                                                                   |
| 5   | Customers         | `/api/customers`         | `POST /`, `GET /`, `GET /:id`, `PUT /:id`                                                                                                                                                                                                           |
| 6   | Suppliers         | `/api/suppliers`         | `POST /`, `GET /`, `GET /:id`, `PUT /:id`                                                                                                                                                                                                           |
| 7   | Registers         | `/api/registers`         | `POST /`, `GET /`, `POST /:id/open`, `GET /:id/sessions/current`, `POST /sessions/:sessionId/close`                                                                                                                                                 |
| 8   | Orders            | `/api/orders`            | `GET /`, `GET /:id`, `PATCH /:id/status`                                                                                                                                                                                                            |
| 9   | Purchase Orders   | `/api/purchase-orders`   | `POST /`, `GET /`, `GET /:id`, `PATCH /:id/approve`, `PATCH /:id/send`, `POST /:id/receive`, `PATCH /:id/cancel`                                                                                                                                    |
| 10  | Supplier Invoices | `/api/supplier-invoices` | `POST /`, `GET /`, `GET /:id`, `POST /:id/payment`, `POST /:id/attachments`, `DELETE /:id/attachments/:filename`                                                                                                                                    |
| 11  | Taxes             | `/api/taxes`             | `POST /`, `GET /`, `GET /:id`, `PUT /:id`                                                                                                                                                                                                           |
| 12  | Reports           | `/api/reports`           | `GET /sales/by-store`, `GET /sales/by-product`, `GET /sales/by-cashier`, `GET /inventory/low-stock`, `GET /inventory/valuation`, `GET /finance/credit-exposure`, `GET /finance/supplier-payables`, `GET /finance/profit-per-sku`, `GET /audit-logs` |
| 13  | Inventory         | `/api/inventory`         | `GET /`, `POST /adjust`, `POST /transfer`, `POST /lock`, `POST /release`                                                                                                                                                                            |
| 14  | Credit            | `/api/credit`            | `GET /customer/:id`, `POST /customer/payment`, `GET /supplier/:id`, `POST /supplier/payment`                                                                                                                                                        |
| 15  | POS               | `/api/pos`               | `POST /order`, `POST /refund`                                                                                                                                                                                                                       |
| 16  | E-commerce        | `/api/ecommerce`         | `POST /checkout`, `POST /confirm-payment`, `POST /assign-store`, `POST /return`                                                                                                                                                                     |

### Frontend API Integration Status

| Frontend Page          | APIs Consumed                                                                                                                                             | Status                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Sign In                | `POST /auth/login`, `GET /auth/me`                                                                                                                        | ✅ Integrated             |
| Suppliers List         | `GET /suppliers`, `POST /suppliers`                                                                                                                       | ✅ Integrated             |
| Supplier Detail        | `GET /suppliers/:id`, `PUT /suppliers/:id`, `GET /purchase-orders?supplierId`, `GET /supplier-invoices?supplierId`, `POST /supplier-invoices/:id/payment` | ✅ Integrated             |
| Inventory List         | `GET /products`                                                                                                                                           | ✅ Integrated (read-only) |
| Add Product Modal      | `POST /products`                                                                                                                                          | ✅ Integrated             |
| POS Page               | `POST /pos` (via CartPanel)                                                                                                                               | ✅ Integrated             |
| Registers Page         | `GET /registers`, `POST /:id/open`, `GET /:id/sessions/current`, `POST /sessions/:id/close`                                                               | ✅ Integrated             |
| **Customers List**     | **None — hardcoded mock data**                                                                                                                            | ❌ Not Integrated         |
| **Customer Detail**    | **None — hardcoded mock data**                                                                                                                            | ❌ Not Integrated         |
| **Sales / Invoicing**  | **None — hardcoded mock data**                                                                                                                            | ❌ Not Integrated         |
| **Sales Order Detail** | **None — hardcoded mock data**                                                                                                                            | ❌ Not Integrated         |
| **Orders Page**        | **None — hardcoded mock data**                                                                                                                            | ❌ Not Integrated         |
| **Stores Settings**    | **None — hardcoded mock data**                                                                                                                            | ❌ Not Integrated         |
| **Users Settings**     | **None — hardcoded mock data**                                                                                                                            | ❌ Not Integrated         |
| **Dashboard**          | **None — static placeholder**                                                                                                                             | ❌ Not Integrated         |
| **General Settings**   | **None — static placeholder**                                                                                                                             | ❌ Not Integrated         |

---

## Orphaned Endpoints Table

These backend endpoints have **no corresponding frontend UI** integration at all:

| #                               | Endpoint                                           | Method   | Description                   | Recommended UI Placement                                                                                     |
| ------------------------------- | -------------------------------------------------- | -------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Customers Module**            |                                                    |          |                               |                                                                                                              |
| 1                               | `/api/customers`                                   | `GET`    | List all customers            | **Accounts → Customers** page: replace hardcoded `customersData` array with API fetch                        |
| 2                               | `/api/customers`                                   | `POST`   | Create a customer             | **Accounts → Customers** page: wire the "Add Customer" button to open a Dialog that submits to this endpoint |
| 3                               | `/api/customers/:id`                               | `GET`    | Get single customer           | **Accounts → Customers → [id]** page: fetch real customer data on load                                       |
| 4                               | `/api/customers/:id`                               | `PUT`    | Update a customer             | **Accounts → Customers → [id]** page: wire "Save Changes" button to this endpoint                            |
| **Credit Module**               |                                                    |          |                               |                                                                                                              |
| 5                               | `/api/credit/customer/:id`                         | `GET`    | Customer credit ledger        | **Accounts → Customer → [id]** sidebar: wire "View Statement" button to fetch and display ledger             |
| 6                               | `/api/credit/customer/payment`                     | `POST`   | Record customer payment       | **Accounts → Customer → [id]** sidebar: wire "Record Payment" button to submit payment                       |
| 7                               | `/api/credit/supplier/:id`                         | `GET`    | Supplier credit ledger        | **Accounts → Supplier → [id]** sidebar: add a "View Ledger" button                                           |
| 8                               | `/api/credit/supplier/payment`                     | `POST`   | Record supplier payment       | Already partially covered by supplier invoice payment; consider adding a direct balance payment option       |
| **Orders Module**               |                                                    |          |                               |                                                                                                              |
| 9                               | `/api/orders`                                      | `GET`    | List all orders               | **Sales → Orders** page & **Orders** page: replace hardcoded data with API fetch                             |
| 10                              | `/api/orders/:id`                                  | `GET`    | Get single order              | **Sales → Orders → [id]** page: fetch real order data                                                        |
| 11                              | `/api/orders/:id/status`                           | `PATCH`  | Update order status           | **Sales → Orders → [id]** page: add status-change dropdown/buttons                                           |
| **Stores Module**               |                                                    |          |                               |                                                                                                              |
| 12                              | `/api/stores`                                      | `GET`    | List all stores               | **Settings → Stores** page: replace hardcoded data with API fetch                                            |
| 13                              | `/api/stores`                                      | `POST`   | Create a store                | **Settings → Stores** page: wire "Add Store" button to a Dialog                                              |
| 14                              | `/api/stores/:id`                                  | `GET`    | Get single store              | **Settings → Stores** page: add an edit Dialog that fetches store data                                       |
| 15                              | `/api/stores/:id`                                  | `PUT`    | Update a store                | **Settings → Stores** page: wire edit form submission                                                        |
| 16                              | `/api/stores/:id/toggle`                           | `PATCH`  | Toggle store active status    | **Settings → Stores** page: add toggle switch in table actions                                               |
| **Users Module**                |                                                    |          |                               |                                                                                                              |
| 17                              | `/api/users`                                       | `GET`    | List all users                | **Settings → Users** page: replace hardcoded data with API fetch                                             |
| 18                              | `/api/users`                                       | `POST`   | Create a user                 | **Settings → Users** page: wire "Invite User" button to a Dialog                                             |
| 19                              | `/api/users/:id`                                   | `GET`    | Get single user               | **Settings → Users** page: add edit Dialog that fetches user                                                 |
| 20                              | `/api/users/:id`                                   | `PUT`    | Update a user                 | **Settings → Users** page: wire edit form submission                                                         |
| 21                              | `/api/users/:id/toggle`                            | `PATCH`  | Toggle user active status     | **Settings → Users** page: add toggle action per row                                                         |
| **Taxes Module**                |                                                    |          |                               |                                                                                                              |
| 22                              | `/api/taxes`                                       | `GET`    | List tax rates                | **Settings → General** page: add a "Tax Rates" section with a table                                          |
| 23                              | `/api/taxes`                                       | `POST`   | Create tax rate               | **Settings → General** page: add "Add Tax Rate" Dialog                                                       |
| 24                              | `/api/taxes/:id`                                   | `GET`    | Get single tax                | **Settings → General** page: inline in edit Dialog                                                           |
| 25                              | `/api/taxes/:id`                                   | `PUT`    | Update tax rate               | **Settings → General** page: wire edit form submission                                                       |
| **Reporting Module**            |                                                    |          |                               |                                                                                                              |
| 26                              | `/api/reports/sales/by-store`                      | `GET`    | Sales by store report         | **Dashboard** or new **Reports** page: add a "Sales by Store" chart/table                                    |
| 27                              | `/api/reports/sales/by-product`                    | `GET`    | Sales by product report       | **Dashboard** or **Reports** page: add "Sales by Product" chart                                              |
| 28                              | `/api/reports/sales/by-cashier`                    | `GET`    | Sales by cashier report       | **Reports** page: add "Sales by Cashier" section                                                             |
| 29                              | `/api/reports/inventory/low-stock`                 | `GET`    | Low stock alerts              | **Dashboard** page: add "Low Stock Alerts" card; also **Inventory** page                                     |
| 30                              | `/api/reports/inventory/valuation`                 | `GET`    | Inventory valuation           | **Reports** page or **Inventory** overview: add valuation summary                                            |
| 31                              | `/api/reports/finance/credit-exposure`             | `GET`    | Credit exposure report        | **Reports** page: add "Credit Exposure" section                                                              |
| 32                              | `/api/reports/finance/supplier-payables`           | `GET`    | Supplier payables summary     | **Reports** page or **Accounts → Suppliers** overview                                                        |
| 33                              | `/api/reports/finance/profit-per-sku`              | `GET`    | Profit per SKU analysis       | **Reports** page: add "Profit per SKU" table                                                                 |
| 34                              | `/api/reports/audit-logs`                          | `GET`    | System audit logs             | **Settings → General** or new **Settings → Audit Log** page                                                  |
| **Inventory Operations**        |                                                    |          |                               |                                                                                                              |
| 35                              | `/api/inventory`                                   | `GET`    | Get stock levels              | **Inventory** page: enhance product list with per-store stock levels                                         |
| 36                              | `/api/inventory/adjust`                            | `POST`   | Manual stock adjustment       | **Inventory → Product → [id]** page: add "Adjust Stock" Dialog                                               |
| 37                              | `/api/inventory/transfer`                          | `POST`   | Inter-store transfer          | **Inventory** page: add "Transfer Stock" Dialog or dedicated page                                            |
| 38                              | `/api/inventory/lock`                              | `POST`   | Lock inventory (reservations) | Used internally by POS/e-commerce; no direct UI needed                                                       |
| 39                              | `/api/inventory/release`                           | `POST`   | Release locked inventory      | Used internally by POS/e-commerce; no direct UI needed                                                       |
| **Product Management**          |                                                    |          |                               |                                                                                                              |
| 40                              | `/api/products/:id`                                | `GET`    | Get single product            | **Inventory → Products → [id]** page: fetch real data (currently may be partial)                             |
| 41                              | `/api/products/:id`                                | `PUT`    | Update product                | **Inventory → Products → [id]** page: wire edit form                                                         |
| 42                              | `/api/products/:id/image`                          | `POST`   | Upload product image          | **Inventory → Products → [id]** page or Add Product Modal: add image upload                                  |
| 43                              | `/api/products/:id/toggle`                         | `PATCH`  | Toggle product active         | **Inventory** page: add toggle switch per product row                                                        |
| **Purchase Order Lifecycle**    |                                                    |          |                               |                                                                                                              |
| 44                              | `/api/purchase-orders/:id/approve`                 | `PATCH`  | Approve a PO                  | **Inventory → Purchase Orders → [id]** page: add "Approve" action button                                     |
| 45                              | `/api/purchase-orders/:id/send`                    | `PATCH`  | Mark PO as sent               | **Inventory → Purchase Orders → [id]** page: add "Mark Sent" button                                          |
| 46                              | `/api/purchase-orders/:id/receive`                 | `POST`   | Receive goods against PO      | **Inventory → Purchase Orders → [id]** page: add "Receive Goods" Dialog                                      |
| 47                              | `/api/purchase-orders/:id/cancel`                  | `PATCH`  | Cancel a PO                   | **Inventory → Purchase Orders → [id]** page: add "Cancel PO" button                                          |
| **Supplier Invoice Management** |                                                    |          |                               |                                                                                                              |
| 48                              | `/api/supplier-invoices`                           | `POST`   | Create supplier invoice       | **Accounts → Supplier → [id]** or **Purchase Orders → [id]** page: add "Create Invoice" Dialog               |
| 49                              | `/api/supplier-invoices/:id`                       | `GET`    | Get single invoice detail     | **Accounts → Supplier → [id]** invoices Dialog: add clickable detail view                                    |
| 50                              | `/api/supplier-invoices/:id/attachments`           | `POST`   | Upload invoice attachments    | **Supplier Invoice Detail** view: add file upload UI                                                         |
| 51                              | `/api/supplier-invoices/:id/attachments/:filename` | `DELETE` | Remove an attachment          | **Supplier Invoice Detail** view: add delete button per attachment                                           |
| **E-commerce Module**           |                                                    |          |                               |                                                                                                              |
| 52                              | `/api/ecommerce/checkout`                          | `POST`   | E-commerce checkout           | Future **E-commerce** section or external storefront integration                                             |
| 53                              | `/api/ecommerce/confirm-payment`                   | `POST`   | Confirm e-commerce payment    | Future **E-commerce** section                                                                                |
| 54                              | `/api/ecommerce/assign-store`                      | `POST`   | Assign order to store         | Future **E-commerce → Orders** management                                                                    |
| 55                              | `/api/ecommerce/return`                            | `POST`   | Process e-commerce return     | Future **E-commerce → Returns** management                                                                   |
| **POS Module**                  |                                                    |          |                               |                                                                                                              |
| 56                              | `/api/pos/refund`                                  | `POST`   | Process POS refund            | **POS → Orders** page: add "Refund" action button per order                                                  |
| **Auth Module**                 |                                                    |          |                               |                                                                                                              |
| 57                              | `/api/auth/register`                               | `POST`   | Register new user             | **Sign Up** page (currently no sign-up page exists)                                                          |
| 58                              | `/api/auth/refresh`                                | `POST`   | Refresh JWT token             | Should be handled automatically in API interceptor (no UI needed)                                            |
| 59                              | `/api/auth/google`                                 | `GET`    | Google OAuth login            | **Sign In** page: add "Sign in with Google" button                                                           |
| 60                              | `/api/registers`                                   | `POST`   | Create a new register         | **Settings** or **POS Admin**: add "Create Register" Dialog                                                  |

---

## Priority Recommendations

### 🔴 High Priority (Core business features with existing UI shells)

1. **Customers Module** — The list and detail pages exist but use hardcoded data. Wire up `GET/POST/PUT /customers` endpoints.
2. **Orders / Sales Module** — Both the Sales page and Orders page display mock data. Integrate `GET /orders` and `GET /orders/:id`.
3. **Stores Settings** — Page exists with mock data. Integrate all `/stores` CRUD endpoints.
4. **Users Settings** — Page exists with mock data. Integrate all `/users` CRUD endpoints.

### 🟡 Medium Priority (Missing UI that enhances existing features)

5. **Credit Ledger & Payments** — Customer detail page has a "Record Payment" and "View Statement" button that are non-functional. Wire to `/credit/customer` endpoints.
6. **Tax Management** — No UI exists. Add a tax rates management table in Settings → General.
7. **Purchase Order Lifecycle** — PO detail page likely missing approve/send/receive/cancel actions.
8. **Reporting / Dashboard** — Dashboard is static. Wire to `/reports/*` endpoints for live data.
9. **Product Edit & Image Upload** — Product detail page exists but may not be wired to `PUT /products/:id` and `POST /products/:id/image`.
10. **Stock Adjustments & Transfers** — No UI for manual stock operations via `/inventory/adjust` and `/inventory/transfer`.

### 🟢 Low Priority (Future features)

11. **E-commerce Module** — All 4 endpoints are backend-only for now (likely for a future storefront).
12. **Google OAuth** — Add "Sign in with Google" to the login page.
13. **User Registration Page** — Create a sign-up page if needed.
14. **Audit Logs** — Add an audit log viewer in Settings.

---

_This document was auto-generated by auditing all route files in `backend/src/routes/` and cross-referencing with all pages in `frontend/erp-app/src/app/`._
