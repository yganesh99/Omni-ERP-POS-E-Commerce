const express = require('express');
const controller = require('../controllers/orderController');
const auth = require('../middlewares/auth');
const businessContext = require('../middlewares/businessContext');

const router = express.Router({ mergeParams: true });

router.use(
	auth([
		'super_admin',
		'business_admin',
		'store_manager',
		'accountant',
		'cashier',
	]),
	businessContext,
);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch('/:id/status', controller.updateStatus);

module.exports = router;
