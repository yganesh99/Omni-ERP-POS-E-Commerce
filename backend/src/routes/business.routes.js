const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/businessController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post(
	'/',
	auth(['super_admin']),
	celebrate({
		[Segments.BODY]: Joi.object({
			name: Joi.string().required(),
			slug: Joi.string().required(),
			logo: Joi.string().uri().optional(),
			address: Joi.object({
				street: Joi.string(),
				city: Joi.string(),
				state: Joi.string(),
				zip: Joi.string(),
				country: Joi.string(),
			}).optional(),
			phone: Joi.string().optional(),
			email: Joi.string().email().optional(),
			taxId: Joi.string().optional(),
			settings: Joi.object({
				currency: Joi.string(),
				stockLockTTLMinutes: Joi.number().integer().min(1),
				defaultTaxRate: Joi.number().min(0),
			}).optional(),
		}),
	}),
	controller.create,
);

router.get('/', auth(['super_admin']), controller.getAll);

router.get('/:id', auth(['super_admin', 'business_admin']), controller.getById);

router.put(
	'/:id',
	auth(['super_admin']),
	celebrate({
		[Segments.BODY]: Joi.object({
			name: Joi.string(),
			logo: Joi.string().uri().allow(''),
			address: Joi.object({
				street: Joi.string(),
				city: Joi.string(),
				state: Joi.string(),
				zip: Joi.string(),
				country: Joi.string(),
			}),
			phone: Joi.string(),
			email: Joi.string().email(),
			taxId: Joi.string(),
			settings: Joi.object({
				currency: Joi.string(),
				stockLockTTLMinutes: Joi.number().integer().min(1),
				defaultTaxRate: Joi.number().min(0),
			}),
		}),
	}),
	controller.update,
);

router.patch('/:id/toggle', auth(['super_admin']), controller.toggleActive);

module.exports = router;
