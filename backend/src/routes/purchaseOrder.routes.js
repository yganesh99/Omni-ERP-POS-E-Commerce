const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/purchaseOrderController');
const auth = require('../middlewares/auth');
const businessContext = require('../middlewares/businessContext');

const router = express.Router({ mergeParams: true });

router.use(
	auth(['super_admin', 'business_admin', 'inventory_manager', 'accountant']),
	businessContext,
);

router.post(
	'/',
	celebrate({
		[Segments.BODY]: Joi.object({
			supplierId: Joi.string().hex().length(24).required(),
			storeId: Joi.string().hex().length(24).required(),
			items: Joi.array()
				.items(
					Joi.object({
						productId: Joi.string().hex().length(24).required(),
						sku: Joi.string().required(),
						name: Joi.string().required(),
						orderedQty: Joi.number().integer().min(1).required(),
						unitPrice: Joi.number().min(0).required(),
					}),
				)
				.min(1)
				.required(),
			notes: Joi.string().optional().allow(''),
		}),
	}),
	controller.create,
);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch('/:id/approve', controller.approve);
router.patch('/:id/send', controller.markSent);

router.post(
	'/:id/receive',
	celebrate({
		[Segments.BODY]: Joi.object({
			items: Joi.array()
				.items(
					Joi.object({
						productId: Joi.string().hex().length(24).required(),
						quantity: Joi.number().integer().min(1).required(),
					}),
				)
				.min(1)
				.required(),
		}),
	}),
	controller.receive,
);

router.patch('/:id/cancel', controller.cancel);

module.exports = router;
