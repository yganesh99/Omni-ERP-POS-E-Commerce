const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/posController');
const auth = require('../middlewares/auth');

const router = express.Router();

const paymentDetailSchema = Joi.object({
	method: Joi.string().valid('cash', 'card', 'qr', 'credit').required(),
	amount: Joi.number().min(0).required(),
	reference: Joi.string().optional(),
});

const orderItemSchema = Joi.object({
	productId: Joi.string().hex().length(24).required(),
	quantity: Joi.number().integer().min(1).required(),
});

router.post(
	'/order',
	auth(['super_admin', 'business_admin', 'store_manager', 'cashier']),
	celebrate({
		[Segments.BODY]: Joi.object({
			businessId: Joi.string().hex().length(24).required(),
			storeId: Joi.string().hex().length(24).required(),
			customerId: Joi.string().hex().length(24).optional().allow(null),
			items: Joi.array().items(orderItemSchema).min(1).required(),
			paymentMethod: Joi.string()
				.valid('cash', 'card', 'qr', 'split', 'credit')
				.required(),
			payments: Joi.array().items(paymentDetailSchema).optional(),
			notes: Joi.string().optional().allow(''),
		}),
	}),
	controller.createOrder,
);

router.post(
	'/refund',
	auth(['super_admin', 'business_admin', 'store_manager', 'cashier']),
	celebrate({
		[Segments.BODY]: Joi.object({
			businessId: Joi.string().hex().length(24).required(),
			orderId: Joi.string().hex().length(24).required(),
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
	controller.refund,
);

module.exports = router;
