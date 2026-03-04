const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/creditController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get(
	'/customer/:id',
	auth(['admin']),
	controller.getCustomerLedger,
);

router.post(
	'/customer/payment',
	auth(['admin']),
	celebrate({
		[Segments.BODY]: Joi.object({
			customerId: Joi.string().hex().length(24).required(),
			amount: Joi.number().positive().required(),
		}),
	}),
	controller.customerPayment,
);

router.get(
	'/supplier/:id',
	auth(['admin']),
	controller.getSupplierLedger,
);

router.post(
	'/supplier/payment',
	auth(['admin']),
	celebrate({
		[Segments.BODY]: Joi.object({
			supplierId: Joi.string().hex().length(24).required(),
			amount: Joi.number().positive().required(),
		}),
	}),
	controller.supplierPayment,
);

module.exports = router;
