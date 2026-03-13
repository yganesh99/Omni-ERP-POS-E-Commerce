const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/categoryController');
const auth = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.use(auth(['admin', 'admin', 'store_manager', 'inventory_manager']));

router.post(
	'/',
	celebrate({
		[Segments.BODY]: Joi.object({
			name: Joi.string().required(),
			description: Joi.string().allow('').optional(),
			isActive: Joi.boolean().optional(),
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
			name: Joi.string().optional(),
			description: Joi.string().allow('').optional(),
			isActive: Joi.boolean().optional(),
		}),
	}),
	controller.update,
);

router.patch('/:id/toggle', controller.toggleActive);

module.exports = router;
