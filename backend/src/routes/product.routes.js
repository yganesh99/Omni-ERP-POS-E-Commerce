const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/productController');
const auth = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.use(auth(['admin', 'admin', 'store_manager', 'inventory_manager']));

router.post(
	'/',
	celebrate({
		[Segments.BODY]: Joi.object({
			sku: Joi.string().required(),
			name: Joi.string().required(),
			description: Joi.string().allow('').optional(),
			categories: Joi.array().items(Joi.string()).optional(),
			unit: Joi.string().allow('').optional(),
			posPrice: Joi.number().min(0).required(),
			ecommercePrice: Joi.number().min(0).required(),
			isOnSale: Joi.boolean().optional(),
			salePrice: Joi.number().min(0).optional(),
			taxRate: Joi.number().min(0).optional(),
			visibility: Joi.string()
				.valid('pos_only', 'ecommerce_only', 'both')
				.optional(),
			image: Joi.string().allow('').optional(),
		}),
	}),
	controller.create,
);

router.get('/', controller.getAll);
router.get(
	'/pos-search',
	auth(['admin', 'store_manager', 'inventory_manager', 'cashier']),
	controller.searchForPos,
);
router.get('/:id', controller.getById);

router.put(
	'/:id',
	celebrate({
		[Segments.BODY]: Joi.object({
			name: Joi.string().allow(''),
			sku: Joi.string().optional(),
			description: Joi.string().allow(''),
			categories: Joi.array().items(Joi.string()).optional(),
			unit: Joi.string().allow(''),
			posPrice: Joi.number().min(0),
			ecommercePrice: Joi.number().min(0),
			isOnSale: Joi.boolean().optional(),
			salePrice: Joi.number().min(0).allow(null),
			taxRate: Joi.number().min(0),
			visibility: Joi.string().valid(
				'pos_only',
				'ecommerce_only',
				'both',
			),
			image: Joi.string().allow('').optional(),
		}),
	}),
	controller.update,
);

const createUpload = require('../middlewares/upload');
const upload = createUpload('products');

router.post('/:id/image', upload.single('image'), controller.uploadImage);

router.patch('/:id/toggle', controller.toggleActive);

module.exports = router;
