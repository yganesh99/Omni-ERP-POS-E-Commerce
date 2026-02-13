const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/creditController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get(
	'/customer/:id',
	auth(['super_admin', 'business_admin', 'accountant', 'store_manager']),
	controller.getCustomerLedger,
);

router.post(
	'/customer/payment',
	auth(['super_admin', 'business_admin', 'accountant']),
	celebrate({
		[Segments.BODY]: Joi.object({
			businessId: Joi.string().hex().length(24).required(),
			customerId: Joi.string().hex().length(24).required(),
			amount: Joi.number().positive().required(),
		}),
	}),
	controller.customerPayment,
);

router.get(
	'/supplier/:id',
	auth(['super_admin', 'business_admin', 'accountant']),
	controller.getSupplierLedger,
);

router.post(
	'/supplier/payment',
	auth(['super_admin', 'business_admin', 'accountant']),
	celebrate({
		[Segments.BODY]: Joi.object({
			businessId: Joi.string().hex().length(24).required(),
			supplierId: Joi.string().hex().length(24).required(),
			amount: Joi.number().positive().required(),
		}),
	}),
	controller.supplierPayment,
);

module.exports = router;
