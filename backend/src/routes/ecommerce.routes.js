const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/ecommerceController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post(
	'/checkout',
	auth(),
	celebrate({
		[Segments.BODY]: Joi.object({
			businessId: Joi.string().hex().length(24).required(),
			storeId: Joi.string().hex().length(24).required(),
			customerId: Joi.string().hex().length(24).optional().allow(null),
			items: Joi.array()
				.items(
					Joi.object({
						productId: Joi.string().hex().length(24).required(),
						quantity: Joi.number().integer().min(1).required(),
					}),
				)
				.min(1)
				.required(),
			sessionId: Joi.string().required(),
			ttlMinutes: Joi.number().integer().min(1).optional(),
		}),
	}),
	controller.checkout,
);

router.post(
	'/confirm-payment',
	auth(),
	celebrate({
		[Segments.BODY]: Joi.object({
			orderId: Joi.string().hex().length(24).required(),
			paymentMethod: Joi.string().valid('cash', 'card', 'qr').optional(),
			payments: Joi.array()
				.items(
					Joi.object({
						method: Joi.string()
							.valid('cash', 'card', 'qr')
							.required(),
						amount: Joi.number().min(0).required(),
						reference: Joi.string().optional(),
					}),
				)
				.optional(),
		}),
	}),
	controller.confirmPayment,
);

router.post(
	'/assign-store',
	auth(['super_admin', 'business_admin']),
	celebrate({
		[Segments.BODY]: Joi.object({
			orderId: Joi.string().hex().length(24).required(),
			storeId: Joi.string().hex().length(24).required(),
		}),
	}),
	controller.assignStore,
);

router.post(
	'/return',
	auth(['super_admin', 'business_admin', 'store_manager', 'cashier']),
	celebrate({
		[Segments.BODY]: Joi.object({
			businessId: Joi.string().hex().length(24).required(),
			orderId: Joi.string().hex().length(24).required(),
			storeId: Joi.string().hex().length(24).required(),
			items: Joi.array()
				.items(
					Joi.object({
						productId: Joi.string().hex().length(24).required(),
						quantity: Joi.number().integer().min(1).required(),
					}),
				)
				.min(1)
				.required(),
			reason: Joi.string().optional(),
		}),
	}),
	controller.processReturn,
);

module.exports = router;
