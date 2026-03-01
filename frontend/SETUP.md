# FabricHub Frontend Setup

This repository contains two production-ready Next.js 14 applications built following a monolithic frontend structure inside the `/frontend` directory:

1. **`ecommerce-app`**: Storefront for end users facing application (mirrors the Figma design pixel-perfectly).
2. **`erp-app`**: Internal admin dashboard for managing inventory, orders, and business metrics.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (with responsive custom class utilities)
- **Icons**: Lucide React
- **Language**: TypeScript

## Project Structure

```bash
/frontend
  ├── ecommerce-app/   # Customer-facing storefront
  └── erp-app/         # Internal ERP Dashboard
```

## Running the Applications

### 1. Ecommerce App (Storefront)

Navigate to the storefront directory and install dependencies if not already done:

```bash
cd frontend/ecommerce-app
npm install
```

Start the development server:

```bash
npm run dev
```

The Storefront will be available at [http://localhost:3000](http://localhost:3000).

**Key Routes Implemented:**

- `/` - Homepage (with Hero, Feature categories, and product listing placeholders)
- `/login` - Auth Screen 1
- `/signup` - Auth Screen 2
- `/shop` - Product Listing Page (PLP)
- `/shop/[id]` - Product Detail Page (PDP)

### 2. ERP App (Admin Dashboard)

Navigate to the ERP directory and install dependencies:

```bash
cd frontend/erp-app
npm install
```

Start the development server (you might want to run it on a different port if the ecommerce app is running):

```bash
npm run dev -- -p 3001
```

The ERP Dashboard will be available at [http://localhost:3001](http://localhost:3001).

**Key Routes Implemented:**

- `/` - Main Dashboard Overview
- `/inventory` - Inventory Data Table
- `/orders` - Orders Data Table

## Design System Notes

- A shared configuration approach was utilized where `tailwind.config.ts` was extended with `brand-red`, `brand-blue`, `brand-dark`, etc.
- Standardized UI components (Button, Input, Card, Table) were extracted into `src/components/ui/` in line with standard Headless UI / Shadcn conventions to keep the code modular and easily testable.
