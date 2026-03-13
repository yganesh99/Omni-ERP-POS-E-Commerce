const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const storeRoutes = require('./routes/store.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
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
const registerRoutes = require('./routes/register.routes');
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

const authLimiter =
	process.env.NODE_ENV === 'test'
		? (_req, _res, next) => next() // disabled in test mode
		: rateLimit({
				windowMs: 15 * 60 * 1000,
				max: 100,
			});

// ── Health ──────────────────────────────────────────────────────
app.get('/api/health', (req, res) =>
	res.json({ status: 'ok', uptime: process.uptime() }),
);

// ── Auth ────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);

// ── Store & Resource Routes ─────────────────────────────────────────────
app.use('/api/stores', storeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/registers', registerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/supplier-invoices', supplierInvoiceRoutes);
app.use('/api/taxes', taxRoutes);
app.use('/api/reports', reportingRoutes);

// ── Flat routes ─────────────────────────────────────────────────
app.use('/api/inventory', inventoryRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/ecommerce', ecommerceRoutes);

// ── Error handling ──────────────────────────────────────────────
app.use(errors());
app.use(errorHandler);

module.exports = app;
