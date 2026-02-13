const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const businessRoutes = require('./routes/business.routes');
const storeRoutes = require('./routes/store.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const customerRoutes = require('./routes/customer.routes');
const supplierRoutes = require('./routes/supplier.routes');
const creditRoutes = require('./routes/credit.routes');
const posRoutes = require('./routes/pos.routes');
const ecommerceRoutes = require('./routes/ecommerce.routes');
const orderRoutes = require('./routes/order.routes');
const purchaseOrderRoutes = require('./routes/purchaseOrder.routes');
const supplierInvoiceRoutes = require('./routes/supplierInvoice.routes');
const taxRoutes = require('./routes/tax.routes');
const reportingRoutes = require('./routes/reporting.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

require('./config/passport');
const passport = require('passport');
app.use(passport.initialize());

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
});

// ── Health ──────────────────────────────────────────────────────
app.get('/health', (req, res) =>
	res.json({ status: 'ok', uptime: process.uptime() }),
);

// ── Auth ────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);

// ── Platform-level ──────────────────────────────────────────────
app.use('/api/businesses', businessRoutes);

// ── Business-scoped ─────────────────────────────────────────────
app.use('/api/businesses/:businessId/stores', storeRoutes);
app.use('/api/businesses/:businessId/users', userRoutes);
app.use('/api/businesses/:businessId/products', productRoutes);
app.use('/api/businesses/:businessId/customers', customerRoutes);
app.use('/api/businesses/:businessId/suppliers', supplierRoutes);
app.use('/api/businesses/:businessId/orders', orderRoutes);
app.use('/api/businesses/:businessId/purchase-orders', purchaseOrderRoutes);
app.use('/api/businesses/:businessId/supplier-invoices', supplierInvoiceRoutes);
app.use('/api/businesses/:businessId/taxes', taxRoutes);
app.use('/api/businesses/:businessId/reports', reportingRoutes);

// ── Flat routes ─────────────────────────────────────────────────
app.use('/api/inventory', inventoryRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/ecommerce', ecommerceRoutes);

// ── Error handling ──────────────────────────────────────────────
app.use(errors());
app.use(errorHandler);

module.exports = app;
