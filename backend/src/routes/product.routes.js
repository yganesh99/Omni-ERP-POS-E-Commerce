const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/productController');
const auth = require('../middlewares/auth');
const businessContext = require('../middlewares/businessContext');

const router = express.Router({ mergeParams: true });

router.use(
	auth([
		'super_admin',
		'business_admin',
		'store_manager',
		'inventory_manager',
	]),
	businessContext,
);

router.post(
	'/',
	celebrate({
		[Segments.BODY]: Joi.object({
			sku: Joi.string().required(),
			name: Joi.string().required(),
			description: Joi.string().optional(),
			category: Joi.string().optional(),
			unit: Joi.string().optional(),
			posPrice: Joi.number().min(0).required(),
			ecommercePrice: Joi.number().min(0).required(),
			costPrice: Joi.number().min(0).required(),
			taxRate: Joi.number().min(0).optional(),
			visibility: Joi.string()
				.valid('pos_only', 'ecommerce_only', 'both')
				.optional(),
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
			description: Joi.string(),
			category: Joi.string(),
			unit: Joi.string(),
			posPrice: Joi.number().min(0),
			ecommercePrice: Joi.number().min(0),
			costPrice: Joi.number().min(0),
			taxRate: Joi.number().min(0),
			visibility: Joi.string().valid(
				'pos_only',
				'ecommerce_only',
				'both',
			),
		}),
	}),
	controller.update,
);

router.patch('/:id/toggle', controller.toggleActive);

module.exports = router;
