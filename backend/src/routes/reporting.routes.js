const express = require('express');
const controller = require('../controllers/reportingController');
const auth = require('../middlewares/auth');
const businessContext = require('../middlewares/businessContext');

const router = express.Router({ mergeParams: true });

router.use(
	auth(['super_admin', 'business_admin', 'accountant']),
	businessContext,
);

// Sales reports
router.get('/sales/by-store', controller.salesByStore);
router.get('/sales/by-product', controller.salesByProduct);
router.get('/sales/by-cashier', controller.salesByCashier);

// Inventory reports
router.get('/inventory/low-stock', controller.lowStock);
router.get('/inventory/valuation', controller.inventoryValuation);

// Finance reports
router.get('/finance/credit-exposure', controller.creditExposure);
router.get('/finance/supplier-payables', controller.supplierPayables);
router.get('/finance/profit-per-sku', controller.profitPerSku);

// Audit logs
router.get('/audit-logs', controller.auditLogs);

module.exports = router;
