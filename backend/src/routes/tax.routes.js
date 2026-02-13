const express = require('express');
const { celebrate, Joi, Segments } = require('celebrate');
const controller = require('../controllers/taxController');
const auth = require('../middlewares/auth');
const businessContext = require('../middlewares/businessContext');

const router = express.Router({ mergeParams: true });

router.use(
	auth(['super_admin', 'business_admin', 'accountant']),
	businessContext,
);

router.post(
	'/',
	celebrate({
		[Segments.BODY]: Joi.object({
			name: Joi.string().required(),
			rate: Joi.number().min(0).required(),
			isDefault: Joi.boolean().optional(),
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
			rate: Joi.number().min(0),
			isDefault: Joi.boolean(),
			isActive: Joi.boolean(),
		}),
	}),
	controller.update,
);

module.exports = router;
