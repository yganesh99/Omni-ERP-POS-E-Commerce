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
			category: Joi.string().allow('').optional(),
			unit: Joi.string().allow('').optional(),
			posPrice: Joi.number().min(0).required(),
			ecommercePrice: Joi.number().min(0).required(),
			costPrice: Joi.number().min(0).required(),
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
router.get('/:id', controller.getById);

router.put(
	'/:id',
	celebrate({
		[Segments.BODY]: Joi.object({
			name: Joi.string().allow(''),
			description: Joi.string().allow(''),
			category: Joi.string().allow(''),
			unit: Joi.string().allow(''),
			posPrice: Joi.number().min(0),
			ecommercePrice: Joi.number().min(0),
			costPrice: Joi.number().min(0),
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
