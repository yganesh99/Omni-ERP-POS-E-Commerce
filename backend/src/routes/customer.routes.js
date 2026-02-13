const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/customerController');
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

router.post(
	'/',
	celebrate({
		[Segments.BODY]: Joi.object({
			name: Joi.string().required(),
			email: Joi.string().email().optional(),
			phone: Joi.string().optional(),
			address: Joi.object({
				street: Joi.string(),
				city: Joi.string(),
				state: Joi.string(),
				zip: Joi.string(),
				country: Joi.string(),
			}).optional(),
			creditLimit: Joi.number().min(0).optional(),
		}),
	}),
	controller.create,
);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.put(
	'/:id',
	celebrate({
		[Segments.BODY]: Joi.object({
			name: Joi.string(),
			email: Joi.string().email(),
			phone: Joi.string(),
			address: Joi.object({
				street: Joi.string(),
				city: Joi.string(),
				state: Joi.string(),
				zip: Joi.string(),
				country: Joi.string(),
			}),
			creditLimit: Joi.number().min(0),
		}),
	}),
	controller.update,
);

module.exports = router;
