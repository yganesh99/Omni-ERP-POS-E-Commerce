const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/inventoryController');
const auth = require('../middlewares/auth');

const router = express.Router();

const itemSchema = Joi.object({
	productId: Joi.string().hex().length(24).required(),
	quantity: Joi.number().min(0.001).required(),
});

router.get(
	'/',
	auth([
		'admin',
		'admin',
		'store_manager',
		'inventory_manager',
	]),
	controller.getStock,
);

router.post(
	'/adjust',
	auth(['admin']),
	celebrate({
		[Segments.BODY]: Joi.object({
			productId: Joi.string().hex().length(24).required(),
			storeId: Joi.string().hex().length(24).required(),
			quantityChange: Joi.number().required(),
		}),
	}),
	controller.adjust,
);

router.post(
	'/transfer',
	auth([
		'admin',
		'admin',
		'store_manager',
		'inventory_manager',
	]),
	celebrate({
		[Segments.BODY]: Joi.object({
			fromStoreId: Joi.string().hex().length(24).required(),
			toStoreId: Joi.string().hex().length(24).required(),
			items: Joi.array().items(itemSchema).min(1).required(),
		}),
	}),
	controller.transfer,
);

router.post(
	'/lock',
	auth(),
	celebrate({
		[Segments.BODY]: Joi.object({
			storeId: Joi.string().hex().length(24).required(),
			items: Joi.array().items(itemSchema).min(1).required(),
			sessionId: Joi.string().required(),
			ttlMinutes: Joi.number().integer().min(1).optional(),
		}),
	}),
	controller.lock,
);

router.post(
	'/release',
	auth(),
	celebrate({
		[Segments.BODY]: Joi.object({
			sessionId: Joi.string().required(),
		}),
	}),
	controller.release,
);

module.exports = router;
