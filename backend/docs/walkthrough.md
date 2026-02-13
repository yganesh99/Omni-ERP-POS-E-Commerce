# ERP Backend – Walkthrough

## What Was Built

A complete multi-tenant ERP backend covering **12 SRS modules** across **78 source files**.

### Architecture

```
src/
├── app.js                    # Express app with 17 route layers
├── server.js                 # MongoDB connection + listen
├── config/
│   ├── index.js              # Env config + stockLockTTLMinutes
│   └── passport.js           # Google OAuth strategy
├── models/        (17 files) # Mongoose schemas
├── middlewares/    (5 files)  # auth, businessContext, auditLog, errorHandler, validate
├── services/      (18 files) # Business logic layer
├── controllers/   (15 files) # Request handlers
├── routes/        (16 files) # Express routers + Celebrate validation
└── utils/         (1 file)
```

---

## API Endpoints

| Route Prefix                            | Methods                                       | Description                         |
| --------------------------------------- | --------------------------------------------- | ----------------------------------- |
| `/api/auth`                             | POST register, login, refresh; GET me, google | Authentication & JWT                |
| `/api/businesses`                       | CRUD + toggle                                 | Super-admin business management     |
| `/api/businesses/:id/stores`            | CRUD + toggle                                 | Store management                    |
| `/api/businesses/:id/users`             | CRUD + toggle                                 | User management with RBAC           |
| `/api/businesses/:id/products`          | CRUD + toggle                                 | Product catalog (dual pricing)      |
| `/api/businesses/:id/customers`         | CRUD                                          | Customer management + credit limits |
| `/api/businesses/:id/suppliers`         | CRUD                                          | Supplier management + lead times    |
| `/api/businesses/:id/orders`            | GET, PATCH status                             | Order listing & status updates      |
| `/api/businesses/:id/purchase-orders`   | CRUD + approve/send/receive/cancel            | PO lifecycle management             |
| `/api/businesses/:id/supplier-invoices` | CRUD + payment                                | Price-validated invoices            |
| `/api/businesses/:id/taxes`             | CRUD                                          | Tax rate management                 |
| `/api/businesses/:id/reports/*`         | GET (9 endpoints)                             | Sales, inventory, finance, audit    |
| `/api/inventory`                        | GET, adjust, transfer, lock, release          | Stock operations                    |
| `/api/credit`                           | GET ledger, POST payment                      | AR/AP management                    |
| `/api/pos`                              | POST order, refund                            | POS transactions                    |
| `/api/ecommerce`                        | checkout, confirm, assign-store, return       | Ecommerce flow                      |

---

## Key Business Logic

### Stock Locking (Ecommerce)

- `lockStock()` → Mongoose transaction: check availability → increment `reservedQuantity` → create `StockLock` with TTL
- `confirmStock()` → Transaction: decrement `quantity` + `reservedQuantity`, mark lock confirmed
- `releaseStock()` → Decrement `reservedQuantity`, mark lock released
- MongoDB TTL index on `StockLock.expiresAt` auto-deletes expired locks

### Credit Management

- **AR (Customer):** `creditLimit` enforcement on POS credit sales; `currentBalance` updated atomically
- **AP (Supplier):** Tracked via `CreditAccount` ledger; partial payments supported
- Returns automatically reduce outstanding balance for both AR and AP

### PO Lifecycle

`draft → approved → sent → partial_received → closed`

- Receive delivery: Mongoose transaction updates `receivedQty` + creates inventory records
- Supplier invoice creation validates prices match PO (rejects mismatches)

### RBAC

6 roles: `super_admin > business_admin > store_manager > inventory_manager > accountant > cashier`

- JWT includes `role`, `businessId`, `storeId`
- Auth middleware blocks cross-business access for non-super-admins
- Each route specifies allowed roles

---

## Verification

- ✅ `npm install` – 431 packages installed
- ✅ App loads successfully – all module `require()` calls resolve
- ✅ 17 route layers registered:
    - `GET /health`
    - `/api/auth`, `/api/businesses`
    - 10 business-scoped routers (stores, users, products, customers, suppliers, orders, purchase-orders, supplier-invoices, taxes, reports)
    - 4 flat routers (inventory, credit, pos, ecommerce)

> [!NOTE]
> To run the server, you need a MongoDB instance and a `.env` file (see `.env.example`). Start with `npm run dev`.
