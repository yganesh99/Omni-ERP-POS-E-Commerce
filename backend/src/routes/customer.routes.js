const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/customerController');
const auth = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.use(auth(['admin', 'admin', 'store_manager', 'accountant', 'cashier']));

router.post(
	'/',
	celebrate({
		[Segments.BODY]: Joi.object({
			name: Joi.string().required(),
			email: Joi.string().email().allow('').optional(),
			phone: Joi.string().allow('').optional(),
			address: Joi.object({
				street: Joi.string().allow(''),
				city: Joi.string().allow(''),
				state: Joi.string().allow(''),
				zip: Joi.string().allow(''),
				country: Joi.string().allow(''),
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
			name: Joi.string().allow(''),
			email: Joi.string().email().allow(''),
			phone: Joi.string().allow(''),
			address: Joi.object({
				street: Joi.string().allow(''),
				city: Joi.string().allow(''),
				state: Joi.string().allow(''),
				zip: Joi.string().allow(''),
				country: Joi.string().allow(''),
			}),
			creditLimit: Joi.number().min(0),
		}),
	}),
	controller.update,
);

module.exports = router;
