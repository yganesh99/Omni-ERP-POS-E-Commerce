const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/supplierInvoiceController');
const auth = require('../middlewares/auth');
const createUpload = require('../middlewares/upload');
const upload = createUpload('invoices');

const router = express.Router({ mergeParams: true });

router.use(auth(['admin']));

router.post(
	'/',
	celebrate({
		[Segments.BODY]: Joi.object({
			supplierId: Joi.string().hex().length(24).required(),
			purchaseOrderId: Joi.string().hex().length(24).required(),
			invoiceNumber: Joi.string().required(),
			items: Joi.array()
				.items(
					Joi.object({
						productId: Joi.string().hex().length(24).required(),
						sku: Joi.string().required(),
						name: Joi.string().required(),
						quantity: Joi.number().integer().min(1).required(),
						unitPrice: Joi.number().min(0).required(),
						lineTotal: Joi.number().min(0).required(),
					}),
				)
				.min(1)
				.required(),
			totalAmount: Joi.number().min(0).required(),
		}),
	}),
	controller.create,
);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.post(
	'/:id/payment',
	celebrate({
		[Segments.BODY]: Joi.object({
			amount: Joi.number().positive().required(),
		}),
	}),
	controller.recordPayment,
);

router.post(
	'/:id/attachments',
	upload.array('files', 5),
	controller.uploadAttachments,
);

router.delete('/:id/attachments/:filename', controller.removeAttachment);

module.exports = router;
