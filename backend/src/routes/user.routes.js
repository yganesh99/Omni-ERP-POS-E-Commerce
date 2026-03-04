const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/userController');
const auth = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.use(auth(['admin']));

router.post(
	'/',
	celebrate({
		[Segments.BODY]: Joi.object({
			email: Joi.string().email().required(),
			password: Joi.string().min(8).required(),
			name: Joi.string().required(),
			phone: Joi.string().allow('').optional(),
			role: Joi.string()
				.valid(
					// 'admin',
					'store_manager',
					'inventory_manager',
					'accountant',
					'cashier',
				)
				.required(),
			storeId: Joi.string().hex().length(24).optional(),
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
			phone: Joi.string().allow(''),
			role: Joi.string().valid(
				'admin',
				'store_manager',
				'inventory_manager',
				'accountant',
				'cashier',
			),
			storeId: Joi.string().hex().length(24).allow(null),
		}),
	}),
	controller.update,
);

router.patch('/:id/toggle', controller.toggleActive);

module.exports = router;
